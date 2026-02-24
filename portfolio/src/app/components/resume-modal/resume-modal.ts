import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-modal.html',
  styleUrl: './resume-modal.scss'
})
export class ResumeModal {
  private sanitizer = inject(DomSanitizer);
  
  isOpen = input<boolean>(false);
  onClose = output<void>();

  resumeUrl = "https://drive.google.com/uc?export=download&id=1Z1B39lRq-35A9bkWosiukhxVEUIXq5oD";
  previewUrl = "https://drive.google.com/file/d/1Z1B39lRq-35A9bkWosiukhxVEUIXq5oD/preview";

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
  }

  close() {
    this.onClose.emit();
  }
}
