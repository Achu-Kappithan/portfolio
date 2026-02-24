import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-viewer.html',
  styleUrl: './resume-viewer.scss'
})
export class ResumeViewer {
  private sanitizer = inject(DomSanitizer);
  
  isVisible = input<boolean>(false);
  onClose = output<void>();

  resumeDownloadUrl = "/Achu_Baiju_Resume.pdf";
  resumePreviewUrl = "/Achu_Baiju_Resume.pdf";

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.resumePreviewUrl);
  }

  close() {
    this.onClose.emit();
  }
}
