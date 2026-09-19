/*
 * Focus fade — turns the gallery's green background white as you near the last images.
 *
 * Plugs into the existing scroll engine (window.FocusScroll.register, see
 * js/focus-scroll.js) and receives { hold } (0..1) every frame. Over the last part of
 * the gallery's hold phase it fades the whole green layer (.focus-scroll-bg: flat fill +
 * glows) out, revealing the section's white behind the tiles. It is scrubbed by scroll
 * position, so scrolling back up brings the green back.
 *
 * Only opacity is written (compositor friendly). With reduced motion the engine never
 * runs extensions, so the static green block is left exactly as it was.
 */
(function () {
  'use strict';

  var section = document.getElementById('focusScroll');
  if (!section) return;

  var bg = section.querySelector('.focus-scroll-bg');
  var api = window.FocusScroll;
  if (!bg || !api || typeof api.register !== 'function') return;

  /* ---------------------------- Tunables ---------------------------- */
  var FADE_START = 0.7;    // how far through the gallery the green starts to fade
  var FADE_END = 0.97;     // ...and where it is fully white
  var WHITE_AT = 0.5;      // labels/cursor switch to dark once this much has faded
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smooth(t) { return t * t * (3 - 2 * t); }

  var lastOpacity = '';
  var lastWhite = false;

  api.register({
    render: function (s) {
      var t = smooth(clamp((s.hold - FADE_START) / (FADE_END - FADE_START), 0, 1));

      var opacity = (1 - t).toFixed(3);
      if (opacity !== lastOpacity) {
        bg.style.opacity = opacity;
        lastOpacity = opacity;
      }

      var white = t > WHITE_AT;
      if (white !== lastWhite) {
        section.classList.toggle('is-bg-white', white);
        lastWhite = white;
      }
    }
  });
})();
