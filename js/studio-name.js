/*
 * CREATIVEHUB name — mouse-driven colour that lives ONLY inside the letters.
 *
 * How it works:
 *  - The word is real SVG <text> inside a <clipPath> (see #studioName in index.html).
 *    Everything painted in the clipped group — a resting base colour and two radial
 *    gradients (violet halo + mint core) — is cut to the letter shapes, so the light
 *    can never spill outside them and no cursor circle is ever visible.
 *  - The pointer position (mapped into SVG units) is followed with time-based easing.
 *    The core follows quickly, the halo a beat behind, so the blend trails naturally.
 *  - Light strength eases in as the pointer nears the word and eases back to the
 *    resting state when it leaves. Nothing runs while the pointer is idle.
 *  - Reduced motion / touch (no hover): no listeners; the letters get a calm, static
 *    violet-to-mint blend instead.
 */
(function () {
  'use strict';

  var wrap = document.getElementById('studioName');
  if (!wrap) return;

  var section = document.getElementById('studioStage') || wrap.parentNode;
  var svg = wrap.querySelector('svg');
  var fx = wrap.querySelector('.studio-name-fx');
  var halo = document.getElementById('studioNameHalo');
  var core = document.getElementById('studioNameCore');
  if (!svg || !fx || !halo || !core) return;

  var vb = svg.viewBox.baseVal;
  var W = vb.width || 1200;
  var H = vb.height || 150;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------- Tunables ---------------------------- */
  var CORE_MS = 130;        // follow time constant of the mint core (lower = tighter)
  var HALO_MS = 300;        // ...and of the violet halo (higher = more trailing)
  var FADE_MS = 260;        // how fast the light fades in / out
  var REACH = 1.6;          // how far (in word heights) the pointer can be and still light it
  var STATIC_STRENGTH = 0.6; // resting blend on touch / reduced motion
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smooth(t) { return t * t * (3 - 2 * t); }

  var tx = W / 2, ty = H / 2;   // target position (SVG units)
  var cx = tx, cy = ty;         // core position
  var hx = tx, hy = ty;         // halo position
  var sTarget = 0, s = 0;       // light strength
  var fresh = true;             // next pointer move snaps instead of flying in
  var inside = false;
  var lastX = 0, lastY = 0;
  var rafId = 0, lastTime = 0;

  function apply() {
    halo.setAttribute('cx', hx.toFixed(2));
    halo.setAttribute('cy', hy.toFixed(2));
    core.setAttribute('cx', cx.toFixed(2));
    core.setAttribute('cy', cy.toFixed(2));
    fx.style.opacity = s.toFixed(3);
  }

  /* Static state (touch devices and reduced motion): no listeners, no loop. */
  if (reduceMotion || !canHover) {
    hx = W * 0.42; hy = H * 0.5;
    cx = W * 0.58; cy = H * 0.5;
    s = STATIC_STRENGTH;
    apply();
    return;
  }

  function aim(clientX, clientY) {
    var r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var nx = (clientX - r.left) / r.width;
    var ny = (clientY - r.top) / r.height;

    tx = clamp(nx, 0, 1) * W;
    ty = clamp(ny, 0, 1) * H;

    // Proximity: full strength over the word, fading out as the pointer moves away.
    var dy = ny < 0 ? -ny * r.height : (ny > 1 ? (ny - 1) * r.height : 0);
    var reach = Math.max(r.height * REACH, 140);
    sTarget = 1 - smooth(clamp(dy / reach, 0, 1));

    if (fresh) {              // first move after entering: start under the pointer
      cx = hx = tx;
      cy = hy = ty;
      fresh = false;
    }
  }

  function tick(now) {
    rafId = 0;
    var dt = clamp(now - lastTime, 1, 64);
    lastTime = now;

    var kCore = 1 - Math.exp(-dt / CORE_MS);
    var kHalo = 1 - Math.exp(-dt / HALO_MS);
    var kFade = 1 - Math.exp(-dt / FADE_MS);

    cx += (tx - cx) * kCore;  cy += (ty - cy) * kCore;
    hx += (tx - hx) * kHalo;  hy += (ty - hy) * kHalo;
    s += (sTarget - s) * kFade;

    var settled =
      Math.abs(tx - hx) < 0.05 && Math.abs(ty - hy) < 0.05 &&
      Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05 &&
      Math.abs(sTarget - s) < 0.002;

    if (settled) {
      cx = hx = tx; cy = hy = ty; s = sTarget;
    }
    apply();

    if (!settled) rafId = requestAnimationFrame(tick);
  }

  function schedule() {
    if (rafId) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function onMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    inside = true;
    lastX = e.clientX;
    lastY = e.clientY;
    aim(lastX, lastY);
    schedule();
  }

  function onLeave(e) {
    if (e && e.pointerType && e.pointerType !== 'mouse') return;
    inside = false;
    fresh = true;
    sTarget = 0;              // light fades out; the letters return to their resting colour
    schedule();
  }

  // While the pointer rests and the page scrolls, the word moves under it.
  var scrollScheduled = false;
  window.addEventListener('scroll', function () {
    if (!inside || scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(function () {
      scrollScheduled = false;
      aim(lastX, lastY);
      schedule();
    });
  }, { passive: true });

  section.addEventListener('pointermove', onMove);
  section.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', function () { onLeave(); });

  apply();
})();
