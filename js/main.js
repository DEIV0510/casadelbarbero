/* ═══════════════════════════════════════════
   LA CASA DEL BARBERO  ·  main.js
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ── 2. NAVBAR ── */
  const nav = document.getElementById('navbar');
  function updateNav() {
    nav.classList.toggle('stuck', window.scrollY > 64);
  }

  /* ── 3. ACTIVE NAV LINKS ── */
  const sections  = [...document.querySelectorAll('section[id]')];
  const navLinks  = [...document.querySelectorAll('.nav-links a')];
  function updateActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }

  /* ── Throttled scroll handler ── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── 4. MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mMenu     = document.getElementById('mMenu');
  const mCloseBtn = document.getElementById('mClose');

  function openMenu() {
    mMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  window.closeMenu = function () {
    mMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', openMenu);
  mCloseBtn.addEventListener('click', window.closeMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mMenu.classList.contains('open')) window.closeMenu();
  });

  /* ── 5. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const el = document.querySelector(this.getAttribute('href'));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 6. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-s');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── 7. COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  let countersRan = false;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function runCounters() {
    if (countersRan) return;
    countersRan = true;
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix ?? '+';
      const dur    = 1800;
      const start  = performance.now();
      function step(now) {
        const t   = Math.min((now - start) / dur, 1);
        const val = Math.round(easeOutQuart(t) * target);
        el.textContent = val + (t >= 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const cntObs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) runCounters();
  }, { threshold: 0.5 });
  counters.forEach(c => cntObs.observe(c));

  /* ── 8. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item   = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      /* Open clicked */
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 9. SERVICE CARD MOUSE GLOW ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--gy', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  });

  /* ── 10. POLE ANIMATION ON SCROLL (start only when visible) ── */
  const poles = document.querySelectorAll('.pole-stripes');
  const poleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  poles.forEach(p => {
    p.style.animationPlayState = 'paused';
    poleObs.observe(p);
  });

  /* ── 11. NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP ── */
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 300) {
      nav.style.transform = y > lastY ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });

  /* ── Initial call ── */
  updateNav();
  updateActiveLink();
  updateProgress();

})();
