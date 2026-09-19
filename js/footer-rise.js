/*
 * Footer rise — the homepage footer climbs into place as you scroll to the end.
 *
 * Like the statement and the focus gallery, nothing here is a one-shot animation: a 0..1
 * progress value is computed from how far the footer has scrolled into the viewport, and
 * every piece is placed from that value on every frame:
 *
 *     p = 0   the top of the footer is just entering at the bottom of the screen
 *     p = 1   it has scrolled far enough up that the whole footer is in view -> settled
 *
 *   scrolling down  -> p rises: the meta line fades in, the green panel rises, the links
 *                      lift in one after another, and the giant "Creative Hub" mark rises
 *                      out from under the bottom edge of the panel
 *   scrolling up    -> the very same motion plays backwards
 *   stopping        -> everything stays exactly where it is; no timers, no autoplay
 *
 * The rendered progress follows the scroll position with a short time-based easing
 * (SMOOTH_MS), so it stays fluid on wheel notches and touch flicks, and comes to rest
 * as soon as scrolling stops.
 *
 * Only transform + opacity are written (compositor friendly), and only while the footer
 * is near the screen. Once a piece has settled its inline styles are removed, so the
 * footer's own CSS (hover states and so on) takes over untouched. Without JS, or with
 * reduced motion, the footer is simply shown as it always was.
 *
 * The footer is clipped (overflow: clip) while the effect is on, so the panel can start a
 * little below its place without ever making the page taller.
 */
(function () {
  'use strict';

  var footer = document.querySelector('.home-footer');
  if (!footer) return;

  var stage = footer.querySelector('.home-footer-stage');
  var meta = footer.querySelector('.home-footer-meta');
  var mark = footer.querySelector('.home-footer-mark');
  var links = Array.prototype.slice.call(footer.querySelectorAll('.home-footer-links li'));
  if (!stage || !mark) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* ---------------------------- Tunables ---------------------------- */
  var SMOOTH_MS = 120;        // follow-smoothing time constant (higher = floatier)
  var REACH = 0.9;            // share of the footer's height that must scroll into view
                              // before everything has settled

  var META_END = 0.3;         // the meta line (name + year) is in place by here
  var META_RISE_PX = 14;

  var STAGE_END = 0.72;       // the green panel has landed by here
  var STAGE_RISE_PX = 90;     // ...having started this far below its place

  var LINK_START = 0.3;       // first link begins to lift in
  var LINK_STAGGER = 0.07;    // delay between links
  var LINK_SPAN = 0.34;       // how much scroll each link takes
  var LINK_RISE_PX = 22;

  var MARK_START = 0.32;      // the big name starts rising...
  var MARK_END = 1;           // ...and lands exactly when everything has settled
  var MARK_FROM = 118;        // % of its own height below its place (fully under the panel)
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function easeOut(t) { var k = 1 - t; return 1 - k * k * k; }   // quick start, soft landing

  // One record per animated element; `key` remembers the last state written.
  function part(el) { return { el: el, key: '' }; }

  var metaPart = meta ? part(meta) : null;
  var stagePart = part(stage);
  var markPart = part(mark);
  var linkParts = links.map(part);

  // t: 0 = hidden, 1 = settled. y: offset while hidden, in px (or % when unit is '%').
  function place(rec, t, y, unit, fade) {
    var k = 1 - t;
    var key = t >= 1 ? 'done' : t.toFixed(3);
    if (key === rec.key) return;
    rec.key = key;

    if (t >= 1) {                              // settled: hand the element back to its CSS
      rec.el.style.opacity = '';
      rec.el.style.transform = '';
      return;
    }
    rec.el.style.opacity = fade ? t.toFixed(3) : '';
    rec.el.style.transform = 'translate3d(0,' + (k * y).toFixed(2) + (unit || 'px') + ',0)';
  }

  /* ---------------------------- Rendering --------------------------- */
  function render(p) {
    if (metaPart) place(metaPart, easeOut(seg(p, 0, META_END)), META_RISE_PX, 'px', true);

    place(stagePart, easeOut(seg(p, 0, STAGE_END)), STAGE_RISE_PX, 'px', false);

    for (var i = 0; i < linkParts.length; i++) {
      var s = LINK_START + i * LINK_STAGGER;
      place(linkParts[i], easeOut(seg(p, s, s + LINK_SPAN)), LINK_RISE_PX, 'px', true);
    }

    place(markPart, easeOut(seg(p, MARK_START, MARK_END)), MARK_FROM, '%', false);
  }

  /* ------------------------ Scroll -> progress ---------------------- */
  var span = 1;              // px of scroll over which the footer rises
  var target = 0;            // progress straight from the scroll position
  var current = 0;           // progress actually rendered (eased toward target)
  var inView = false;
  var rafId = 0;
  var lastTime = 0;

  function measure() {
    span = Math.max(footer.offsetHeight * REACH, 1);
  }

  function readTarget() {
    var vh = window.innerHeight || 1;
    return clamp((vh - footer.getBoundingClientRect().top) / span, 0, 1);
  }

  function snap() {
    target = readTarget();
    current = target;
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

  function onResize() {
    measure();
    snap();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(onResize).observe(footer);
  } else {
    window.addEventListener('resize', onResize);
  }

  // Only do work (and hold GPU layers) while the footer is near the screen. On enter and
  // leave, jump straight to the true position so nothing "catches up" after a fast scroll.
  var layered = [stagePart, markPart].concat(linkParts, metaPart ? [metaPart] : []);

  function setInView(visible) {
    if (visible === inView) return;
    inView = visible;
    layered.forEach(function (rec) { rec.el.style.willChange = visible ? 'transform, opacity' : ''; });
    snap();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      setInView(entries[0].isIntersecting);
    }, { rootMargin: '160px 0px' }).observe(footer);
  } else {
    inView = true;
  }

  // Clip the footer so pieces that start below their place never lengthen the page.
  footer.style.overflow = (window.CSS && CSS.supports && CSS.supports('overflow', 'clip')) ? 'clip' : 'hidden';

  // Web fonts change the size of the big name; re-measure once they are in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(onResize);
  }

  measure();
  snap();
})();
