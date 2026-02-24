import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();

  navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  socialLinks = [
    { icon: 'github', url: 'https://github.com/achu-kappithan', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/achu-baiju-570314313/', label: 'LinkedIn' },
    { icon: 'email', url: 'mailto:achu.k.baiju@gmail.com', label: 'Email' },
  ];

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
