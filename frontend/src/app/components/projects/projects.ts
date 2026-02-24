import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  github: string;
  liveLink?: string;
  status: 'completed' | 'ongoing';
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  projects: Project[] = [
    {
      title: 'FobVerse Recruitment Platform',
      description: 'A scalable recruitment platform for managing job applications, interviews, and candidate assessments.',
      longDescription: 'Enterprise-level recruitment solution with role-based access for global admins, companies, HR users, and candidates.',
      technologies: ['Angular', 'NestJS', 'MongoDB', 'TypeScript', 'RxJS'],
      features: [
        'Role-based access control system',
        'ATS-friendly resume filtering',
        'Four-level interview process',
        'Candidate progress tracking',
        'SOLID principles architecture'
      ],
      github: 'https://github.com/Achu-Kappithan/fobverse-api',
      liveLink: 'https://app.achuu.online',
      status: 'ongoing'
    },
    {
      title: 'E-Commerce Website',
      description: 'A complete e-commerce platform with full user and admin functionality.',
      longDescription: 'Full-featured online shopping platform with payment integration and comprehensive admin dashboard.',
      technologies: ['EJS', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'User authentication & authorization',
        'Product listing & sorting',
        'Cart & wishlist functionality',
        'Razorpay payment gateway',
        'Admin panel with sales reports',
        'Wallet system & order tracking'
      ],
      github: 'https://github.com/Achu-Kappithan/crc-world',
      status: 'completed'
    },
    {
      title: 'User Management System',
      description: 'A User Management System with CRUD operations and profile features.',
      longDescription: 'Modern UMS application built with Angular and NgRx for state management.',
      technologies: ['Angular', 'NgRx', 'Node.js', 'TypeScript', 'Express'],
      features: [
        'Complete CRUD operations',
        'Profile image upload',
        'NgRx state management',
        'Responsive design',
        'RESTful API integration'
      ],
      github: 'https://github.com/Achu-Kappithan/Angular-Ums',
      status: 'completed'
    },
    {
      title: 'Netflix Clone',
      description: 'A Netflix-inspired streaming platform UI clone with modern design.',
      longDescription: 'Pixel-perfect recreation of Netflix UI demonstrating Angular skills.',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'RxJS'],
      features: [
        'Responsive design',
        'Modern UI/UX',
        'Component architecture',
        'Smooth animations'
      ],
      github: 'https://github.com/Achu-Kappithan/NetflixClone',
      status: 'completed'
    }
  ];
}
