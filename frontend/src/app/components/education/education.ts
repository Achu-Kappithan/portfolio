import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: 'completed' | 'ongoing';
  highlights?: string[];
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  educationList: EducationItem[] = [
    {
      degree: 'Full Stack Development (MEAN Stack)',
      institution: 'Brototype',
      location: 'Kerala, India',
      period: '2024 - Present',
      status: 'ongoing',
      highlights: [
        'MEAN Stack (Angular, Express, Node.js, MongoDB)',
        'SQL and NgRx state management',
        'DSA, RESTful APIs, Clean Architecture',
        'Industrial-level project development'
      ]
    },
    {
      degree: 'Bachelor of Commerce in Cooperation',
      institution: "St. Sebastian's College",
      location: 'Kattappana, Kerala',
      period: '2019 - 2022',
      status: 'completed'
    },
    {
      degree: 'Higher Secondary Education',
      institution: "St. Sebastian's Higher Secondary School",
      location: 'Kattappana, Kerala',
      period: '2017 - 2019',
      status: 'completed',
      highlights: ['Commerce with Computer Applications']
    }
  ];
}
