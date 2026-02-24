import { Component, ElementRef, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

class Particle {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speedX: number = 0;
  speedY: number = 0;
  opacity: number = 0;
  color: string = '';

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  reset(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = `rgba(255, 255, 255, ${this.opacity})`;
  }

  update(width: number, height: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class CodeSymbol extends Particle {
  char: string = '';
  private symbols = ['{', '}', '<', '>', '/', '[', ']', ';', '(', ')', '=>', '++'];

  constructor(width: number, height: number) {
    super(width, height);
    this.char = this.symbols[Math.floor(Math.random() * this.symbols.length)];
    this.size = Math.random() * 12 + 10;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.size}px 'Fira Code', monospace`;
    ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
    ctx.fillText(this.char, this.x, this.y);
  }
}

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background.html',
  styleUrl: './background.scss'
})
export class Background implements OnInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private symbols: CodeSymbol[] = [];
  private animationId: number = 0;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.initParticles();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.initParticles();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles() {
    this.particles = [];
    this.symbols = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create stars
    const particleCount = Math.floor((width * height) / 10000);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(width, height));
    }

    // Create code symbols
    const symbolCount = Math.floor((width * height) / 50000);
    for (let i = 0; i < symbolCount; i++) {
      this.symbols.push(new CodeSymbol(width, height));
    }
  }

  private animate() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.ctx.clearRect(0, 0, width, height);

    this.particles.forEach(p => {
      p.update(width, height);
      p.draw(this.ctx);
    });

    this.symbols.forEach(s => {
      s.update(width, height);
      s.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
