

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          if (el.classList.contains('reveal-stagger')) {
            Array.from(el.children).forEach(function (child, i) {
              child.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
              child.classList.add('is-visible');
            });
          }
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  
  function initHeroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (!document.getElementById('pageLoader')) {
      hero.classList.add('is-ready');
      return;
    }

    window.addEventListener('pageLoaderDone', function onLoaderDone() {
      window.removeEventListener('pageLoaderDone', onLoaderDone);
      hero.classList.add('is-ready');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initHeroEntrance();
  });
})();