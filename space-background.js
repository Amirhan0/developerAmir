// ==================== Космический фон со звездами ====================
(function() {
  'use strict';
  
  // Создаем canvas для звезд
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  canvas.id = 'space-canvas';
  
  // Ждем загрузки DOM
  if (document.body) {
    document.body.prepend(canvas);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.prepend(canvas);
    });
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Массивы для частиц
  const stars = [];
  const particles = [];
  const shootingStars = [];
  
  const starCount = 200;
  const particleCount = 30;

  // ==================== Обычные звезды ====================
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2;
      this.speed = Math.random() * 0.05;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 1 || this.opacity < 0.3) {
        this.twinkleSpeed *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
      
      // Добавляем легкое свечение
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(this.x - this.size * 2, this.y - this.size * 2, this.size * 4, this.size * 4);
    }
  }

  // ==================== Анимированные частицы (фиолетовые) ====================
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 0, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // ==================== Падающие звезды ====================
  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.5;
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 10 + 5;
      this.angle = Math.PI / 4;
      this.opacity = 1;
      this.active = Math.random() < 0.1; // 10% шанс быть активной
    }

    update() {
      if (!this.active) {
        if (Math.random() < 0.001) { // Шанс появления
          this.active = true;
          this.reset();
        }
        return;
      }

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.01;

      if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;

      ctx.save();
      ctx.beginPath();
      
      const gradient = ctx.createLinearGradient(
        this.x, this.y,
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(139, 0, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(139, 0, 255, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  // ==================== Инициализация ====================
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }

  // ==================== Анимация ====================
  function animate() {
    // Очищаем canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем звезды
    stars.forEach(star => {
      star.update();
      star.draw();
    });

    // Рисуем частицы
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Рисуем линии между близкими частицами
    const connectionDistance = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 0, 255, ${(1 - distance / connectionDistance) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Рисуем падающие звезды
    shootingStars.forEach(star => {
      star.update();
      star.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // ==================== Обработка изменения размера окна ====================
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Пересоздаем звезды при изменении размера
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  });

})();

