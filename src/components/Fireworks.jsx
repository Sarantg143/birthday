import { useEffect, useRef } from 'react';

/**
 * Canvas-based fireworks effect for the success celebration.
 */
function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#ffd700', '#e74c3c', '#ff6b8a', '#d4af37', '#ff69b4', '#fff'];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1 + Math.random() * 4;
        this.life = 1;
        this.decay = 0.008 + Math.random() * 0.012;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 2 + Math.random() * 3;
        this.gravity = 0.03;
        this.vy = 0;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.vy += this.gravity;
        this.y += Math.sin(this.angle) * this.speed + this.vy;
        this.life -= this.decay;
        this.speed *= 0.98;
      }

      draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const launchFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y));
      }
    };

    // Initial burst + periodic launches
    for (let i = 0; i < 5; i++) {
      setTimeout(launchFirework, i * 400);
    }
    const interval = setInterval(launchFirework, 1500);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}

export default Fireworks;
