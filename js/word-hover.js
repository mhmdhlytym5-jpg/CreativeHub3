

(function () {
  'use strict';

  const TITLE_ID = 'pfHeroWords';

  function buildWordHover() {
    const heading = document.getElementById(TITLE_ID);
    if (!heading) return;

    const text = heading.textContent.trim();
    if (!text) return;

    const words = text.split(/\s+/);
    const frag = document.createDocumentFragment();

    words.forEach(function (word, i) {
      const span = document.createElement('span');
      span.className = 'hw-word';
      span.textContent = word;
      frag.appendChild(span);

      if (i < words.length - 1) {
        frag.appendChild(document.createTextNode(' '));
      }
    });

    heading.textContent = '';
    heading.appendChild(frag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWordHover);
  } else {
    buildWordHover();
  }
  window.addEventListener('langChanged', buildWordHover);
})();
