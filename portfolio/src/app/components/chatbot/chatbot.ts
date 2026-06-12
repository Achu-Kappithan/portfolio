import { Component, signal, ViewChild, ElementRef, inject, effect, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class Chatbot implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  private sanitizer = inject(DomSanitizer);

  isOpen = signal<boolean>(false);
  userMessage = signal<string>('');
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('robotRef') private robotRef!: ElementRef;

  // Physics state for the traveling robot
  private animationFrameId?: number;
  private robotX = window.innerWidth - 120;
  private robotY = window.innerHeight - 200;
  private robotVx = 0;
  private robotVy = 0;
  private robotRotation = 0;
  private maxSpeed = 1.6; // Slightly faster to drift towards the cursor

  // Target mouse coordinates (default to bottom-right area)
  private mouseX = window.innerWidth - 100;
  private mouseY = window.innerHeight - 250;

  suggestions = [
    'Why hire Achu?',
    'Tell me about FobVerse',
    'What is his MEAN stack experience?',
    'Get contact details'
  ];

  constructor() {
    // Reactively watch messages, typing indicators, and open status
    effect(() => {
      const msgs = this.chatService.messages();
      const typing = this.chatService.isTyping();
      const open = this.isOpen();

      if (open) {
        // Wait briefly for Angular to render the new message DOM elements
        setTimeout(() => {
          this.handleScrollBehavior(msgs, typing);
        }, 80);
      }
    });
  }

  // Track the mouse coordinates on screen
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  ngOnInit() {
    this.startRobotTravel();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startRobotTravel() {
    const updatePosition = () => {
      // Only animate if the chat is closed
      if (!this.isOpen()) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const robotWidth = 70;
        const robotHeight = 84;
        
        // Target is the mouse center
        const targetX = this.mouseX - robotWidth / 2;
        const targetY = this.mouseY - robotHeight / 2;

        // Calculate distance from robot to cursor
        const dx = targetX - this.robotX;
        const dy = targetY - this.robotY;

        // Easing attraction pull (very gentle)
        const ease = 0.005;
        this.robotVx += dx * ease;
        this.robotVy += dy * ease;

        // Add a tiny random wind sway so it tilts and hovers organically
        this.robotVx += (Math.random() - 0.5) * 0.015;
        this.robotVy += (Math.random() - 0.5) * 0.015;

        // Apply drag/friction to prevent infinite orbiting around the cursor
        const friction = 0.94;
        this.robotVx *= friction;
        this.robotVy *= friction;

        // Clamp speed to keep movement smooth and floating
        const speed = Math.sqrt(this.robotVx * this.robotVx + this.robotVy * this.robotVy);
        if (speed > this.maxSpeed) {
          this.robotVx = (this.robotVx / speed) * this.maxSpeed;
          this.robotVy = (this.robotVy / speed) * this.maxSpeed;
        }

        // Apply velocities to coordinates
        this.robotX += this.robotVx;
        this.robotY += this.robotVy;

        // Collision boundaries (with 25px screen padding)
        if (this.robotX < 25) {
          this.robotX = 25;
          this.robotVx = Math.abs(this.robotVx) * 0.5; // Cushioned bounce
        } else if (this.robotX > width - robotWidth - 25) {
          this.robotX = width - robotWidth - 25;
          this.robotVx = -Math.abs(this.robotVx) * 0.5;
        }

        // Keep it above the bottom trigger/footer area
        if (this.robotY < 25) {
          this.robotY = 25;
          this.robotVy = Math.abs(this.robotVy) * 0.5;
        } else if (this.robotY > height - robotHeight - 110) {
          this.robotY = height - robotHeight - 110;
          this.robotVy = -Math.abs(this.robotVy) * 0.5;
        }

        // Tilt the robot based on its horizontal movement velocity
        this.robotRotation = this.robotVx * 12;

        // Render position using translate3d (GPU accelerated)
        if (this.robotRef && this.robotRef.nativeElement) {
          this.robotRef.nativeElement.style.transform = `translate3d(${this.robotX}px, ${this.robotY}px, 0) rotate(${this.robotRotation}deg)`;
        }
      }

      this.animationFrameId = requestAnimationFrame(updatePosition);
    };

    this.animationFrameId = requestAnimationFrame(updatePosition);
  }

  toggleChat() {
    this.isOpen.update(val => !val);
  }

  async sendMessage() {
    const text = this.userMessage().trim();
    if (!text) return;

    this.userMessage.set('');
    await this.chatService.sendMessage(text);
  }

  async sendSuggestion(suggestion: string) {
    await this.chatService.sendMessage(suggestion);
  }

  private handleScrollBehavior(msgs: ChatMessage[], typing: boolean) {
    if (!this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement;

    // If typing, scroll to bottom to show the typing bubble
    if (typing) {
      container.scrollTop = container.scrollHeight;
      return;
    }

    if (msgs.length === 0) return;

    const lastMsg = msgs[msgs.length - 1];
    const elements = container.querySelectorAll('.message-wrapper');
    if (elements.length === 0) return;

    if (lastMsg.role === 'user') {
      // Scroll user's own message to bottom instantly
      container.scrollTop = container.scrollHeight;
    } else if (lastMsg.role === 'assistant') {
      // Stick scroll to the beginning (top) of the new assistant message
      const lastElement = elements[elements.length - 1] as HTMLElement;
      if (lastElement) {
        // Calculate position relative to the container viewports
        const relativeTop = lastElement.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        
        container.scrollTo({
          top: relativeTop - 10, // Offset by 10px padding
          behavior: 'smooth'
        });
      }
    }
  }

  // Parses markdown symbols (*bold*, lists, links) into safe HTML
  formatMessage(content: string): SafeHtml {
    if (!content) return '';

    // Step 1: Escape basic HTML characters to avoid XSS injections
    let escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Step 2: Bold parsing (**text**)
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Step 3: Markdown link parsing [text](url)
    escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Step 4: List parsing (lines starting with - or *)
    const lines = escaped.split('\n');
    let formattedLines = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2).trim();
        if (!inList) {
          formattedLines.push('<ul class="chat-list"><li>' + itemText + '</li>');
          inList = true;
        } else {
          formattedLines.push('<li>' + itemText + '</li>');
        }
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(line);
      }
    }
    
    if (inList) {
      formattedLines.push('</ul>');
    }

    escaped = formattedLines.join('\n');

    // Step 5: Convert double newlines into paragraphs, single into breaks
    escaped = escaped.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    escaped = '<p>' + escaped + '</p>';
    
    // Clean up empty tags
    escaped = escaped.replace(/<p><\/p>/g, '')
                     .replace(/<p><ul/g, '<ul')
                     .replace(/<\/ul><\/p>/g, '</ul>');

    return this.sanitizer.bypassSecurityTrustHtml(escaped);
  }
}
