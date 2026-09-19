/*
 * Dot field — a dense, procedural dot grid that answers the mouse.
 *
 * Nothing here is an image. The grid is generated from the size of the canvas inside the
 * framed panel (#dotfieldStage) and drawn on it; every dot owns a value v (0..1) that decides its size and
 * brightness, and each frame that value is eased toward a target computed from the
 * dot's distance to the pointer:
 *
 *     target = smoothstep(1 - distance / REACH)     strongest under the pointer,
 *                                                   fading to nothing at REACH
 *
 *  - The pointer position itself is followed with a short easing (FOLLOW_MS), so the
 *    light glides instead of jumping between mouse events.
 *  - Dots ease IN quickly and OUT slowly (IN_MS / OUT_MS): a soft trail is left behind
 *    the pointer, and when the pointer leaves everything relaxes back to its resting look.
 *  - No visible cursor, no glow layer, no particles: only the dots themselves change.
 *  - The loop only runs while something is moving. When the grid is at rest, or the
 *    section is off screen, no frames are scheduled.
 *  - Reduced motion: a static, calm grid; no listeners.
 *  - Touch: a finger on the grid lights the dots under it; page scrolling is untouched.
 */
(function () {
  'use strict';

  var stage = document.getElementById('dotfieldStage');
  var canvas = document.getElementById('dotfieldCanvas');
  if (!stage || !canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------- Tunables ---------------------------- */
  var GAP = 22;              // distance between dots (px)
  var GAP_SMALL = 18;        // ...on phones, so the grid stays dense
  var SMALL_BELOW = 640;     // width (px) under which GAP_SMALL is used

  var DOT_R = 1.15;          // resting radius (px)
  var GROW = 1.7;            // extra radius at full strength (px)

  var REACH = 210;           // how far the pointer's influence extends (px)
  var REACH_SMALL = 140;

  var REST = [40, 36, 50];   // resting colour: barely lighter than the background
  var LIT = [242, 239, 248]; // colour of a dot directly under the pointer

  var FOLLOW_MS = 75;        // pointer smoothing (higher = floatier)
  var IN_MS = 90;            // dots brighten with this time constant...
  var OUT_MS = 340;          // ...and relax back with this one (higher = longer trail)
  /* ------------------------------------------------------------------ */

  var TAU = Math.PI * 2;
  var EPS = 0.0015;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  var w = 0, h = 0;          // canvas size in CSS px
  var gap = GAP, reach = REACH;
  var cols = 0, rows = 0, ox = 0, oy = 0;
  var vals = new Float32Array(0);

  var active = false;        // pointer is over the grid
  var fresh = true;          // next pointer position snaps instead of gliding in
  var inView = true;
  var clientX = 0, clientY = 0;   // latest pointer position (viewport px)
  var px = 0, py = 0;             // eased pointer position (canvas px)
  var rafId = 0;
  var lastTime = 0;

  var restCss = 'rgb(' + REST[0] + ',' + REST[1] + ',' + REST[2] + ')';

  /* ---------------------------- Sizing ------------------------------ */
  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var small = w <= SMALL_BELOW;
    gap = small ? GAP_SMALL : GAP;
    reach = small ? REACH_SMALL : REACH;

    // Whole number of dots, centred so both sides have the same margin.
    cols = Math.max(2, Math.floor(w / gap));
    rows = Math.max(2, Math.floor(h / gap));
    ox = (w - (cols - 1) * gap) / 2;
    oy = (h - (rows - 1) * gap) / 2;
    vals = new Float32Array(cols * rows);

    draw();
    if (active) schedule();
  }

  /* ---------------------------- Drawing ----------------------------- */
  function draw() {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    var i, x, y, c, r;

    // Dots at rest are identical: paint them all in one path.
    ctx.fillStyle = restCss;
    ctx.beginPath();
    for (i = 0; i < vals.length; i++) {
      if (vals[i] > EPS) continue;
      x = ox + (i % cols) * gap;
      y = oy + ((i / cols) | 0) * gap;
      ctx.moveTo(x + DOT_R, y);
      ctx.arc(x, y, DOT_R, 0, TAU);
    }
    ctx.fill();

    // Dots the pointer is touching: each has its own size and colour.
    for (i = 0; i < vals.length; i++) {
      var v = vals[i];
      if (v <= EPS) continue;
      x = ox + (i % cols) * gap;
      y = oy + ((i / cols) | 0) * gap;
      r = DOT_R + GROW * v;
      ctx.fillStyle =
        'rgb(' +
        Math.round(REST[0] + (LIT[0] - REST[0]) * v) + ',' +
        Math.round(REST[1] + (LIT[1] - REST[1]) * v) + ',' +
        Math.round(REST[2] + (LIT[2] - REST[2]) * v) + ')';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
  }

  /* ---------------------------- Animation --------------------------- */
  function tick(now) {
    rafId = 0;
    if (!inView) return;

    var dt = clamp(now - lastTime, 1, 64);
    lastTime = now;

    // Where the pointer is on the canvas right now (the page may have scrolled under it).
    var rect = canvas.getBoundingClientRect();
    var tx = clientX - rect.left;
    var ty = clientY - rect.top;

    if (fresh) {
      px = tx;
      py = ty;
      fresh = false;
    } else {
      var kf = 1 - Math.exp(-dt / FOLLOW_MS);
      px += (tx - px) * kf;
      py += (ty - py) * kf;
    }
    var pointerSettled = Math.abs(tx - px) < 0.3 && Math.abs(ty - py) < 0.3;

    var kIn = 1 - Math.exp(-dt / IN_MS);
    var kOut = 1 - Math.exp(-dt / OUT_MS);
    var r2 = reach * reach;
    var busy = false;

    for (var i = 0; i < vals.length; i++) {
      var target = 0;

      if (active) {
        var dx = ox + (i % cols) * gap - px;
        var dy = oy + ((i / cols) | 0) * gap - py;
        var d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          var t = 1 - Math.sqrt(d2) / reach;      // 1 at the pointer, 0 at REACH
          target = t * t * (3 - 2 * t);           // smooth radial falloff
        }
      }

      var v = vals[i];
      v += (target - v) * (target > v ? kIn : kOut);
      if (Math.abs(target - v) < EPS) v = target;
      else busy = true;
      vals[i] = v;
    }

    draw();

    // Keep going while the pointer is gliding or any dot is still easing; otherwise sleep.
    if (busy || (active && !pointerSettled)) schedule();
  }

  function schedule() {
    if (rafId || !inView) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function reset() {
    for (var i = 0; i < vals.length; i++) vals[i] = 0;
    draw();
  }

  /* ---------------------------- Input ------------------------------- */
  function aim(e) {
    clientX = e.clientX;
    clientY = e.clientY;
    if (!active) {
      active = true;
      fresh = true;               // start under the pointer instead of flying in
    }
    schedule();
  }

  function release() {
    if (!active) return;
    active = false;
    schedule();                   // the dots ease back to their resting state
  }

  function start() {
    stage.addEventListener('pointerenter', aim);
    stage.addEventListener('pointermove', aim);
    stage.addEventListener('pointerdown', aim);
    stage.addEventListener('pointerleave', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('pointerup', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') release();   // a finger has lifted
    });
    window.addEventListener('blur', release);

    // The pointer can rest while the page scrolls: the grid moves under it.
    window.addEventListener('scroll', function () {
      if (active) schedule();
    }, { passive: true });

    // Sleep while the section is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible === inView) return;
        inView = visible;
        if (visible) {
          if (active) schedule();
        } else {
          active = false;
          if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
          reset();
        }
      }, { rootMargin: '120px 0px' }).observe(stage);
    }
  }

  /* ---------------------------- Boot -------------------------------- */
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  // Reduced motion: keep the calm static grid, skip every listener.
  if (!reduceMotion) start();
})();
