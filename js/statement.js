/*
 * Editorial statement — letters driven DIRECTLY by scroll position (English + Arabic).
 *
 * Nothing here is a one-time animation. A 0..1 progress value is computed from where
 * the sentence currently is in the viewport, and every letter's opacity, scale,
 * rotation and rise are calculated from that progress on every frame:
 *
 *     p = 0   the sentence is entering at the bottom of the screen -> letters hidden
 *     p = 1   it has travelled up to the reading position         -> letters settled
 *
 *   scrolling down  -> p rises, letters appear one after another (left to right)
 *   scrolling up    -> p falls, the very same motion plays backwards
 *   stopping        -> the state simply stays where it is; no timers, no autoplay
 *
 * Each letter gets its own slice of the progress range (its "window"), with a little
 * fixed jitter so the reveal feels organic rather than mechanical. The rendered
 * progress follows the scroll position with a short time-based easing (SMOOTH_MS) so it
 * stays fluid on wheel notches and touch flicks, but it is always derived from the scroll
 * position and comes to rest as soon as scrolling stops.
 *
 * Copy for each language lives on #statementText:
 *     data-st-en="Let’s build *something* together."
 *     data-st-ar="لنبنِ *شيئاً* معاً."
 * (*word* = emphasised word: italic in English, bold in Arabic.)
 * English is split per character. Arabic is split per WORD: Arabic letters join, and
 * boxing a single letter would break the word into isolated forms.
 *
 * Only transform + opacity are written (compositor friendly), and only while the
 * section is near the screen. Reduced motion: plain, fully visible text, no listeners.
 */
(function () {
  'use strict';

  var section = document.getElementById('statement');
  var text = document.getElementById('statementText');
  if (!section || !text) return;
  if (!text.getAttribute('data-st-en')) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------- Tunables ---------------------------- */
  var ENTER = 0.95;          // progress = 0 when the sentence's top is at this fraction of the viewport height
  var DONE = 0.42;           // progress = 1 when its top has reached this fraction
  var SMOOTH_MS = 110;       // follow-smoothing time constant (higher = floatier)

  var CONFIG = {
    en: { win: 0.34, jitter: 0.08, tilt: 9, rise: [0.24, 0.5], scale: [0.8, 0.92] },  // per character
    ar: { win: 0.62, jitter: 0.06, tilt: 5, rise: [0.16, 0.3], scale: [0.84, 0.92] }  // per word
  };
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smooth(t) { return t * t * (3 - 2 * t); }

  // Deterministic pseudo-random in [0, 1): the reveal is identical on every visit.
  function rnd(i, salt) {
    var x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
  }

  // "Let’s build *something* together." -> [{text, italic}, ...]
  function parse(lang) {
    var raw = text.getAttribute('data-st-' + lang) || text.getAttribute('data-st-en') || '';
    return raw.split('*').map(function (t, i) {
      return { text: t, italic: i % 2 === 1 };
    }).filter(function (seg) { return seg.text; });
  }

  /* ---------------------------- Building ---------------------------- */
  var pieces = [];           // { el, start, win, rot, y, s, cache }
  var rendered = '';

  function build(lang) {
    if (lang === rendered) return;
    rendered = lang;

    var segs = parse(lang);
    text.setAttribute('lang', lang);
    pieces = [];

    // Reduced motion: plain text, emphasis via <em> (styled per language in the CSS).
    if (reduceMotion) {
      text.textContent = '';
      segs.forEach(function (seg) {
        if (seg.italic) {
          var em = document.createElement('em');
          em.textContent = seg.text;
          text.appendChild(em);
        } else {
          text.appendChild(document.createTextNode(seg.text));
        }
      });
      return;
    }

    var cfg = CONFIG[lang];
    var perWord = lang === 'ar';
    var plain = segs.map(function (s) { return s.text; }).join('').replace(/\s+/g, ' ').trim();

    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    var reader = document.createElement('span');
    reader.className = 'statement-sr';
    reader.textContent = plain;

    var raw = [];            // the pieces in reading order, before timing is assigned

    function piece(str) {
      var span = document.createElement('span');
      span.className = 'st-char';
      span.textContent = str;
      raw.push(span);
      return span;
    }

    segs.forEach(function (seg) {
      seg.text.split(/(\s+)/).forEach(function (token) {
        if (!token) return;

        if (/^\s+$/.test(token)) {
          visual.appendChild(document.createTextNode(' '));
          return;
        }

        var word = document.createElement('span');
        word.className = 'st-word' + (seg.italic ? ' st-word--italic' : '');

        if (perWord) {
          word.appendChild(piece(token));
        } else {
          Array.prototype.forEach.call(token, function (ch) {
            word.appendChild(piece(ch));
          });
        }
        visual.appendChild(word);
      });
    });

    text.textContent = '';
    text.appendChild(reader);
    text.appendChild(visual);

    // Spread the windows across the progress range: the first piece starts at p = 0,
    // the last one finishes exactly at p = 1; the jitter keeps the order organic.
    var n = raw.length;
    raw.forEach(function (el, i) {
      var base = n > 1 ? (i / (n - 1)) * (1 - cfg.win) : 0;
      var start = clamp(base + (rnd(i, 1) - 0.5) * cfg.jitter, 0, 1 - cfg.win);
      pieces.push({
        el: el,
        start: start,
        win: cfg.win,
        rot: (rnd(i, 2) - 0.5) * 2 * cfg.tilt,
        y: cfg.rise[0] + rnd(i, 3) * (cfg.rise[1] - cfg.rise[0]),
        s: cfg.scale[0] + rnd(i, 4) * (cfg.scale[1] - cfg.scale[0]),
        cache: ''
      });
    });
  }

  build(currentLang());

  if (reduceMotion) return;

  /* ---------------------------- Rendering --------------------------- */
  function render(p) {
    for (var i = 0; i < pieces.length; i++) {
      var c = pieces[i];
      var t = smooth(clamp((p - c.start) / c.win, 0, 1));
      var key = t.toFixed(3);
      if (key === c.cache) continue;
      c.cache = key;

      if (t >= 1) {                     // settled: crisp text, no transform left behind
        c.el.style.opacity = '1';
        c.el.style.transform = 'none';
      } else {
        var k = 1 - t;
        c.el.style.opacity = t.toFixed(3);
        c.el.style.transform =
          'translate3d(0,' + (k * c.y).toFixed(3) + 'em,0) ' +
          'rotate(' + (k * c.rot).toFixed(2) + 'deg) ' +
          'scale(' + (1 - k * (1 - c.s)).toFixed(4) + ')';
      }
    }
  }

  /* ------------------------ Scroll -> progress ---------------------- */
  var target = 0;            // progress straight from the scroll position
  var current = 0;           // progress actually rendered (eased toward target)
  var inView = false;
  var rafId = 0;
  var lastTime = 0;

  function readTarget() {
    var vh = window.innerHeight || 1;
    var top = text.getBoundingClientRect().top;
    return clamp((vh * ENTER - top) / (vh * (ENTER - DONE)), 0, 1);
  }

  function snap() {
    target = readTarget();
    current = target;
    for (var i = 0; i < pieces.length; i++) pieces[i].cache = '';   // force a full redraw
    render(current);
  }

  function tick(now) {
    rafId = 0;
    var dt = clamp(now - lastTime, 1, 64);
    lastTime = now;

    current += (target - current) * (1 - Math.exp(-dt / SMOOTH_MS));
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current);

    if (current !== target) rafId = requestAnimationFrame(tick);   // stops once it has settled
  }

  function schedule() {
    if (rafId) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', function () {
    if (!inView) return;
    target = readTarget();
    schedule();
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (inView) snap();
  });

  // Language switcher: rebuild in the other language, keeping the current progress.
  window.addEventListener('langChanged', function () {
    build(currentLang());
    snap();
  });

  // Only do work (and hold GPU layers) while the section is near the screen. On enter
  // and leave, jump straight to the true position so nothing "catches up" after a fast
  // scroll past the section.
  function setInView(visible) {
    if (visible === inView) return;
    inView = visible;
    section.classList.toggle('is-active', visible);
    snap();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      setInView(entries[0].isIntersecting);
    }, { rootMargin: '120px 0px' }).observe(section);
  } else {
    inView = true;
    section.classList.add('is-active');
  }

  // Web fonts change the size of the sentence; re-measure once they are in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (inView) snap(); });
  }

  snap();
})();
