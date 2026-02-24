import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements OnInit {
  isVisible = signal(true);
  progress = signal(0);
  statusText = signal('Initializing portfolio...');

  private statuses = [
    'Building foundations...',
    'Fetching projects...',
    'Polishing pixels...',
    'Ready to explore.'
  ];

  ngOnInit() {
    this.startLoading();
  }

  private startLoading() {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        this.finishLoading();
      }

      this.progress.set(currentProgress);
      this.updateStatusText(currentProgress);
    }, 150);
  }

  private updateStatusText(progress: number) {
    const index = Math.floor((progress / 100) * this.statuses.length);
    if (this.statuses[index]) {
      this.statusText.set(this.statuses[index]);
    }
  }

  private finishLoading() {
    setTimeout(() => {
      this.isVisible.set(false);
    }, 500);
  }
}
