// ==================== DOM Content Loaded ====================
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initNavHighlight();
  initSmoothScroll();
});

// ==================== Intersection Observer для анимаций ====================
function initAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  // Наблюдаем за всеми элементами с классом fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ==================== Подсветка активной навигации ====================
function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// ==================== Плавная прокрутка ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==================== Эффект курсора ====================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid #8B00FF;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.2s ease;
  display: none;
`;
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.display = 'block';
});

function updateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  cursorX += dx * 0.1;
  cursorY += dy * 0.1;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(updateCursor);
}

updateCursor();

// Увеличиваем курсор при наведении на ссылки
document.querySelectorAll('a, button').forEach(element => {
  element.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
    cursor.style.borderColor = '#a733ff';
  });
  
  element.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.borderColor = '#8B00FF';
  });
});

// ==================== Клавиатурная навигация ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

