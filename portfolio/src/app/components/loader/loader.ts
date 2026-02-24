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
    '[SYSTEM] INITIALIZING_CORE...',
    '[ACCESS] VERIFYING_PORTFOLIO_CREDENTIALS...',
    '[RENDER] BOOTSTRAPPING_UI_COMPONENTS...',
    '[LOAD] FETCHING_PROJECT_METADATA...',
    '[STYLES] COMPUTING_MESH_GRADIENTS...',
    '[CORE] FINISHING_ASSET_READY...'
  ];

  ngOnInit() {
    this.startLoading();
  }

  private startLoading() {
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      // Create a more variable speed for a "thinking" feel
      const increment = Math.random() * (currentProgress > 70 ? 3 : 8);
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        this.finishLoading();
      }

      this.progress.set(Math.floor(currentProgress));
      this.updateStatusText(currentProgress);
    }, 120);
  }

  private updateStatusText(progress: number) {
    const index = Math.floor((progress / 100) * (this.statuses.length - 1));
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
