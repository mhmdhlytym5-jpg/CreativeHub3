
(function () {
  'use strict';

  function initProjectShowcase() {
    const showcase = document.getElementById('projectShowcase');
    if (!showcase) return;

    const track = document.getElementById('pwTrack');
    const slides = track ? Array.from(track.querySelectorAll('.project-showcase-slide')) : [];
    if (!slides.length) return;

    const dotsWrap = document.getElementById('pwDots');
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.pw-dot')) : [];
    const prevBtn = document.getElementById('pwPrev');
    const nextBtn = document.getElementById('pwNext');
    const tagEl = document.getElementById('pwTag');
    const titleEl = document.getElementById('pwTitle');
    const currentEl = document.getElementById('pwCurrent');
    const totalEl = document.getElementById('pwTotal');
    const stage = showcase.querySelector('.project-showcase-stage');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const AUTOPLAY_MS = 5000;

    let index = 0;
    let autoplayId = null;

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    if (totalEl) totalEl.textContent = pad(slides.length);

    function applyText(el, slide, attr) {
      if (!el) return;
      const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      const en = slide.getAttribute('data-' + attr + '-en') || '';
      const ar = slide.getAttribute('data-' + attr + '-ar') || '';
      el.setAttribute('data-en', en);
      el.setAttribute('data-ar', ar);
      el.textContent = lang === 'ar' ? ar : en;
    }

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      // Crossfade: only the active slide is visible; the others are stacked underneath, faded out.
      slides.forEach(function (slide, i) {
        const isActive = i === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        slide.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      dots.forEach(function (dot, i) {
        const isActive = i === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (currentEl) currentEl.textContent = pad(index + 1);

      applyText(tagEl, slides[index], 'tag');
      applyText(titleEl, slides[index], 'title');
    }

    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    function startAutoplay() {
      if (reduceMotion || slides.length < 2) return;
      stopAutoplay();
      autoplayId = setInterval(nextSlide, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        startAutoplay();
      });
    });

    showcase.addEventListener('mouseenter', stopAutoplay);
    showcase.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('langChanged', function () {
      applyText(tagEl, slides[index], 'tag');
      applyText(titleEl, slides[index], 'title');
    });

    // First state without animation (no fade-in flash on page load), then enable transitions.
    if (track) track.classList.add('is-enhanced', 'is-init');
    goTo(0);
    if (track) {
      void track.offsetWidth;
      track.classList.remove('is-init');
    }
    startAutoplay();

    
    if (stage && supportsHover && !reduceMotion) {
      const cursorBadge = document.createElement('div');
      cursorBadge.className = 'pw-cursor';
      cursorBadge.setAttribute('aria-hidden', 'true');
      stage.appendChild(cursorBadge);

      function updateCursorLabel() {
        const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
        cursorBadge.textContent = lang === 'ar' ? 'عرض' : 'View';
      }
      updateCursorLabel();
      window.addEventListener('langChanged', updateCursorLabel);

      stage.addEventListener('pointerenter', function () {
        stage.classList.add('pw-cursor-active');
      });

      stage.addEventListener('pointerleave', function () {
        stage.classList.remove('pw-cursor-active');
      });

      stage.addEventListener('pointermove', function (e) {
        const rect = stage.getBoundingClientRect();
        cursorBadge.style.left = (e.clientX - rect.left) + 'px';
        cursorBadge.style.top = (e.clientY - rect.top) + 'px';

        const overControl = e.target.closest('.pw-arrow, .pw-dot, .project-showcase-watch, .project-showcase-dots, .project-showcase-nav');
        stage.classList.toggle('pw-cursor-hide', !!overControl);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initProjectShowcase);
})();
