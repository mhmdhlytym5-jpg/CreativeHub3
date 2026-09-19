
(function () {
  'use strict';

  var LOGO_SRC = 'assets/images/logo.png';
  var SIZE = 44; // px — a bit larger than the mouse pointer
  var HANG_MS = 420; // how long it stays suspended before falling
  var FALL_MS = 620; // fall duration
  var MAX_ACTIVE = 6; // avoid pile-ups on rapid clicking

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activeCount = 0;

  
  var IGNORE_SELECTOR = [
    'a', 'button', 'input', 'textarea', 'select', 'label',
    '[role="button"]', '.btn', '.nav-link', '.mobile-nav-link',
    '.faq-question', '.lang-switch', '.nav-toggle', '.pw-arrow',
    '.pw-dot', '.back-to-top', '.brand', 'header', 'footer', 'form',
    '.project-marquee-item', '.pf-card', '[data-no-logo-drop]'
  ].join(', ');

  function isInteractive(target) {
    return !!(target && target.closest && target.closest(IGNORE_SELECTOR));
  }

  function hasSelection() {
    var sel = window.getSelection ? window.getSelection() : null;
    return !!(sel && String(sel).length);
  }

  function spawnDrop(x, y) {
    if (activeCount >= MAX_ACTIVE) return;
    activeCount++;

    var el = document.createElement('div');
    el.className = 'logo-drop';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = SIZE + 'px';
    el.style.height = SIZE + 'px';

    
    var startRot = -12 + Math.random() * 16; // -12deg .. +4deg
    var inRot = -6 + Math.random() * 12; // -6deg .. +6deg (settled angle)
    var fallSign = Math.random() < 0.5 ? -1 : 1;
    var fallRot = fallSign * (14 + Math.random() * 20); // ±14deg .. ±34deg
    el.style.setProperty('--rot-start', startRot.toFixed(1) + 'deg');
    el.style.setProperty('--rot-in', inRot.toFixed(1) + 'deg');
    el.style.setProperty('--rot-fall', fallRot.toFixed(1) + 'deg');

    var img = new Image();
    img.className = 'logo-drop-img';
    img.alt = '';

    img.onerror = function () {
      el.classList.add('logo-drop--fallback');
    };

    img.src = LOGO_SRC;
    el.appendChild(img);
    document.body.appendChild(el);

    function cleanup() {
      el.removeEventListener('transitionend', onFallEnd);
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCount = Math.max(0, activeCount - 1);
    }

    function onFallEnd(e) {
      if (e.target !== el) return;
      cleanup();
    }

    if (reduceMotion) {
      el.classList.add('is-in');
      setTimeout(function () {
        el.classList.add('is-falling');
        setTimeout(cleanup, 260);
      }, 260);
      return;
    }

    
    requestAnimationFrame(function () {
      el.classList.add('is-in');
    });

    setTimeout(function () {
      el.classList.add('is-falling');
      el.addEventListener('transitionend', onFallEnd);
      
      setTimeout(cleanup, FALL_MS + 200);
    }, HANG_MS);
  }

  document.addEventListener('click', function (e) {
    if (e.button !== 0) return;
    if (isInteractive(e.target)) return;
    if (hasSelection()) return;

    spawnDrop(e.clientX, e.clientY);
  });
})();
