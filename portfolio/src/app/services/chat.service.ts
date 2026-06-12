import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Chat history state
  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Achu's AI Career Copilot. Ask me anything about Achu's MEAN Stack skills, projects (like FobVerse), or how his accounting background benefits your team!",
      timestamp: new Date()
    }
  ]);
  
  // Loading/typing indicator state
  isTyping = signal<boolean>(false);

  private systemPrompt = `You are Achu AI, the personalized AI Career Assistant for Achu Baiju.
Your sole mission is to represent Achu to recruiters and hiring managers in the best possible light, convincing them that Achu is an outstanding candidate for full-stack (MEAN stack) development roles and helping him get hired. 

### ACHU BAIJU'S PROFILE & RECRUITER VALUE PROPS:
- **Title**: MEAN Stack Developer / Full Stack Developer
- **Core Value Proposition**: Achu transitioned to software engineering from a Bachelor of Commerce (B.Com) background. This gives him a unique "Business-Savvy Developer" edge. He understands accounting, business finance, and daily workflows, which allows him to design products that make commercial sense, write robust business logic, and collaborate effectively with non-technical business stakeholders.
- **Skills**:
  * Frontend: Angular (expert), TypeScript, JavaScript, HTML5, CSS3/SCSS, Tailwind CSS
  * Backend: Node.js, Express.js, NestJS, RESTful APIs, WebRTC, Socket.io
  * State Management: RxJS, NgRx, BehaviorSubject
  * Database & Tools: MongoDB, PostgreSQL, Git & GitHub, Postman
- **Key Projects**:
  1. *FobVerse Recruitment Platform*: A highly scalable enterprise-level SaaS recruitment platform for managing jobs, candidate testing, and interviews. Features include peer-to-peer video calls using WebRTC, real-time messaging with Socket.io, role-based access control (Global Admin, Company, HR, Candidate), and ATS-friendly resume filters. Tech Stack: Angular, NestJS, MongoDB, Socket.io, WebRTC, TypeScript.
  2. *E-Commerce Platform*: A full-featured shopping platform with an admin dashboard, Razorpay payments, cart, wishlist, and order/wallet tracking. Tech Stack: Node.js, Express, MongoDB, EJS, JS.
  3. *User Management System (UMS)*: Full CRUD app with profile upload and NgRx state management. Tech Stack: Angular, NgRx, Node.js, Express.
  4. *Netflix UI Clone*: Pixel-perfect Netflix clone. Tech Stack: Angular, TypeScript, SCSS, RxJS.
- **Work Experience**:
  * *Full Stack Development Training* at Brototype, Kerala (2024 - Present): Developing expertise in MEAN stack, DSA, SQL, clean code principles (SOLID), and industrial project execution.
  * *Branch Accountant* at Sree Gokulam Motors and Service, Kattappana, Kerala (2023 - 2024): Managed branch finance, ledger, Tally Prime, e-way bills, and GST filings.
- **Education**:
  * Full Stack Development (MEAN Stack) - Brototype (2024 - Present)
  * Bachelor of Commerce (B.Com) in Cooperation - St. Sebastian's College, Kattappana (2019 - 2022)
  * Higher Secondary (Commerce & Computer Applications) - St. Sebastian's School, Kattappana (2017 - 2019)
- **Contact Details**:
  * Email: achu.k.baiju@gmail.com
  * Phone: +91 7034234699
  * Location: Kerala, India
  * GitHub: https://github.com/achu-kappithan
  * LinkedIn: https://www.linkedin.com/in/achu-baiju/

### PERSONALITY & CONVERSION GUIDELINES:
- **Tone**: Professional, confident, friendly, and business-focused. Speak with enthusiasm.
- **Style**: Talk in the third-person or as an AI Representative of Achu (e.g., "Achu built...", "Achu has...").
- **Quality**: The answers should be the "best answers ever" that impress HR managers. Structure answers with clean headings, bold highlights, and bullet points. Never give lazy or short answers, but do not write huge walls of text either. Be clear, concise, and structured.
- **Highlight Project Depth**: Emphasize FobVerse first. Point out that WebRTC and Socket.io are advanced technologies, showing Achu's capacity for real-time engineering.
- **Address Career Transition**: Frame his commerce background as a massive positive: "His commerce background gives him a firm grip on commercial workflows, metrics, and business logic. He does not just write code; he builds solutions that drive business value."
- **Call to Action**: Conclude with contact info or a prompt to look at his resume, like: "Feel free to check out his FobVerse live app (https://app.achuu.online) or get in touch at achu.k.baiju@gmail.com."

Response format: Return clear text formatting. Support Markdown.`;

  async sendMessage(content: string): Promise<void> {
    if (!content.trim() || this.isTyping()) return;

    // Check for developer commands to set/clear API key locally
    const trimmedInput = content.trim();
    if (trimmedInput.startsWith('/key ')) {
      const key = trimmedInput.substring(5).trim();
      if (key) {
        localStorage.setItem('groq_api_key', key);
        
        // Mask key for safety on screen
        const maskedKey = '/key ' + key.substring(0, 8) + '...' + key.substring(key.length - 4);
        const userMsg: ChatMessage = {
          role: 'user',
          content: maskedKey,
          timestamp: new Date()
        };
        this.messages.update(prev => [...prev, userMsg]);
        this.appendAssistantReply("🔑 **Local API Key Configured!** I have stored your key in your browser's local storage. Future local requests will use this key, and it will never be uploaded to GitHub!");
        return;
      }
    }

    if (trimmedInput === '/clear-key') {
      localStorage.removeItem('groq_api_key');
      const userMsg: ChatMessage = {
        role: 'user',
        content: '/clear-key',
        timestamp: new Date()
      };
      this.messages.update(prev => [...prev, userMsg]);
      this.appendAssistantReply("🗑️ **Local API Key Cleared!** I have removed your key from your browser's local storage.");
      return;
    }

    // Append user message
    const userMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    this.messages.update(prev => [...prev, userMsg]);
    this.isTyping.set(true);

    // Prepare message history for the API (filter out timestamps)
    const apiMessages = this.messages()
      .filter(msg => msg.role !== 'system' && !msg.content.startsWith('/key') && msg.content !== '/clear-key')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    try {
      // 1. Try calling the Vercel serverless function proxy first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          this.appendAssistantReply(reply);
          return;
        }
      }
      
      // If serverless response is not ok (e.g. 404 because running locally under ng serve),
      // we throw an error to trigger the direct fallback
      throw new Error(`Serverless endpoint returned status ${response.status}`);
    } catch (error) {
      console.warn('Vercel serverless function unavailable, falling back to direct client-side call:', error);
      await this.sendDirectRequest(apiMessages);
    } finally {
      this.isTyping.set(false);
    }
  }

  // Fallback: Call Groq API directly from client using key in localStorage or environment
  private async sendDirectRequest(apiMessages: { role: string; content: string }[]): Promise<void> {
    const apiKey = localStorage.getItem('groq_api_key') || environment.groqApiKey;
    
    if (!apiKey) {
      this.appendAssistantReply(
        "💡 **Local Setup Required**: The backend serverless function is not active on this localhost preview, and no local API key is configured. \n\nTo test this chatbot locally, please type `/key gsk_your_key` in this input box to set your Groq API key. Your key will only be stored in your local browser cache."
      );
      return;
    }

    try {
      const response = await fetch(`${environment.groqApiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: this.systemPrompt },
            ...apiMessages
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`Direct API response not OK: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        this.appendAssistantReply(reply);
      } else {
        throw new Error('No reply content found in direct response.');
      }
    } catch (fallbackError) {
      console.error('Direct Groq API call failed:', fallbackError);
      this.appendAssistantReply(
        "I'm sorry, but I'm having trouble connecting to my brain right now. Please feel free to contact Achu directly at achu.k.baiju@gmail.com or call him at +91 7034234699."
      );
    }
  }

  private appendAssistantReply(content: string): void {
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    this.messages.update(prev => [...prev, assistantMsg]);
  }
}
