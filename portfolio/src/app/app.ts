import { Component, OnInit, HostListener, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Projects } from './components/projects/projects';
import { Experience } from './components/experience/experience';
import { Education } from './components/education/education';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Loader } from './components/loader/loader';
import { Background } from './components/background/background';
import { ResumeViewer } from './components/resume-viewer/resume-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Hero,
    About,
    Skills,
    Projects,
    Experience,
    Education,
    Contact,
    Footer,
    Loader,
    Background,
    ResumeViewer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isResumeVisible = signal(false);

  ngOnInit() {
    this.initScrollAnimations();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.handleScrollAnimations();
  }

  private initScrollAnimations() {
    setTimeout(() => this.handleScrollAnimations(), 100);
  }

  private handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  }
}
