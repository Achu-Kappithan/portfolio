import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  highlights = [
    { icon: 'code', title: 'Full Stack', description: 'End-to-end web development with MEAN stack' },
    { icon: 'angular', title: 'Angular Expert', description: 'Building scalable SPAs with modern Angular' },
    { icon: 'database', title: 'Database Design', description: 'MongoDB & PostgreSQL optimization' },
    { icon: 'api', title: 'RESTful APIs', description: 'Designing robust backend services' },
  ];
}
