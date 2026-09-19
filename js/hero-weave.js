/*
 * Hero title weave — a mint line that glides across "We craft bold"
 * (and the Arabic "نبتكر لك"), passing in front of one letter and behind the next.
 *
 * Cycle: the words start clean -> the line slides in from the left, weaves over
 * and under the letters, exits on the right and disappears -> short pause -> repeat.
 *
 * How it works:
 *  - Two SVG layers sit inside #heroWeave: one BEHIND the text, one IN FRONT.
 *  - The wave is a fixed "track" of S-curves between pinned peaks/troughs.
 *    Every down-stroke is drawn on the front layer, every up-stroke on the back
 *    layer, so the line alternates over / under the letters. The switch always
 *    happens at a peak or trough, where the line is clear of the glyphs.
 *  - The line you see is a sliding window over that track (a CSS mask driven by
 *    the --weave-a..d variables on #heroWeave), so it moves like a snake along
 *    the track. Peaks also breathe very slightly so it never looks mechanical.
 */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Timing (ms): clean pause with no line, then one left -> right pass.
  var GAP_MS = 1800;
  var SWEEP_MS = 4000;
  var CYCLE_MS = GAP_MS + SWEEP_MS;

  // Extra length of the line past the end of the words, on the RIGHT side only (in em).
  var EXTRA_RIGHT_EM = 0.3;

  function easeInOutCubic(p) {
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  }

  function initHeroWeave() {
    var wrap = document.getElementById('heroWeave');
    if (!wrap) return;

    var textEl = wrap.querySelector('.hero-weave-text');
    var backSvg = wrap.querySelector('.hero-weave-svg--back');
    var frontSvg = wrap.querySelector('.hero-weave-svg--front');
    if (!textEl || !backSvg || !frontSvg) return;

    function makePath(svg, thin) {
      var p = document.createElementNS(SVGNS, 'path');
      if (thin) p.setAttribute('class', 'is-thin');
      svg.appendChild(p);
      return p;
    }

    var backMain = makePath(backSvg, false);
    var backThin = makePath(backSvg, true);
    var frontMain = makePath(frontSvg, false);
    var frontThin = makePath(frontSvg, true);

    var geo = null;
    var running = false;
    var inView = true;
    var rafId = 0;
    var t0 = performance.now();

    function f(n) { return n.toFixed(1); }

    // Builds the front (down-strokes) and back (up-strokes) path data.
    function buildWave(t, phase, ampScale, dy) {
      var front = '';
      var back = '';
      var hw = geo.hw;
      var half = hw * 0.5;
      var prevX = 0;
      var prevY = 0;

      for (var k = 0; k <= geo.N; k++) {
        var sign = (k % 2 === 0) ? -1 : 1;
        var amp = geo.amp * ampScale * (1 + 0.12 * Math.sin(t * 0.9 + k * 0.9 + phase));
        var x = k * hw;
        var y = geo.cy + dy + sign * amp;

        if (k > 0) {
          var seg = 'M' + f(prevX) + ' ' + f(prevY) +
            'C' + f(prevX + half) + ' ' + f(prevY) + ' ' +
            f(x - half) + ' ' + f(y) + ' ' +
            f(x) + ' ' + f(y);
          if ((k - 1) % 2 === 0) front += seg; else back += seg;
        }
        prevX = x;
        prevY = y;
      }
      return { front: front, back: back };
    }

    function drawWave(t) {
      var bob = geo.fs * 0.03 * Math.sin(t * 0.6);

      var main = buildWave(t, 0, 1, bob);
      var thin = buildWave(t, 1.3, 0.92, bob + geo.fs * 0.07);

      frontMain.setAttribute('d', main.front);
      backMain.setAttribute('d', main.back);
      frontThin.setAttribute('d', thin.front);
      backThin.setAttribute('d', thin.back);
    }

    // Moves the visible window (head = leading edge, tail = trailing edge).
    function setWindow(elapsed) {
      var a, b, c, d;

      if (reduceMotion) {
        // Static: show the whole line with soft ends.
        a = 0;
        b = geo.L * 0.12;
        c = geo.L * 0.88;
        d = geo.L;
      } else {
        var inCycle = elapsed % CYCLE_MS;
        var head = 0; // 0 = nothing visible yet (pause)
        if (inCycle >= GAP_MS) {
          var p = (inCycle - GAP_MS) / SWEEP_MS;
          head = easeInOutCubic(p) * (geo.L + geo.snake);
        }
        d = head;
        c = head - geo.feather;
        a = head - geo.snake;
        b = a + geo.feather;
      }

      wrap.style.setProperty('--weave-a', f(a) + 'px');
      wrap.style.setProperty('--weave-b', f(b) + 'px');
      wrap.style.setProperty('--weave-c', f(c) + 'px');
      wrap.style.setProperty('--weave-d', f(d) + 'px');
    }

    function render(now) {
      if (!geo) return;
      var elapsed = Math.max(now - t0, 0);
      drawWave(elapsed / 1000);
      setWindow(elapsed);
    }

    function frame(now) {
      rafId = 0;
      if (!running) return;
      render(now);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion || !geo) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function updateRunState() {
      if (inView && !document.hidden && geo && !wrap.classList.contains('is-wrapped')) {
        start();
      } else {
        stop();
      }
    }

    function measure() {
      var rect = wrap.getBoundingClientRect();
      var W = rect.width;
      var H = rect.height;
      if (!W || !H) return;

      var fs = parseFloat(window.getComputedStyle(textEl).fontSize) || 64;

      // If the title wraps onto two lines (very narrow screens) skip the effect.
      var rects = textEl.getClientRects();
      var wrapped = false;
      for (var i = 1; i < rects.length; i++) {
        if (Math.abs(rects[i].top - rects[0].top) > fs * 0.5) wrapped = true;
      }
      wrap.classList.toggle('is-wrapped', wrapped);
      if (wrapped) {
        geo = null;
        stop();
        return;
      }

      var extL = fs * 0.55;                        // track past the start of the words (left)
      var extR = fs * (0.55 + EXTRA_RIGHT_EM);     // track past the end of the words (right)
      var vpad = fs * 0.35;                        // vertical room above/below for the wave
      var L = W + extL + extR;
      var N = Math.max(2, Math.round(L / (fs * 0.85)));
      var feather = fs * 0.9; // soft fade at the head and tail of the line

      geo = {
        fs: fs,
        L: L,
        N: N,
        hw: L / N,
        amp: fs * 0.56,
        cy: vpad + H / 2,
        feather: feather,
        snake: Math.max(L * 0.5, feather * 3) // visible length of the line
      };

      [backSvg, frontSvg].forEach(function (svg) {
        svg.style.left = (-extL) + 'px';
        svg.style.top = (-vpad) + 'px';
        svg.style.width = L + 'px';
        svg.style.height = (H + vpad * 2) + 'px';
        svg.setAttribute('viewBox', '0 0 ' + f(L) + ' ' + f(H + vpad * 2));
      });

      render(performance.now());
      updateRunState();
    }

    // Re-measure whenever the title changes size (language swap, font load, resize).
    if ('ResizeObserver' in window) {
      new ResizeObserver(measure).observe(wrap);
    } else {
      window.addEventListener('resize', measure);
      window.addEventListener('langChanged', measure);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    // Pause when the hero is off-screen or the tab is hidden.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        updateRunState();
      }).observe(wrap);
    }
    document.addEventListener('visibilitychange', updateRunState);

    // Start the first pass only once the page loader is gone and the hero has appeared.
    window.addEventListener('pageLoaderDone', function () {
      t0 = performance.now();
    });

    measure();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroWeave);
  } else {
    initHeroWeave();
  }
})();
