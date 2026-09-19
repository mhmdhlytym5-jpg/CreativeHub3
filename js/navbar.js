

(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const mobilePanel = document.getElementById('mobileNavPanel');
  const body = document.body;
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  
  function updateOnScroll() {
    const scrollTop = Math.max(window.scrollY, 0);

    if (header) {
      header.classList.toggle('is-scrolled', scrollTop > 12);
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollTop > 480);
    }
  }

  if (header || progressBar || backToTop) {
    let scrollScheduled = false;
    updateOnScroll();
    window.addEventListener('scroll', function () {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(function () {
        updateOnScroll();
        scrollScheduled = false;
      });
    }, { passive: true });
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  
  function openMobileNav() {
    if (!mobilePanel || !toggle) return;
    mobilePanel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobilePanel || !toggle) return;
    mobilePanel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    body.style.overflow = '';
  }

  if (toggle && mobilePanel) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    });

    mobilePanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    let navResizeScheduled = false;
    window.addEventListener('resize', function () {
      if (navResizeScheduled) return;
      navResizeScheduled = true;
      requestAnimationFrame(function () {
        if (window.innerWidth > 900) closeMobileNav();
        navResizeScheduled = false;
      });
    });
  }

  
  function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]'));
    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach(function (link) {
      const id = link.getAttribute('href').slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section && sections.indexOf(section) === -1) sections.push(section);
    });

    function setActive(id) {
      navLinks.forEach(function (link) {
        const isMatch = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  initScrollSpy();
})();