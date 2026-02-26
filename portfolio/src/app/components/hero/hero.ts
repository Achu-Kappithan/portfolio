import { Component, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnInit {
  openResume = output<void>();
  displayText = signal('');
  private roles = ['MEAN Stack Developer', 'Angular Developer', 'Full Stack Developer'];
  private currentRoleIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;

  socialLinks = [
    { icon: 'github', url: 'https://github.com/achu-kappithan', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/achu-baiju/', label: 'LinkedIn' },
    { icon: 'email', url: '#contact', label: 'Email' },
  ];

  ngOnInit() {
    this.typeEffect();
  }

  private typeEffect() {
    const currentRole = this.roles[this.currentRoleIndex];

    if (this.isDeleting) {
      this.displayText.set(currentRole.substring(0, this.currentCharIndex - 1));
      this.currentCharIndex--;
    } else {
      this.displayText.set(currentRole.substring(0, this.currentCharIndex + 1));
      this.currentCharIndex++;
    }

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.typeEffect(), typeSpeed);
  }
}
