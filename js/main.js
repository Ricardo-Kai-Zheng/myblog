
/**
 * main.js \u2014 Kai Blog Pixel Retro Edition
 * Theme toggle, nav highlight, scroll-top, progress bar,
 * pixel star particles, scroll reveal
 */
(function () {
  'use strict';

  // 1. Theme toggle
  const themeKey = 'blog-theme';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function getTheme() {
    const stored = localStorage.getItem(themeKey);
    if (stored === 'dark' || stored === 'light') return stored;
    return 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '[D]' : '[L]';
    }
  }

  function setTheme(theme) {
    localStorage.setItem(themeKey, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  applyTheme(getTheme());
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  // 2. Nav highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (currentPath.endsWith(href) ||
        (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
      link.classList.add('active');
    }
  });

  // 3. Scroll to top
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          scrollBtn.classList.toggle('visible', window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Reading progress
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    let pt = false;
    window.addEventListener('scroll', function () {
      if (!pt) {
        requestAnimationFrame(function () {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          progressBar.style.width = progress + '%';
          pt = false;
        });
        pt = true;
      }
    });
  }

  // 5. Pixel star particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animFrame;
    const STAR_COUNT = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    }

    function createStars() {
      stars = [];
      const colors = ['#33FF33', '#FFD700', '#FF6B9D', '#00E5FF', '#8FDF8F'];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() < 0.3 ? 3 : 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 0.2 + Math.random() * 0.5,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinkle += 0.02;
        s.y -= s.speed;
        if (s.y < -10) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }
        const alpha = 0.4 + Math.sin(s.twinkle) * 0.3;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        // Draw pixel square
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    createStars();
    requestAnimationFrame(drawStars);

    window.addEventListener('resize', function () {
      resizeCanvas();
      createStars();
    });
  }

  // 6. Scroll reveal
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const index = Array.from(el.parentNode.children).indexOf(el);
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 60);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  function observeRevealElements() {
    document.querySelectorAll('.card, .archive-list li, .about-content .info-row').forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeRevealElements);
  } else {
    observeRevealElements();
  }

  // Re-observe after dynamic card render
  const cardGrid = document.getElementById('card-grid');
  if (cardGrid) {
    const gridObserver = new MutationObserver(function () {
      if (cardGrid.children.length > 0 && !cardGrid.children[0].classList.contains('skeleton-card')) {
        document.querySelectorAll('#card-grid .card').forEach(function (card) {
          if (!card.classList.contains('reveal')) {
            card.classList.add('reveal');
            revealObserver.observe(card);
          }
        });
      }
    });
    gridObserver.observe(cardGrid, { childList: true });
  }

  // Also observe archive list
  const archiveList = document.getElementById('archive-list');
  if (archiveList) {
    const alObs = new MutationObserver(function () {
      document.querySelectorAll('#archive-list li:not(.skeleton-archive-item)').forEach(function (li) {
        if (!li.classList.contains('reveal')) {
          li.classList.add('reveal');
          revealObserver.observe(li);
        }
      });
    });
    alObs.observe(archiveList, { childList: true });
  }
})();
