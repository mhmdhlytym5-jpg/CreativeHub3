/*
 * Focus scroll section — a green glow rises from the bottom of the section while
 * the centred statement fades in, then a media gallery rises out of that same green.
 * Everything is SCRUBBED by scroll position: scroll down = progress, scroll up =
 * reverses, nothing plays on its own.
 *
 * How it works:
 *  - #focusScroll is a tall track with a sticky, full-viewport stage inside it.
 *  - Progress (0..1) = how far the track has scrolled while the stage is pinned.
 *  - The track is split into three PHASES, sized in CSS:
 *        --focus-scroll-distance   glow + statement          (the original effect)
 *        --focus-rise-distance     media rises out of the green
 *        --focus-hold-distance     the finished gallery stays pinned for exploring
 *    If the two gallery variables are absent (0) the section behaves exactly like
 *    the original single-phase version.
 *  - The raw progress is followed with a little time-based easing (SMOOTH_MS) so
 *    it stays smooth on wheel notches / touch flicks, yet it is always derived
 *    from the scroll position — never from a timer or a one-shot trigger.
 *  - Only transform + opacity are written each frame (compositor friendly).
 *  - Extensions (js/focus-gallery.js) plug in through window.FocusScroll.register()
 *    and receive { progress, text, rise, hold } every frame, each 0..1.
 *
 * Milestones of the first phase (progress -> look):
 *    0%   pure white, text invisible
 *   25%   a very faint green glow hugs the bottom edge
 *   50%   glow has climbed to the middle, first text line appears
 *   75%   most of the section is green, text clearly visible
 *  100%   full green, all three lines fully visible  -> gallery starts rising
 */
(function () {
  'use strict';

  var section = document.getElementById('focusScroll');
  if (!section) return;

  var stage = section.querySelector('.focus-scroll-stage');
  var glowWide = section.querySelector('.focus-glow--wide');
  var glowCore = section.querySelector('.focus-glow--core');
  var fill = section.querySelector('.focus-fill');
  var lines = Array.prototype.slice.call(section.querySelectorAll('.focus-line'));
  if (!stage || !glowWide || !glowCore || !fill) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Extension hook: lets the gallery ride on this same scroll track. */
  var extensions = [];
  window.FocusScroll = {
    reduced: reduceMotion,
    register: function (ext) {
      if (reduceMotion || !ext) return;
      extensions.push(ext);
      if (typeof ext.measure === 'function') ext.measure();
      if (typeof ext.setActive === 'function') ext.setActive(inView);
      measure();
      snap();
    }
  };

  // Reduced motion: CSS shows the finished green statement as a static block.
  if (reduceMotion) {
    section.classList.add('is-static');
    return;
  }

  /* ---------------------------- Tunables ---------------------------- */
  var SMOOTH_MS = 120;        // follow-smoothing time constant (higher = floatier)

  var GLOW_START = 0.03;      // wide glow starts fading in
  var GLOW_FULL = 0.55;       // ...and reaches full strength

  var CORE_IN_START = 0.06;   // bright hot-spot fades in
  var CORE_IN_END = 0.5;
  var CORE_OUT_START = 0.72;  // ...and dissolves into the finished green
  var CORE_OUT_END = 1.0;

  var FILL_START = 0.5;       // flat brand green fades in underneath everything
  var FILL_END = 1.0;

  var TEXT_START = 0.38;      // first line begins to appear
  var TEXT_STAGGER = 0.09;    // delay between lines
  var TEXT_SPAN = 0.28;       // how much scroll each line takes to fully appear
  var TEXT_RISE_PX = 28;      // lines drift up this far as they appear
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function range(v, a, b) { return b > a ? clamp((v - a) / (b - a), 0, 1) : (v >= b ? 1 : 0); }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function f(n, d) { return n.toFixed(d); }

  /* ---------------------------- Rendering --------------------------- */
  function render(p) {
    // Wide glow: grows out of the bottom centre, rising slightly as it swells.
    var wideScale = 0.06 + 1.2 * Math.pow(p, 1.3);
    var wideRise = (1 - smooth(range(p, 0, 0.6))) * 12; // % of its own height
    glowWide.style.opacity = f(smooth(range(p, GLOW_START, GLOW_FULL)), 3);
    glowWide.style.transform =
      'translate3d(-50%,' + f(wideRise, 2) + '%,0) scale(' + f(wideScale, 4) + ')';

    // Core: denser heart of the glow that hands over to the flat green at the end.
    var coreScale = 0.05 + 0.95 * Math.pow(p, 1.1);
    var coreRise = (1 - smooth(range(p, 0, 0.5))) * 10;
    var coreOpacity =
      smooth(range(p, CORE_IN_START, CORE_IN_END)) *
      (1 - smooth(range(p, CORE_OUT_START, CORE_OUT_END)));
    glowCore.style.opacity = f(coreOpacity, 3);
    glowCore.style.transform =
      'translate3d(-50%,' + f(coreRise, 2) + '%,0) scale(' + f(coreScale, 4) + ')';

    // Flat brand green so the final state is fully, evenly green.
    fill.style.opacity = f(smooth(range(p, FILL_START, FILL_END)), 3);

    // Statement: each line fades in and rises, staggered.
    for (var i = 0; i < lines.length; i++) {
      var s = TEXT_START + i * TEXT_STAGGER;
      var t = smooth(range(p, s, s + TEXT_SPAN));
      lines[i].style.opacity = f(t, 3);
      lines[i].style.transform = 'translate3d(0,' + f((1 - t) * TEXT_RISE_PX, 2) + 'px,0)';
    }
  }

  /* Splits overall progress into phases and feeds glow/text + extensions. */
  function renderAll(P) {
    var textP = fText >= 1 ? P : range(P, 0, fText);
    render(textP);

    if (!extensions.length) return;
    var state = {
      progress: P,
      text: textP,
      rise: fRise > 0 ? range(P, fText, fText + fRise) : 0,
      hold: fHold > 0 ? range(P, fText + fRise, 1) : 0
    };
    for (var i = 0; i < extensions.length; i++) {
      if (typeof extensions[i].render === 'function') extensions[i].render(state);
    }
  }

  /* ------------------------ Scroll -> progress ---------------------- */
  var span = 1;      // scrollable distance while the stage is pinned (px)
  var fText = 1;     // share of the track used by the glow + statement
  var fRise = 0;     // share used by the media rising
  var fHold = 0;     // share used by the pinned, explorable gallery
  var target = 0;    // progress straight from the scroll position
  var current = 0;   // progress actually rendered (eased toward target)
  var inView = false;
  var rafId = 0;
  var lastTime = 0;

  // Resolves any CSS length (vh, svh, px...) held in a custom property to pixels.
  function cssLength(name) {
    var probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;visibility:hidden;pointer-events:none;width:1px;height:var(' + name + ',0px)';
    section.appendChild(probe);
    var h = probe.offsetHeight;
    section.removeChild(probe);
    return h;
  }

  function measure() {
    span = Math.max(section.offsetHeight - stage.offsetHeight, 1);

    var a = cssLength('--focus-scroll-distance');
    var r = cssLength('--focus-rise-distance');
    var h = cssLength('--focus-hold-distance');
    var sum = a + r + h;
    if (sum <= 0) { a = 1; r = 0; h = 0; sum = 1; }
    fText = a / sum;
    fRise = r / sum;
    fHold = h / sum;
  }

  function readTarget() {
    return clamp(-section.getBoundingClientRect().top / span, 0, 1);
  }

  function snap() {
    target = readTarget();
    current = target;
    renderAll(current);
  }

  function tick(now) {
    rafId = 0;
    var dt = clamp(now - lastTime, 1, 64);
    lastTime = now;

    current += (target - current) * (1 - Math.exp(-dt / SMOOTH_MS));
    if (Math.abs(target - current) < 0.0004) current = target;
    renderAll(current);

    if (current !== target) rafId = requestAnimationFrame(tick);
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

  function onResize() {
    measure();
    for (var i = 0; i < extensions.length; i++) {
      if (typeof extensions[i].measure === 'function') extensions[i].measure();
    }
    snap();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(onResize).observe(section);
  } else {
    window.addEventListener('resize', onResize);
  }

  // Only do work while the section is near the screen. On enter/leave, jump straight
  // to the true position so nothing "catches up" after a fast scroll past the section.
  function setInView(visible) {
    if (visible === inView) return;
    inView = visible;
    section.classList.toggle('is-active', visible);
    for (var i = 0; i < extensions.length; i++) {
      if (typeof extensions[i].setActive === 'function') extensions[i].setActive(visible);
    }
    snap();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      setInView(entries[0].isIntersecting);
    }, { rootMargin: '100px 0px' }).observe(section);
  } else {
    inView = true;
    section.classList.add('is-active');
  }

  measure();
  snap();
})();
