/**
 * main.js —— 全局交互逻辑
 * 功能：导航栏高亮、暗色模式切换、回到顶部按钮
 */

(function () {
  'use strict';

  /* ========== 暗色模式 ========== */
  const themeKey = 'blog-theme';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  /** 获取当前生效的主题 */
  function getTheme() {
    // 1. 优先读取用户手动选择（localStorage）
    const stored = localStorage.getItem(themeKey);
    if (stored === 'dark' || stored === 'light') return stored;

    // 2. 跟随系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /** 应用主题 */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  /** 设置并保存主题 */
  function setTheme(theme) {
    localStorage.setItem(themeKey, theme);
    applyTheme(theme);
  }

  /** 切换主题 */
  function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // 初始应用主题
  applyTheme(getTheme());

  // 切换按钮点击
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // 监听系统主题变化（仅在无用户手动选择时生效）
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(themeKey)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* ========== 导航栏高亮 ========== */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // 匹配当前页面的链接
    if (currentPath.endsWith(href) ||
        (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
      link.classList.add('active');
    }
  });

  /* ========== 回到顶部按钮 ========== */
  const scrollBtn = document.getElementById('scroll-top-btn');

  if (scrollBtn) {
    // 滚动监听：超过 300px 显示按钮
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
          } else {
            scrollBtn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // 点击回到顶部
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();