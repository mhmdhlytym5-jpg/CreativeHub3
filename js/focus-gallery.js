/*
 * Focus gallery — the second half of the Focus Scroll experience.
 *
 * It is NOT a separate section: it lives inside the same sticky, full-viewport
 * green stage as the statement, so the media simply rises out of the green that
 * is already there. js/focus-scroll.js owns the scroll position and hands this
 * file three numbers every frame (each 0..1, scrubbed by scroll — scroll up and
 * they run backwards):
 *
 *   text   glow + statement phase      -> statement recedes behind the media
 *   rise   media rising out of the green -> the five columns travel up from below
 *   hold   travelling through the wall   -> columns scroll vertically at their own speeds
 *
 * Interaction priority:
 *   1. VERTICAL SCROLL  primary — the whole wall travels up as you scroll down
 *   2. COLUMN PARALLAX  depth — the five columns move at slightly different rates
 *   3. MOUSE X          secondary — glides the wall sideways to reveal columns 1 and 5
 *
 * Columns 2, 3 and 4 form the visible composition; columns 1 and 5 sit just
 * outside the viewport and are revealed by moving the mouse left or right.
 * On touch / coarse pointers there is no mouse reveal: the wall drifts sideways
 * very slowly with the scroll instead, so every column is still seen.
 *
 * Only transform + opacity are written each frame, and during the long hold phase
 * that is six transforms in total (the track plus five columns).
 */
(function () {
  'use strict';

  /* ==================================================================
   * 1. MEDIA — this is the only block you need to edit.
   * ==================================================================
   * Five columns, left to right. Columns 1 and 5 start off-screen.
   *
   *   width   column width multiplier (1 = the standard column width)
   *   offset  how far below the header the column starts, in vh
   *   lead    parallax character: +1 runs a touch ahead, -1 a touch behind
   *   groups  projects in the column, top to bottom
   *
   * An item is either:
   *   { src: 'assets/images/…', ar: '1600 / 2000' }              an image
   *   { src: 'assets/videos/…', ar: '4 / 5', video: true }       a muted loop
   *
   * `ar` is the tile's aspect ratio ("width / height"). It sets the layout
   * before the file loads, so keep it close to the real file; the media is
   * object-fit: cover, so small differences just crop.
   *
   * Keep the columns roughly the same total height: their height difference is
   * what makes them travel at different speeds, and ~10% is the sweet spot.
   */
  var COLUMNS = [
    {
      width: 1.0, offset: 4, lead: -1,
      groups: [
        {
          en: 'Nawa', ar: 'نوى',
          items: [
            { src: 'assets/images/nawa/nuwa-08.webp', ar: '1600 / 2000' },
            { src: 'assets/images/nawa/nuwa-14.webp', ar: '1600 / 900' },
            { src: 'assets/images/nawa/nuwa-04.webp', ar: '1600 / 2000' },
            { src: 'assets/images/nawa/nuwa-17.webp', ar: '1600 / 2000' },
            { src: 'assets/images/nawa/nuwa-09.webp', ar: '1600 / 2000' }
          ]
        },
        {
          en: 'Zetso', ar: 'Zetso',
          items: [
            { src: 'assets/images/zetso/zetso-07.webp', ar: '1600 / 2000' },
            { src: 'assets/images/zetso/zetso-05.webp', ar: '1600 / 900' },
            { src: 'assets/images/zetso/zetso-09.webp', ar: '1600 / 2000' },
            { src: 'assets/images/zetso/zetso-01.webp', ar: '1600 / 900' },
            { src: 'assets/images/zetso/zetso-11.webp', ar: '1600 / 2000' }
          ]
        }
      ]
    },
    {
      width: 0.94, offset: 11, lead: 0.55,
      groups: [
        {
          en: 'Narjis', ar: 'نرجس',
          items: [
            { src: 'assets/images/narjes/narjes-05.webp', ar: '1600 / 2000' },
            { src: 'assets/images/narjes/narjes-14.webp', ar: '1600 / 1000' },
            { src: 'assets/images/narjes/narjes-06.webp', ar: '1600 / 2300' },
            { src: 'assets/images/narjes/narjes-13.webp', ar: '1600 / 1000' },
            { src: 'assets/images/narjes/narjes-15.webp', ar: '1600 / 2000' }
          ]
        },
        {
          en: 'Crossa', ar: 'Crossa',
          items: [
            { src: 'assets/images/crossa/crossa-05.webp', ar: '1600 / 2000' },
            { src: 'assets/images/crossa/crossa-02.webp', ar: '1600 / 900' },
            { src: 'assets/images/crossa/crossa-09.webp', ar: '1600 / 2000' },
            { src: 'assets/images/crossa/crossa-04.webp', ar: '1600 / 2000' },
            { src: 'assets/images/crossa/crossa-01.webp', ar: '1600 / 2000' }
          ]
        }
      ]
    },
    {
      width: 1.06, offset: 3, lead: -0.6,
      groups: [
        {
          en: 'In Motion', ar: 'لمحات من أعمالنا',
          items: [
            { src: 'assets/videos/vid1.webm', ar: '4 / 5', video: true },
            { src: 'assets/videos/vid2.webm', ar: '4 / 5', video: true },
            { src: 'assets/videos/vid3.webm', ar: '4 / 5', video: true }
          ]
        },
        {
          en: 'Tunay', ar: 'Tunay',
          items: [
            { src: 'assets/images/tunay/tunay-08.webp', ar: '1600 / 2000' },
            { src: 'assets/images/tunay/tunay-04.webp', ar: '1600 / 700' },
            { src: 'assets/images/tunay/tunay-05.webp', ar: '1600 / 2000' },
            { src: 'assets/images/tunay/tunay-02.webp', ar: '1600 / 2000' },
            { src: 'assets/images/tunay/tunay-07.webp', ar: '1600 / 2000' }
          ]
        },
        {
          en: 'In Motion', ar: 'لمحات من أعمالنا',
          items: [
            { src: 'assets/videos/vid4.webm', ar: '4 / 5', video: true }
          ]
        }
      ]
    },
    {
      width: 0.97, offset: 9, lead: 1,
      groups: [
        {
          en: 'Aeris', ar: 'Aeris',
          items: [
            { src: 'assets/images/aeris/aeris-05.webp', ar: '1600 / 2000' },
            { src: 'assets/images/aeris/aeris-08.webp', ar: '1600 / 900' },
            { src: 'assets/images/aeris/aeris-06.webp', ar: '1600 / 2000' },
            { src: 'assets/images/aeris/aeris-04.webp', ar: '1600 / 2000' },
            { src: 'assets/images/aeris/aeris-09.webp', ar: '1600 / 2000' }
          ]
        },
        {
          en: 'Rukna', ar: 'ركنة',
          items: [
            { src: 'assets/images/rukna/rukna-06.webp', ar: '1600 / 900' },
            { src: 'assets/images/rukna/rukna-04.webp', ar: '1600 / 1400' },
            { src: 'assets/images/rukna/rukna-02.webp', ar: '1600 / 1400' },
            { src: 'assets/images/rukna/rukna-03.webp', ar: '1600 / 1400' },
            { src: 'assets/images/rukna/rukna-01.webp', ar: '1600 / 1400' }
          ]
        },
        {
          en: 'In Motion', ar: 'لمحات من أعمالنا',
          items: [
            { src: 'assets/videos/vid5.webm', ar: '4 / 5', video: true }
          ]
        }
      ]
    },
    {
      width: 1.03, offset: 2, lead: -0.35,
      groups: [
        {
          en: '3Sips', ar: '3Sips',
          items: [
            { src: 'assets/images/3sips/3sips-09.webp', ar: '1600 / 2000' },
            { src: 'assets/images/3sips/3sips-03.webp', ar: '2600 / 2000' },
            { src: 'assets/images/3sips/3sips-08.webp', ar: '1600 / 2000' },
            { src: 'assets/images/3sips/3sips-06.webp', ar: '2600 / 2000' },
            { src: 'assets/images/3sips/3sips-04.webp', ar: '1600 / 2000' }
          ]
        },
        {
          en: 'Alavexa', ar: 'ALAVEXA',
          items: [
            { src: 'assets/images/alavxa/alavxa-04.webp', ar: '1600 / 2000' },
            { src: 'assets/images/alavxa/alavxa-11.webp', ar: '1600 / 900' },
            { src: 'assets/images/alavxa/alavxa-09.webp', ar: '1600 / 2000' },
            { src: 'assets/images/alavxa/alavxa-06.webp', ar: '1600 / 2000' },
            { src: 'assets/images/alavxa/alavxa-03.webp', ar: '1600 / 2000' }
          ]
        }
      ]
    }
  ];

  /* ==================================================================
   * 2. FEEL — tuning constants.
   * ================================================================== */
  var TRAVEL_SPEED = 0.82;   // wall movement vs. scroll movement (1 = same speed)
  var HOLD_MIN = 2.6;        // shortest gallery scroll, in viewport heights
                             // (short phone columns travel less, so they get less track)
  var HOLD_MAX = 9;          // longest  gallery scroll, in viewport heights

  var RISE_DUR = 0.55;       // share of the rise phase one column needs to arrive
  var RISE_WAVE = 0.11;      // how much later each ring of columns starts
  var TILE_LAG = 0.05;       // extra delay per tile down the top of a column
  var TILE_LAG_COUNT = 3;    // how many top tiles get that individual lag

  var PARALLAX = 0.05;       // differential column drift, share of the stage height
  var REVEAL_GAIN = 0.92;    // how much of the off-screen column the mouse reveals
  var MOUSE_GAIN = 1.15;     // >1 = the full reveal is reached before the screen edge
  var FOLLOW_MS = 260;       // glide time-constant for the mouse (higher = floatier)
  var DRIFT = 0.62;          // coarse-pointer sideways drift across the scroll
  var DRIFT_START = 0.35;    // ...and how far left of centre that drift starts

  var CURSOR_FOLLOW_MS = 220; // how far behind the pointer the cursor ring trails

  var IMMERSIVE_START = 0.05; // scroll progress into the white phase that hides the header
  var IMMERSIVE_END = 0.99;   // header comes back this far through the gallery

  var MAX_VIDEOS = 3;        // never autoplay more than this at once
  var PRELOAD_SCREENS = 1.2; // load media this far outside the stage
  var MEDIA_TICK_MS = 140;   // how often loading / playback is re-evaluated

  /* ================================================================== */

  var section = document.getElementById('focusScroll');
  var gallery = document.getElementById('focusGallery');
  if (!section || !gallery) return;

  var stageEl = section.querySelector('.focus-scroll-stage');

  var track = gallery.querySelector('.fg-track');
  if (!track) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var api = window.FocusScroll;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function range(v, a, b) { return b > a ? clamp((v - a) / (b - a), 0, 1) : (v >= b ? 1 : 0); }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function easeOut(t) { var u = 1 - t; return 1 - u * u * u; }
  function f(n) { return n.toFixed(2); }

  function setT(el, value) {
    if (el._t !== value) {
      el._t = value;
      el.style.transform = value;
    }
  }

  /* ------------------------- Build the wall ------------------------- */
  var AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  function toArabicDigits(s) {
    return String(s).replace(/\d/g, function (d) { return AR_DIGITS[+d]; });
  }

  var cols = [];
  var allTiles = [];
  var groupNo = 0;

  function makeTile(item, group, isFirst) {
    var fig = document.createElement('figure');
    fig.className = 'fg-tile';
    fig.style.setProperty('--fg-ar', item.ar || '4 / 5');

    var frame = document.createElement('div');
    frame.className = 'fg-frame';

    var media;
    if (item.video) {
      media = document.createElement('video');
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.preload = 'none';
      media.setAttribute('muted', '');
      media.setAttribute('loop', '');
      media.setAttribute('playsinline', '');
      media.setAttribute('disablepictureinpicture', '');
      media.setAttribute('aria-hidden', 'true');
      media.tabIndex = -1;
    } else {
      media = document.createElement('img');
      media.alt = isFirst ? group.en : '';
      media.decoding = 'async';
    }
    media.className = 'fg-media';

    frame.appendChild(media);
    fig.appendChild(frame);

    return {
      el: fig,
      media: media,
      src: item.src,
      video: !!item.video,
      loaded: false,
      playing: false,
      top: 0,
      h: 0
    };
  }

  COLUMNS.forEach(function (cfg, ci) {
    var colEl = document.createElement('div');
    colEl.className = 'fg-col';
    colEl.setAttribute('role', 'group');
    colEl.style.setProperty('--fg-w', cfg.width == null ? 1 : cfg.width);
    colEl.style.setProperty('--fg-y', (cfg.offset || 0) + 'vh');

    var tiles = [];
    var names = [];

    (cfg.groups || []).forEach(function (group) {
      groupNo++;
      var no = groupNo < 10 ? '0' + groupNo : String(groupNo);

      var name = document.createElement('span');
      name.className = 'fg-name';

      var label = document.createElement('span');
      label.setAttribute('data-en', group.en);
      label.setAttribute('data-ar', group.ar || group.en);
      label.textContent = group.en;

      var num = document.createElement('i');
      num.setAttribute('aria-hidden', 'true');
      num.setAttribute('data-en', no);
      num.setAttribute('data-ar', toArabicDigits(no));
      num.textContent = no;

      name.appendChild(label);
      name.appendChild(num);
      colEl.appendChild(name);
      names.push(group.en);

      (group.items || []).forEach(function (item, ii) {
        var tile = makeTile(item, group, ii === 0);
        colEl.appendChild(tile.el);
        tiles.push(tile);
        allTiles.push(tile);
      });
    });

    colEl.setAttribute('aria-label', names.join(', '));
    track.appendChild(colEl);

    cols.push({
      el: colEl,
      tiles: tiles,
      lead: cfg.lead == null ? 0 : cfg.lead,
      index: ci,
      top: 0,
      left: 0,
      width: 0,
      travel: 0,
      riseDist: 0,
      start: 0,
      y: 0
    });
  });

  // Centre column rises first, the outer ones follow.
  var mid = (cols.length - 1) / 2;
  cols.forEach(function (c, i) {
    c.start = 0.02 + (mid > 0 ? Math.abs(i - mid) : 0) * RISE_WAVE;
  });

  /* ------------------------- Static fallback ------------------------ */
  // Reduced motion (or no scroll engine): a plain, natively scrolling strip.
  if (reduceMotion || !api || api.reduced) {
    allTiles.forEach(function (t) {
      if (t.video) {
        t.media.preload = 'metadata';
        t.media.src = t.src;
      } else {
        t.media.loading = 'lazy';
        t.media.src = t.src;
      }
    });
    return;
  }

  /* ---------------------------- Measuring ---------------------------- */
  var text = section.querySelector('.focus-text');
  var hint = gallery.querySelector('.fg-hint');
  var progressWrap = gallery.querySelector('.fg-progress');
  var progressBar = gallery.querySelector('.fg-progress-bar');

  var state = { active: false, rise: 0, hold: 0, text: 0 };
  var stageW = 1;
  var stageH = 1;
  var trackLeft = 0;   // screen x of the track's left edge at pan 0
  var overhang = 0;    // how far the wall sticks out past each edge
  var appliedHold = 0;
  var lastPan = 0;     // current sideways offset, read by the cursor hit-test

  function measure() {
    stageW = gallery.clientWidth || 1;
    stageH = gallery.clientHeight || 1;

    var trackW = track.offsetWidth;
    overhang = Math.max((trackW - stageW) / 2, 0);
    trackLeft = (stageW - trackW) / 2;

    var maxTravel = 0;
    cols.forEach(function (c) {
      c.top = c.el.offsetTop;      // includes the column's own vertical offset
      c.left = c.el.offsetLeft;
      c.width = c.el.offsetWidth;

      var last = c.tiles[c.tiles.length - 1];
      var contentBottom = last ? last.el.offsetTop + last.el.offsetHeight : 0;

      // At hold = 1 the bottom of the last tile lands on the bottom of the stage.
      c.travel = Math.max(c.top + contentBottom - stageH, 0);
      // Far enough below the stage that nothing is visible before it rises.
      c.riseDist = stageH - c.top + stageH * 0.18;

      c.tiles.forEach(function (t) {
        t.top = c.top + t.el.offsetTop;
        t.h = t.el.offsetHeight;
      });

      if (c.travel > maxTravel) maxTravel = c.travel;
    });

    syncHoldDistance(maxTravel);
  }

  // The gallery is as long as its content needs: the scroll distance is derived
  // from how far the tallest column has to travel, clamped to a sane range, so the
  // wall always moves at about TRAVEL_SPEED whatever the screen or media count.
  function syncHoldDistance(maxTravel) {
    if (stageH < 200 || maxTravel <= 0) return;   // not laid out yet
    var want = clamp(maxTravel / TRAVEL_SPEED, HOLD_MIN * stageH, HOLD_MAX * stageH);
    if (Math.abs(want - appliedHold) < stageH * 0.05) return;
    appliedHold = want;
    section.style.setProperty('--focus-hold-distance', Math.round(want) + 'px');
  }

  /* ---------------------------- Custom cursor -------------------------- */
  // The classic two-part cursor seen on agency/portfolio sites: a small dot
  // that tracks the real pointer exactly, and a larger ring that eases toward
  // it a beat behind — the lag is what reads as "premium" rather than a cursor
  // glued 1:1 to the mouse. "Over a tile" is a geometric hit-test against the
  // same layout numbers draw() uses, since every tile sits under
  // pointer-events: none and can never receive the event itself.
  var cursorDot = null;
  var cursorRing = null;
  var cursorPrimed = false;      // true once the ring has been placed at least once
  var rawX = 0, rawY = 0;        // the real pointer, in gallery-local px
  var ringX = 0, ringY = 0;      // the ring's current (eased) position

  if (canHover) {
    cursorDot = document.createElement('span');
    cursorDot.className = 'fg-cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');
    gallery.appendChild(cursorDot);

    cursorRing = document.createElement('span');
    cursorRing.className = 'fg-cursor-ring';
    cursorRing.setAttribute('aria-hidden', 'true');
    gallery.appendChild(cursorRing);
  }

  function hitTestTile(localX, localY) {
    for (var ci = 0; ci < cols.length; ci++) {
      var c = cols[ci];
      var left = trackLeft + lastPan + c.left;
      if (localX < left || localX > left + c.width) continue;

      for (var ti = 0; ti < c.tiles.length; ti++) {
        var t = c.tiles[ti];
        var top = t.top + c.y;
        if (localY >= top && localY <= top + t.h) return true;
      }
      return false;
    }
    return false;
  }

  /* ---------------------------- Mouse reveal -------------------------- */
  var pointerX = 0.5;   // where the mouse wants the wall (0..1)
  var posX = 0.5;       // eased value actually rendered
  var raf = 0;
  var lastFrame = 0;

  if (canHover) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      // Only react while the pointer is actually over the gallery. Once the stage
      // scrolls away at the end (the white section below, the footer...) the wall
      // must stay put and our custom cursor must give way to the normal one.
      var gr = gallery.getBoundingClientRect();
      var overGallery =
        e.clientX >= gr.left && e.clientX <= gr.right &&
        e.clientY >= gr.top && e.clientY <= gr.bottom;

      if (state.active && cursorDot) {
        gallery.classList.toggle('is-cursor-active', overGallery);
      }
      if (!overGallery) {
        gallery.classList.remove('is-cursor-over-tile');
        cursorPrimed = false;   // re-snap the ring when the pointer comes back
        return;
      }

      var vw = window.innerWidth || 1;
      pointerX = clamp((e.clientX / vw - 0.5) * MOUSE_GAIN + 0.5, 0, 1);

      if (cursorDot && state.active) {
        // The stage is sticky, so its screen position only settles once it's
        // actually pinned — `gr` above is read fresh on every move rather than
        // cached from measure(), same as the marquee and showcase cursors elsewhere.
        rawX = e.clientX - gr.left;
        rawY = e.clientY - gr.top;

        cursorDot.style.left = rawX + 'px';
        cursorDot.style.top = rawY + 'px';

        // First appearance: snap the ring straight to the pointer instead of
        // letting it fly in from the top-left corner.
        if (!cursorPrimed) {
          cursorPrimed = true;
          ringX = rawX;
          ringY = rawY;
          cursorRing.style.left = ringX + 'px';
          cursorRing.style.top = ringY + 'px';
        }

        gallery.classList.toggle('is-cursor-over-tile', hitTestTile(rawX, rawY));
      }

      if (state.active) wake();
    }, { passive: true });
  }

  function wake() {
    if (raf || !state.active) return;
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    raf = 0;

    var dt = clamp(now - lastFrame, 1, 64);
    lastFrame = now;

    posX += (pointerX - posX) * (1 - Math.exp(-dt / FOLLOW_MS));
    var settled = Math.abs(pointerX - posX) < 0.0006;
    if (settled) posX = pointerX;

    var ringSettled = true;
    if (cursorRing) {
      var kRing = 1 - Math.exp(-dt / CURSOR_FOLLOW_MS);
      ringX += (rawX - ringX) * kRing;
      ringY += (rawY - ringY) * kRing;
      ringSettled = Math.abs(rawX - ringX) < 0.25 && Math.abs(rawY - ringY) < 0.25;
      if (ringSettled) { ringX = rawX; ringY = rawY; }
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
    }

    draw();
    if (!settled || !ringSettled) raf = requestAnimationFrame(frame);
  }

  /* ------------------------------ Drawing ---------------------------- */
  var lastMediaTick = 0;
  var tilesParked = false;
  var immersive = false;

  // Hides the site header (and the reading bar) for the length of the gallery,
  // so the media wall owns the whole screen. See css/focus-gallery.css.
  function setImmersive(on) {
    if (on === immersive) return;
    immersive = on;
    document.documentElement.classList.toggle('is-focus-immersive', on);
  }

  function draw() {
    var r = state.rise;
    var h = state.hold;

    // The statement recedes behind the rising media instead of being cut off.
    if (text) {
      var tr = smooth(range(r, 0.12, 0.62));
      text.style.opacity = f(1 - tr);
      setT(text, 'translate3d(0,' + f(-tr * stageH * 0.05) + 'px,0) scale(' + f(1 - 0.05 * tr) + ')');
      text.style.visibility = tr >= 1 ? 'hidden' : '';
    }

    // Sideways: the mouse only takes over once the wall has (mostly) risen.
    var influence = smooth(range(r, 0.45, 1));
    var pan;
    if (canHover) {
      pan = -(posX * 2 - 1) * overhang * REVEAL_GAIN * influence;
    } else {
      // No mouse: a very slow drift across the wall, driven by the scroll itself,
      // so a touch user still travels past every column without dragging anything.
      pan = (DRIFT_START - smooth(h)) * overhang * DRIFT * influence;
    }
    pan = clamp(pan, -overhang, overhang);
    lastPan = pan;
    setT(track, 'translate3d(-50%,0,0) translate3d(' + f(pan) + 'px,0,0)');

    // Columns: rise out of the bottom, then travel up at their own speed.
    // sin() is zero at both ends of the hold phase, so the differential drift
    // never breaks the alignment of the first and last tile.
    var swell = Math.sin(Math.PI * h) * stageH * PARALLAX;
    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      var e = easeOut(range(r, c.start, c.start + RISE_DUR));
      c.y = (1 - e) * c.riseDist - h * c.travel + swell * c.lead;
      setT(c.el, 'translate3d(0,' + f(c.y) + 'px,0)');
    }

    // A small ripple on the top tiles while the wall rises; identity afterwards,
    // so the long hold phase writes nothing per tile.
    if (r < 1) {
      tilesParked = false;
      for (var ci = 0; ci < cols.length; ci++) {
        var col = cols[ci];
        var n = Math.min(TILE_LAG_COUNT, col.tiles.length);
        for (var ti = 0; ti < n; ti++) {
          var s = col.start + ti * TILE_LAG;
          var te = easeOut(range(r, s, s + RISE_DUR));
          setT(col.tiles[ti].el,
            'translate3d(0,' + f((1 - te) * stageH * 0.14) + 'px,0) scale(' + f(0.94 + 0.06 * te) + ')');
        }
      }
    } else if (!tilesParked) {
      tilesParked = true;
      for (var cj = 0; cj < cols.length; cj++) {
        var cc = cols[cj];
        var m = Math.min(TILE_LAG_COUNT, cc.tiles.length);
        for (var tj = 0; tj < m; tj++) setT(cc.tiles[tj].el, 'translate3d(0,0,0) scale(1)');
      }
    }

    // Header hides once the user has actually started scrolling into the pinned
    // stage (a touch into the white phase, before any green shows) and returns
    // just before the gallery hands off to the footer. Tied to real scroll
    // progress rather than the section merely approaching the viewport, so nothing
    // happens while still reading the content above it.
    setImmersive(state.active && (state.text > IMMERSIVE_START || r > 0 || h > 0) && h < IMMERSIVE_END);

    if (hint) {
      hint.style.opacity = f(smooth(range(r, 0.85, 1)) * (1 - smooth(range(h, 0.02, 0.12))));
    }
    if (progressWrap && progressBar) {
      progressWrap.style.opacity = f(smooth(range(r, 0.9, 1)) * (1 - smooth(range(h, 0.94, 1))));
      setT(progressBar, 'scaleX(' + Math.max(h, 0.004).toFixed(4) + ')');
    }

    updateMedia(pan, false);
  }

  /* --------------------- Loading + video playback -------------------- */
  function loadTile(t) {
    if (t.loaded) return;
    t.loaded = true;
    if (t.video) {
      if (saveData) return;
      t.media.preload = 'metadata';
      t.media.src = t.src;
    } else {
      t.media.src = t.src;
    }
  }

  function playTile(t) {
    if (t.playing || !t.loaded || saveData) return;
    t.playing = true;
    var p = t.media.play();
    if (p && p.catch) p.catch(function () {});
  }

  function pauseTile(t) {
    if (!t.playing) return;
    t.playing = false;
    t.media.pause();
  }

  var playable = [];

  function byDistance(a, b) { return a.d - b.d; }

  function updateMedia(pan, force) {
    var now = performance.now();
    if (!force && now - lastMediaTick < MEDIA_TICK_MS) return;
    lastMediaTick = now;

    var pad = stageH * PRELOAD_SCREENS;
    playable.length = 0;

    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      var left = trackLeft + pan + c.left;
      var right = left + c.width;
      var nearX = right > -stageW * 0.5 && left < stageW * 1.5;
      var onX = right > 0 && left < stageW;

      for (var j = 0; j < c.tiles.length; j++) {
        var t = c.tiles[j];
        var top = t.top + c.y;
        var bottom = top + t.h;

        if (nearX && bottom > -pad && top < stageH + pad) loadTile(t);

        if (t.video) {
          if (onX && state.active && !document.hidden && bottom > 0 && top < stageH) {
            playable.push({ t: t, d: Math.abs((top + bottom) / 2 - stageH / 2) });
          } else {
            pauseTile(t);
          }
        }
      }
    }

    playable.sort(byDistance);
    for (var k = 0; k < playable.length; k++) {
      if (k < MAX_VIDEOS) playTile(playable[k].t);
      else pauseTile(playable[k].t);
    }
  }

  function pauseAllVideos() {
    for (var i = 0; i < allTiles.length; i++) {
      if (allTiles[i].video) pauseTile(allTiles[i]);
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pauseAllVideos();
    else updateMedia(0, true);
  });

  // Warm the first tiles while the section is still a couple of screens away,
  // so the wall is never empty when it rises.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      cols.forEach(function (c) {
        for (var i = 0; i < Math.min(2, c.tiles.length); i++) loadTile(c.tiles[i]);
      });
    }, { rootMargin: '180% 0px 180% 0px' }).observe(section);
  }

  /* --------------------- Plug into the scroll engine ----------------- */
  api.register({
    measure: function () {
      measure();
      draw();
    },
    setActive: function (active) {
      state.active = active;
      if (cursorDot) {
        gallery.classList.toggle('is-cursor-active', active);
        // Hide the system pointer while our own dot + ring stand in for it.
        if (stageEl) stageEl.classList.toggle('is-cursor-hidden', active);
      }
      if (active) {
        updateMedia(0, true);
      } else {
        pauseAllVideos();
        setImmersive(false);
        cursorPrimed = false;   // re-snap the ring next time the cursor appears
        gallery.classList.remove('is-cursor-over-tile');
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }
    },
    render: function (s) {
      state.rise = s.rise;
      state.hold = s.hold;
      state.text = s.text;
      draw();
    }
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { measure(); draw(); });
  }
})();
