
(function () {
  'use strict';

  function initMarqueeCursor() {
    const marquee = document.querySelector('.project-marquee');
    if (!marquee) return;

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    const cursor = document.createElement('div');
    cursor.className = 'marquee-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'marquee-cursor-label';
    cursor.appendChild(label);
    marquee.appendChild(cursor);

    function updateLabel() {
      const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      label.textContent = lang === 'ar' ? 'عرض' : 'View';
    }
    updateLabel();
    window.addEventListener('langChanged', updateLabel);

    marquee.addEventListener('pointerenter', function () {
      marquee.classList.add('cursor-visible');
    });

    marquee.addEventListener('pointerleave', function () {
      marquee.classList.remove('cursor-visible', 'cursor-over-item');
    });

    marquee.addEventListener('pointermove', function (e) {
      const rect = marquee.getBoundingClientRect();
      cursor.style.left = (e.clientX - rect.left) + 'px';
      cursor.style.top = (e.clientY - rect.top) + 'px';

      const overItem = e.target.closest('.project-marquee-item');
      marquee.classList.toggle('cursor-over-item', !!overItem);
    });
  }

  document.addEventListener('DOMContentLoaded', initMarqueeCursor);
})();
