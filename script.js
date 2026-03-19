/* ═══════════════════════════════════════════
   PORTFOLIO — Interactive Engine
   ═══════════════════════════════════════════ */

// ─── Mobile Burger Menu ───
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

if (navBurger) {
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ─── Custom Cursor ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 4 + 'px';
  cursor.style.top = mouseY - 4 + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX - 20 + 'px';
  follower.style.top = followerY - 20 + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, .btn, .stat-card, .contact-card, .orbit-item, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── Particle System ───
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.5 ? 245 : 165; // purple or teal
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      this.x -= dx * force * 0.02;
      this.y -= dy * force * 0.02;
    }

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

// Create particles
const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Typed Text Effect ───
const phrases = [
  'e-commerce platforms.',
  'marketplace MVPs.',
  'Telegram bots.',
  'full-stack web apps.',
  'things that impress.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 60;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}
typeEffect();

// ─── Scroll Progress ───
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrolled / total * 100) + '%';
});

// ─── Active Nav Link on Scroll ───
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const id = entry.target.id;
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => observerNav.observe(s));

// ─── Reveal on Scroll ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Animate stat counters
      entry.target.querySelectorAll('[data-count]').forEach(counter => {
        animateCounter(counter);
      });

      // Animate skill bars
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.setProperty('--target-width', bar.dataset.width + '%');
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ─── Counter Animation ───
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ─── 3D Tilt Effect on Project Cards ───
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -5;
    const rotateY = (x - centerX) / centerX * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Move glow
    const glow = card.querySelector('.project-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108,99,255,0.3), transparent 60%)`;
      glow.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    const glow = card.querySelector('.project-card-glow');
    if (glow) glow.style.opacity = '0';
  });
});

// ─── Smooth Scroll ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Magnetic Effect on Nav Links ───
document.querySelectorAll('.nav-link, .btn').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ─── Initial reveal for hero elements ───
setTimeout(() => {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 150);
  });
}, 300);


// ─── Orbit center: меняем иконку и текст при наведении ───
(function() {
  const centerIcon  = document.querySelector('.orbit-icon');
  const centerLabel = document.querySelector('.orbit-label');
  if (!centerIcon || !centerLabel) return;

  const defaultIcon  = centerIcon.textContent;
  const defaultLabel = centerLabel.textContent;

  // Используем mousemove на всём orbit-контейнере для надёжного определения
  const orbit = document.querySelector('.skills-orbit');
  if (!orbit) return;

  let active = null;

  orbit.addEventListener('mousemove', (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const item = el && (el.closest('.orbit-item'));
    if (item === active) return;
    active = item;

    if (item) {
      const icon  = item.querySelector('.skill-icon');
      centerIcon.textContent  = icon ? icon.textContent : defaultIcon;
      const name = item.dataset.skill || defaultLabel;
      centerLabel.textContent = name;
      centerLabel.style.color = 'var(--accent)';
      centerLabel.style.fontSize = name.length > 10 ? '9px' : '';
      centerIcon.style.fontSize = '28px';
    } else {
      centerIcon.textContent  = defaultIcon;
      centerLabel.textContent = defaultLabel;
      centerLabel.style.color = '';
      centerLabel.style.fontSize = '';
      centerIcon.style.fontSize = '';
    }
  });

  orbit.addEventListener('mouseleave', () => {
    active = null;
    centerIcon.textContent  = defaultIcon;
    centerLabel.textContent = defaultLabel;
    centerLabel.style.color = '';
    centerLabel.style.fontSize = '';
    centerIcon.style.fontSize = '';
  });
})();

console.log('%c Portfolio loaded! ', 'background: linear-gradient(135deg, #6c63ff, #00d4aa); color: white; font-size: 14px; padding: 8px 16px; border-radius: 8px;');
