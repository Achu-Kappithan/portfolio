import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal<string | null>(null);

  contactInfo: ContactInfo[] = [
    {
      icon: 'email',
      label: 'Email',
      value: 'achu.k.baiju@gmail.com',
      link: 'mailto:achu.k.baiju@gmail.com'
    },
    {
      icon: 'phone',
      label: 'Phone',
      value: '+91 7034234699',
      link: 'tel:+917034234699'
    },
    {
      icon: 'location',
      label: 'Location',
      value: 'Kerala, India'
    }
  ];

  socialLinks = [
    { icon: 'github', url: 'https://github.com/achu-kappithan', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/achu-baiju-570314313/', label: 'LinkedIn' },
  ];

  async onSubmit() {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.isSubmitted.set(false);
    this.errorMessage.set(null);

    try {
      const emailjs = await import('@emailjs/browser');
      const { environment } = await import('../../../environments/environment');
      
      const templateParams = {
        from_name: this.formData.name,
        from_email: this.formData.email,
        subject: this.formData.subject,
        message: this.formData.message,
        to_name: 'Achu Baiju',
      };

      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        templateParams,
        environment.emailjs.publicKey
      );

      this.isSubmitted.set(true);

      // Reset form
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.isSubmitted.set(false);
      }, 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      this.errorMessage.set('Failed to send message. Please check your connection and try again.');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        this.errorMessage.set(null);
      }, 5000);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
