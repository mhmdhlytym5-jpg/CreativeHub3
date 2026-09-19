/*
 * Card stack — adds the state classes that css/card-stack.css animates. Nothing else.
 *
 *   is-ready    JS is running (cards wait, piled up and faded)
 *   is-in       the stack has scrolled into view -> cards fan out (once)
 *   is-settled  the entrance is over -> stagger dropped, the front card starts floating
 *   is-visible  the stack is near the screen (used to hold GPU layers only while needed)
 *   is-spread   touch devices only: while the stack is mostly on screen it stays a little
 *               more open, and a tap toggles it — there is no hover on a phone
 *
 * Works on any number of [data-card-stack] elements. Reduced motion: no listeners at all,
 * the CSS shows the finished layout.
 */
(function () {
  'use strict';

  var stacks = document.querySelectorAll('[data-card-stack]');
  if (!stacks.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var SETTLE_MS = 1500;      // entrance stagger + travel, then the float may start

  function init(stack) {
    stack.classList.add('is-ready');

    var entered = false;

    function enter() {
      if (entered) return;
      entered = true;
      stack.classList.add('is-in');
      setTimeout(function () { stack.classList.add('is-settled'); }, SETTLE_MS);
    }

    if (!('IntersectionObserver' in window)) {
      enter();
      return;
    }

    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      stack.classList.toggle('is-visible', e.isIntersecting);
      if (e.intersectionRatio >= 0.3) enter();
      if (coarse && entered) stack.classList.toggle('is-spread', e.intersectionRatio >= 0.65);
    }, { threshold: [0, 0.3, 0.65], rootMargin: '0px 0px -6% 0px' }).observe(stack);

    if (coarse) {
      stack.addEventListener('click', function () {
        if (entered) stack.classList.toggle('is-spread');
      });
    }
  }

  Array.prototype.forEach.call(stacks, init);
})();
