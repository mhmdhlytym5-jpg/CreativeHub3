(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  var GRAVITY = 2600;                 

  var FLOOR_RESTITUTION = 0.56;       
  var FLOOR_RESTITUTION_DECAY = 0.90; 
  var FLOOR_FRICTION_COEF = 0.22;     
  var BOUNCE_MIN_IMPACT_SPEED = 46;   

  var BALL_RESTITUTION = 0.45;
  // Kept low on purpose: with real friction, any resting angle up to
  // arctan(BALL_FRICTION) from vertical can balance indefinitely. A low
  // value keeps that "stable cone" narrow, so a ball resting on just one
  // other ball with any visible tilt slides/rolls off instead of freezing
  // there — it only truly settles once it's properly nested between two
  // balls (or lands on the floor), which is what a real pile looks like.
  var BALL_FRICTION = 0.05;

  var WALL_RESTITUTION = 0.3;         

  var MIN_REST_SPEED = 8;
  // Speeds between MIN_REST_SPEED and this are treated as solver noise, not
  // a real disturbance: the settle timer bleeds down instead of resetting to
  // zero, so one noisy substep in a tall stack can't keep a ball awake
  // forever. Only a speed above this counts as a genuine bump.
  var SETTLE_DISTURB_SPEED = 30;
  // Use elapsed simulation time for sleeping.  Counting display frames made
  // resting behaviour depend on the monitor refresh rate.
  var SETTLE_TIME_NEEDED = 0.28;
  // Once a ball is already almost at rest, bleed off a little extra
  // velocity every step. This soaks up the small residual speed the
  // iterative solver leaves behind on 3-4 ball stacks so it actually
  // reaches zero instead of hovering just above the sleep threshold and
  // being read as a jitter. Kept tight and gentle on purpose: it must only
  // touch balls that are already basically settling, not normal rolling —
  // otherwise it saps momentum from every ball and everything feels heavy.
  var REST_DAMPING_ZONE = 16;
  var REST_DAMPING = 0.97;

  // A fixed physics step plus several solver passes makes a stack converge
  // before the next visible frame.  This is the important part that prevents
  // two touching balls from continuously correcting one another.
  var FIXED_TIMESTEP = 1 / 120;
  var MAX_SUBSTEPS = 6;
  // 10 Gauss-Seidel passes so a 3-4 ball chain (each contact only fully
  // agrees with its neighbor once per pass) actually converges within one
  // fixed step instead of carrying leftover velocity into the next one.
  var SOLVER_ITERATIONS = 10;
  var POSITION_CORRECTION_PERCENT = 0.82;

  // Below this closing speed, a ball-ball contact is treated as resting
  // contact (no bounce, no wake-up) instead of a real collision. Set safely
  // above the max single-frame gravity gain (GRAVITY * max dt) so genuine
  // resting stacks are never mistaken for an impact, even on a slow frame.
  var BALL_REST_IMPACT_SPEED = 90;
  // Allowed harmless overlap between two balls before we bother correcting
  // position for it — avoids fighting over fractions of a pixel every frame.
  var BALL_SLOP = 0.6;
  // Velocity magnitudes below this are numerical noise — snap to exactly 0.
  var VELOCITY_EPSILON = 2;

  // Two balls landing dead-center on top of one another have a purely
  // vertical contact normal — a knife-edge equilibrium that, with no
  // horizontal nudge, can balance forever and produce an unnaturally
  // perfect straight tower. Below this horizontal gap the pair is treated
  // as "nearly vertical" and nudged apart using each ball's own small,
  // fixed lean (assigned once at creation) so stacks settle with a
  // natural, stable offset instead of a razor-straight column.
  var BALL_LEAN_EPS = 1.5;
  var BALL_LEAN_RANGE = 0.8;

  var HIDDEN_MARGIN = 24;             
  var FLOOR_GAP = 6;                  

  var MAX_BALLS = 25;                 // absolute hard cap on balls in the stage

  function initLogoFall() {
    var stage = document.getElementById('logoFallStage');
    if (!stage) return;

    var ballEls = Array.prototype.slice.call(stage.querySelectorAll('.logo-fall-circle'));
    if (!ballEls.length) return;
    if (ballEls.length > MAX_BALLS) ballEls = ballEls.slice(0, MAX_BALLS);

    function stageSize() {
      var r = stage.getBoundingClientRect();
      return { width: r.width, height: r.height };
    }

    
    function buildBalls() {
      var size = stageSize();
      return ballEls.map(function (el) {
        var radius = (el.offsetWidth || 0) / 2;
        var startXPct = parseFloat(el.getAttribute('data-start-x')) || 50;
        var delay = parseFloat(el.getAttribute('data-delay')) || 0;
        var startYOffset = parseFloat(el.getAttribute('data-start-y')) || 0;
        var mass = Math.max(radius * radius, 1); 

        return {
          el: el,
          radius: radius,
          mass: mass,
          x: (startXPct / 100) * size.width,
          y: -(radius + HIDDEN_MARGIN + startYOffset),
          vx: 0,
          vy: 0,
          angle: 0,
          restitution: FLOOR_RESTITUTION,
          grounded: false,
          delay: delay,
          released: false,
          settleStreak: 0,
          asleep: false,
          lean: (Math.random() - 0.5) * BALL_LEAN_RANGE
        };
      });
    }

    function renderStatic(balls, floorY) {
      balls.forEach(function (b) {
        b.y = floorY - b.radius;
        b.el.style.left = b.x.toFixed(2) + 'px';
        b.el.style.top = b.y.toFixed(2) + 'px';
        b.el.style.transform = 'translate(-50%, -50%)';
      });
    }

    
    function createBallNode() {
      var el = ballEls[0].cloneNode(true);
      el.removeAttribute('data-start-x');
      el.removeAttribute('data-delay');
      el.removeAttribute('data-start-y');
      stage.appendChild(el);
      return el;
    }

    
    function getStageClickPoint(e) {
      var rect = stage.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x: x, y: y };
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      var balls0 = buildBalls();
      var ballCount0 = balls0.length;
      var size0 = stageSize();
      var floorY0 = Math.max(size0.height - FLOOR_GAP, 1);
      renderStatic(balls0, floorY0);

      
      stage.addEventListener('click', function (e) {
        if (ballCount0 >= MAX_BALLS) return;

        var point = getStageClickPoint(e);
        if (!point) return;

        ballCount0++;
        var el = createBallNode();
        var radius = (el.offsetWidth || 0) / 2;
        var size = stageSize();
        var floorY = Math.max(size.height - FLOOR_GAP, 1);

        el.style.left = point.x.toFixed(2) + 'px';
        el.style.top = (floorY - radius).toFixed(2) + 'px';
        el.style.transform = 'translate(-50%, -50%)';
      });

      return;
    }

    var balls = buildBalls();

    
    balls.forEach(function (b) {
      b.el.style.left = b.x.toFixed(2) + 'px';
      b.el.style.top = b.y.toFixed(2) + 'px';
      b.el.style.transform = 'translate(-50%, -50%)';
    });

    var loopRunning = false;
    var startTime = null;
    var lastTime = null;
    var accumulator = 0;

    function constrainToStage(b, size, floorY, allowBounce, dt) {
      if (b.y + b.radius > floorY) {
        b.y = floorY - b.radius;
        if (allowBounce && b.vy > BOUNCE_MIN_IMPACT_SPEED) {
          b.vy = -b.vy * b.restitution;
          b.restitution *= FLOOR_RESTITUTION_DECAY;
          b.grounded = false;
        } else {
          if (b.vy > 0) b.vy = 0;
          b.grounded = true;
        }

        if (allowBounce) {
          var frictionDecel = FLOOR_FRICTION_COEF * GRAVITY * dt;
          if (Math.abs(b.vx) <= frictionDecel) b.vx = 0;
          else b.vx -= Math.sign(b.vx) * frictionDecel;
        }
      } else {
        b.grounded = false;
      }

      if (b.x - b.radius < 0) {
        b.x = b.radius;
        if (allowBounce && b.vx < 0) b.vx = -b.vx * WALL_RESTITUTION;
        else if (!allowBounce && b.vx < 0) b.vx = 0;
      } else if (b.x + b.radius > size.width) {
        b.x = size.width - b.radius;
        if (allowBounce && b.vx > 0) b.vx = -b.vx * WALL_RESTITUTION;
        else if (!allowBounce && b.vx > 0) b.vx = 0;
      }
    }

    function solveBallPair(a, b) {
      if (!a.released || !b.released || (a.asleep && b.asleep)) return;

      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var minDist = a.radius + b.radius;
      var distSq = dx * dx + dy * dy;
      if (distSq >= minDist * minDist) return;

      var dist = Math.sqrt(distSq);
      if (dist < 0.0001) {
        dx = a.radius <= b.radius ? 0.0001 : -0.0001;
        dy = 0;
        dist = 0.0001;
      } else if (Math.abs(dx) < BALL_LEAN_EPS) {
        dx = (a.lean - b.lean) || (a.radius <= b.radius ? 0.05 : -0.05);
        dist = Math.sqrt(dx * dx + dy * dy);
      }
      var nx = dx / dist;
      var ny = dy / dist;
      var rvx = b.vx - a.vx;
      var rvy = b.vy - a.vy;
      var closingSpeed = -(rvx * nx + rvy * ny);

      // A resting contact must not wake a sleeping ball.  It only wakes for a
      // genuine impact, which prevents gravity from restarting a settled stack.
      if (closingSpeed > BALL_REST_IMPACT_SPEED) {
        if (a.asleep) { a.asleep = false; a.settleStreak = 0; }
        if (b.asleep) { b.asleep = false; b.settleStreak = 0; }
      }

      var invMassA = a.asleep ? 0 : 1 / a.mass;
      var invMassB = b.asleep ? 0 : 1 / b.mass;
      var totalInvMass = invMassA + invMassB;
      if (!totalInvMass) return;

      var correctable = minDist - dist - BALL_SLOP;
      if (correctable > 0) {
        var correction = correctable * POSITION_CORRECTION_PERCENT / totalInvMass;
        a.x -= correction * invMassA * nx;
        a.y -= correction * invMassA * ny;
        b.x += correction * invMassB * nx;
        b.y += correction * invMassB * ny;
      }

      // Resolve velocity independently from positional correction.  This is
      // what stops correction from injecting a tiny new bounce every frame.
      rvx = b.vx - a.vx;
      rvy = b.vy - a.vy;
      var velAlongNormal = rvx * nx + rvy * ny;
      if (velAlongNormal >= 0) return;

      var restitution = closingSpeed > BALL_REST_IMPACT_SPEED ? BALL_RESTITUTION : 0;
      var normalImpulse = -(1 + restitution) * velAlongNormal / totalInvMass;
      var ix = normalImpulse * nx;
      var iy = normalImpulse * ny;
      a.vx -= ix * invMassA;
      a.vy -= iy * invMassA;
      b.vx += ix * invMassB;
      b.vy += iy * invMassB;

      var tx = -ny;
      var ty = nx;
      var tangentSpeed = rvx * tx + rvy * ty;
      var wantedFriction = -tangentSpeed / totalInvMass;
      var maxFriction = Math.abs(normalImpulse) * BALL_FRICTION;
      var frictionImpulse = Math.abs(wantedFriction) < maxFriction
        ? wantedFriction
        : -Math.sign(tangentSpeed) * maxFriction;
      a.vx -= frictionImpulse * tx * invMassA;
      a.vy -= frictionImpulse * ty * invMassA;
      b.vx += frictionImpulse * tx * invMassB;
      b.vy += frictionImpulse * ty * invMassB;
    }

    function simulate(dt, size, floorY) {
      var i;
      var j;
      balls.forEach(function (b) {
        if (!b.released || b.asleep) return;
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        constrainToStage(b, size, floorY, true, dt);
      });

      // Several small solver passes settle a vertical stack in the same fixed
      // step, rather than waiting for the next visible frame to fix it again.
      for (var pass = 0; pass < SOLVER_ITERATIONS; pass++) {
        for (i = 0; i < balls.length; i++) {
          for (j = i + 1; j < balls.length; j++) solveBallPair(balls[i], balls[j]);
        }
        balls.forEach(function (b) {
          if (b.released && !b.asleep) constrainToStage(b, size, floorY, false, dt);
        });
      }

      balls.forEach(function (b) {
        if (!b.released || b.asleep) return;
        if (Math.abs(b.vx) < VELOCITY_EPSILON) b.vx = 0;
        if (Math.abs(b.vy) < VELOCITY_EPSILON) b.vy = 0;

        var speed = Math.abs(b.vx) + Math.abs(b.vy);

        // Already slow (settling in a stack) — damp the residual solver
        // noise a bit further so it actually decays to zero.
        if (speed > 0 && speed < REST_DAMPING_ZONE) {
          b.vx *= REST_DAMPING;
          b.vy *= REST_DAMPING;
          speed = Math.abs(b.vx) + Math.abs(b.vy);
        }

        if (speed < MIN_REST_SPEED) {
          b.settleStreak += dt;
        } else if (speed < SETTLE_DISTURB_SPEED) {
          // Not a real hit, just noise — bleed the streak instead of
          // wiping it out.
          b.settleStreak = Math.max(0, b.settleStreak - dt);
        } else {
          b.settleStreak = 0;
        }

        if (b.settleStreak >= SETTLE_TIME_NEEDED) {
          b.asleep = true;
          b.vx = 0;
          b.vy = 0;
        } else {
          b.angle += (b.vx / b.radius) * dt;
        }
      });
    }

    function renderBalls() {
      balls.forEach(function (b) {
        if (!b.released) return;
        b.el.style.left = b.x.toFixed(2) + 'px';
        b.el.style.top = b.y.toFixed(2) + 'px';
        b.el.style.transform =
          'translate(-50%, -50%) rotate(' + (b.angle * 180 / Math.PI).toFixed(1) + 'deg)';
      });
    }

    function step(now) {
      if (startTime === null) startTime = now;
      if (lastTime === null) lastTime = now;
      var frameDt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      accumulator += frameDt;

      var elapsed = now - startTime;
      balls.forEach(function (b) {
        if (!b.released && elapsed >= b.delay) b.released = true;
      });

      var size = stageSize();
      var floorY = Math.max(size.height - FLOOR_GAP, 1);
      var substeps = 0;
      while (accumulator >= FIXED_TIMESTEP && substeps < MAX_SUBSTEPS) {
        simulate(FIXED_TIMESTEP, size, floorY);
        accumulator -= FIXED_TIMESTEP;
        substeps++;
      }
      if (substeps === MAX_SUBSTEPS) accumulator = 0;
      renderBalls();

      var anyActive = balls.some(function (b) { return !b.released || !b.asleep; });
      if (anyActive) requestAnimationFrame(step);
      else { loopRunning = false; accumulator = 0; }
    }

    
    function ensureRunning() {
      if (loopRunning) return;
      loopRunning = true;
      lastTime = null;
      requestAnimationFrame(step);
    }

    
    window.addEventListener('resize', function onResize() {
      var allReleasedAndSlow = balls.every(function (b) {
        return b.released && Math.abs(b.vx) + Math.abs(b.vy) < MIN_REST_SPEED;
      });
      if (!allReleasedAndSlow) return;

      var size = stageSize();
      var floorY = Math.max(size.height - FLOOR_GAP, 1);
      balls.forEach(function (b) {
        b.y = floorY - b.radius;
        if (b.x + b.radius > size.width) b.x = size.width - b.radius;
        if (b.x - b.radius < 0) b.x = b.radius;
        b.el.style.left = b.x.toFixed(2) + 'px';
        b.el.style.top = b.y.toFixed(2) + 'px';
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          ensureRunning();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(stage);

    
    stage.addEventListener('click', function (e) {
      var point = getStageClickPoint(e);
      if (!point) return;
      if (balls.length >= MAX_BALLS) return;

      var el = createBallNode();
      var radius = (el.offsetWidth || 0) / 2;
      var mass = Math.max(radius * radius, 1);

      el.style.left = point.x.toFixed(2) + 'px';
      el.style.top = point.y.toFixed(2) + 'px';
      el.style.transform = 'translate(-50%, -50%)';

      balls.push({
        el: el,
        radius: radius,
        mass: mass,
        x: point.x,
        y: point.y,
        vx: 0,
        vy: 0,
        angle: 0,
        restitution: FLOOR_RESTITUTION,
        grounded: false,
        delay: 0,
        released: true,
        settleStreak: 0,
        asleep: false,
        lean: (Math.random() - 0.5) * BALL_LEAN_RANGE
      });

      ensureRunning();
    });
  }

  document.addEventListener('DOMContentLoaded', initLogoFall);
})();
