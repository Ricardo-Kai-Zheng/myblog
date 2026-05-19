/**
 * main.js —— Kai的博客 全局交互
 * 暖调人文 × 高密度动效
 * 功能：暗色模式、导航高亮、粒子背景、卡片 3D tilt、
 *       滚动渐入、阅读进度条、光标拖尾、回到顶部
 */

(function () {
  'use strict';

  /* ================================================================
     1. 暗色模式
     ================================================================ */
  const themeKey = 'blog-theme';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function getTheme() {
    const stored = localStorage.getItem(themeKey);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
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

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(themeKey)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  /* ================================================================
     2. 导航栏高亮
     ================================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (currentPath.endsWith(href) ||
        (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
      link.classList.add('active');
    }
  });

  /* ================================================================
     3. 回到顶部按钮
     ================================================================ */
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

  /* ================================================================
     4. 阅读进度条
     ================================================================ */
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    let progressTicking = false;
    window.addEventListener('scroll', function () {
      if (!progressTicking) {
        requestAnimationFrame(function () {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          progressBar.style.width = progress + '%';
          progressTicking = false;
        });
        progressTicking = true;
      }
    });
  }

  /* ================================================================
     5. 自定义光标拖尾
     ================================================================ */
  const cursor = document.getElementById('custom-cursor');
  if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
    let mouseX = -100, mouseY = -100;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // 鼠标离开窗口时隐藏光标
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });
  }

  /* ================================================================
     6. 粒子背景系统
     ================================================================ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let mouseX = -1000, mouseY = -1000;
    let isVisible = true;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    }

    // 获取当前主题的粒子颜色
    function getParticleColors() {
      const style = getComputedStyle(document.documentElement);
      return [
        style.getPropertyValue('--particle-color-1').trim(),
        style.getPropertyValue('--particle-color-2').trim(),
        style.getPropertyValue('--particle-color-3').trim(),
        style.getPropertyValue('--particle-color-4').trim()
      ];
    }

    function createParticles() {
      const colors = getParticleColors();
      particles = [];
      const count = 50;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.2 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.25 + 0.1
        });
      }
    }

    function drawParticles() {
      if (!isVisible) {
        animFrame = requestAnimationFrame(drawParticles);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 鼠标排斥力
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.6;
          p.speedX += (dx / dist) * force;
          p.speedY += (dy / dist) * force;
        }

        // 移动
        p.x += p.speedX;
        p.y += p.speedY;

        // 阻尼
        p.speedX *= 0.995;
        p.speedY *= 0.995;

        // 边界回弹
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      // 绘制连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 150) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(drawParticles);
    }

    // 可见性检测
    const visibilityObserver = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    visibilityObserver.observe(canvas);

    // 鼠标位置跟踪
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    });

    // 初始化
    resizeCanvas();
    createParticles();
    requestAnimationFrame(drawParticles);

    window.addEventListener('resize', function () {
      resizeCanvas();
      createParticles();
    });

    // 主题变化时重建粒子颜色
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        setTimeout(createParticles, 100);
      });
    }
  }

  /* ================================================================
     7. 卡片 3D Tilt 效果
     ================================================================ */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        card.classList.add('tilt-active');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.classList.remove('tilt-active');
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  /* ================================================================
     8. 滚动渐入动画
     ================================================================ */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // 错落延迟
        const el = entry.target;
        const index = Array.from(el.parentNode.children).indexOf(el);
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 70);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // 观察卡片和归档列表项
  function observeRevealElements() {
    document.querySelectorAll('.card, .archive-list li, .about-content p').forEach(function (el) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      revealObserver.observe(el);
    });
  }

  // 初始化观察（DOM 加载后）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeRevealElements);
  } else {
    observeRevealElements();
  }

  // 对于动态渲染的内容（首页卡片），在内容渲染后重新观察
  // 使用 MutationObserver 监听 card-grid 变化
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
})();