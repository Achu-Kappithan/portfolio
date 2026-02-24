import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'work' | 'training';
  description: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  experiences: ExperienceItem[] = [
    {
      title: 'Full Stack Development Training',
      company: 'Brototype',
      location: 'Kerala, India',
      period: '2024 - Present',
      type: 'training',
      description: [
        'Developing proficiency in MEAN stack (Angular, Express, Node.js, MongoDB)',
        'Learning supplementary technologies including SQL and NgRx',
        'Applying industry best practices through DSA, RESTful APIs, and clean architecture',
        'Completing multiple mini-projects and industrial-level projects'
      ]
    },
    {
      title: 'Accountant',
      company: 'Sree Gokulam Motors and Service',
      location: 'Kattappana, Kerala',
      period: '2023 - 2024',
      type: 'work',
      description: [
        'Managed comprehensive branch finances and cash flow, ensuring operational accuracy',
        'Maintained daily detailed records of branch expenses and financial activities',
        'Prepared various financial reports and final statements using Tally ERP9 and Tally Prime',
        'Handled e-way bill generation, ensuring timely GST filing and regulatory compliance'
      ]
    }
  ];
}
