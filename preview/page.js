/* ============================================================================
   Studio Rowan — bespoke page behaviour.

   Everything here is written against the engine's published act geometry and
   --sc-p. The engine in ./engine/ is vendored and never edited; this file is
   where this page's own behaviour lives.

     1. The wash line   the signature move
     2. The spin        act 3's frame sequence, scrubbed, draggable
     3. The loop        the ambient clip, whose left edge is the wash line
   ========================================================================== */
(function () {
  'use strict';

  var reduce   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn     = navigator.connection || {};
  var saveData = !!conn.saveData;
  var thin     = /(^|[^a-z])(slow-2g|2g)$/.test(conn.effectiveType || '');
  /* One switch for every heavy asset on the page. Same rule for the sequence
     and the loop: reduced motion, Save-Data and a thin pipe all get the still. */
  var lite     = reduce || saveData || thin;

  var root  = document.documentElement;
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var clamp01 = function (x) { return clamp(x, 0, 1); };
  var smooth  = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };

  var sc = ScrollCraft.mount(document.body);

  /* Act progress is computed from the engine's own measured geometry rather
     than read back off --sc-p, so it stays correct outside an act's live
     window (before it is reached, and after it has been passed) and costs no
     getComputedStyle per frame. */
  var byId = {};
  sc.acts.forEach(function (a) { if (a.el.id) byId[a.el.id] = a; });

  function progress(id) {
    var a = byId[id];
    if (!a || !a.height) return 0;
    var travel = a.pinned ? (a.height - innerHeight) : (a.height + innerHeight);
    var pos    = a.pinned ? (scrollY - a.top) : (scrollY + innerHeight - a.top);
    return clamp01(pos / Math.max(travel, 1));
  }

  /* How far scroll has passed an act's top. Unlike progress(), this is still 0
     while a flow act is merely APPROACHING from below: progress() counts a flow
     act from one viewport out, which is right for its own copy and wrong for
     anything that must not begin until the reader is actually in the act. The
     loop is gated on this, because on a short viewport the flow reading put
     video behind the previous act's body text and took it to 3.3:1. */
  function entered(id) {
    var a = byId[id];
    if (!a || !a.height) return 0;
    return clamp01((scrollY - a.top) / Math.max(a.height - innerHeight, 1));
  }

  /* The engine measures act geometry on mount, on resize and once fonts are
     ready, but not when CONTENT changes height. This page has content that
     does: a counter growing from "0" to its final value can rewrap the section
     it sits in. When that happens every act below is offset from the cached
     geometry and pins engage in the wrong place. Watch the document height and
     re-measure when it moves. */
  if ('ResizeObserver' in window) {
    var lastH = document.documentElement.scrollHeight;
    var relayoutT = null;
    new ResizeObserver(function () {
      var h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      clearTimeout(relayoutT);
      relayoutT = setTimeout(function () { sc.layout(); }, 120);
    }).observe(document.body);
  }

  /* ------------------------------------------------------------------------
     1. THE WASH LINE
     The divider is the page's only chrome. It holds at the halfway mark while
     the argument is laid out, then travels left in discrete steps through the
     peak, one step per wash, each step handing the right column more of the
     screen and taking it from the left. The readout counts the real 70,000
     down as it goes.

     HONESTY: 70,000 is one hotel's disposable pairs in one year, and the
     readout depletes THAT figure. It is never a claim about pairs actually
     diverted to date, so the label never changes to imply one.
     ---------------------------------------------------------------------- */
  var WASHES = 14;            /* 70,000 / 14 = exactly 5,000 a step */
  var START  = 50;            /* the split, in % of viewport */
  var PEAK_END = 10;          /* where the stepping leaves it */

  var readoutN = document.getElementById('readout-n');
  var lastN = null, lastPct = null;

  function fmt(n) { return Math.round(n).toLocaleString('en-GB'); }

  function washFrame() {
    /* The readout counts against the HELD figures, not the story section, and
       on the same window they use (0.06 to 0.42), so the line and the column
       reach 70,000 together instead of the line arriving there first. */
    var p2 = progress('act2n');
    var p6 = progress('act6');
    var p7 = progress('act7');
    var e5 = entered('act5');

    /* Discrete: the line only ever sits on one of WASHES + 1 positions, so a
       step reads as a step and not as a slide. */
    var q   = Math.round(p6 * WASHES) / WASHES;
    var pct = START - (START - PEAK_END) * q - PEAK_END * smooth(p7);

    if (pct !== lastPct) {
      root.style.setProperty('--wash-x', pct.toFixed(3) + 'vw');
      /* The phone's boundary starts higher than the desktop divider's 50%.
         At a straight 50vh the right band is only half a short screen, and the
         peak's copy overflowed it by 51px at the start of the act, clipping the
         setup line and the last of the betters. 0.72 gives the band the room
         it needs at p=0 and still resolves to 0 at the collapse. */
      root.style.setProperty('--wash-y', (pct * 0.72).toFixed(3) + 'vh');
      lastPct = pct;
    }

    /* The readout: counts up as act 2 lands, holds, then depletes. */
    var n;
    if (p6 > 0)      n = 70000 * (1 - q);
    else             n = 70000 * smooth((p2 - 0.06) / 0.36);
    var out = fmt(n);
    if (out !== lastN) { readoutN.textContent = out; lastN = out; }

    /* The readout stands down through the mission. That act is the authored
       silence and a live counter in the middle of it is exactly the kind of
       thing that fills one. It returns for the peak, which is its act. */
    var vis = clamp01((p2 - 0.02) / 0.08);
    if (e5 > 0 && p6 === 0) vis *= 1 - smooth((e5 - 0.1) / 0.25);
    root.style.setProperty('--readout-o', vis.toFixed(3));
    root.style.setProperty('--wash-live', (p6 > 0 && p6 < 1 ? 1 : 0));

    /* The loop's presence. It arrives late in the mission so the silence there
       is not filled, comes to full through the peak, and is already whole when
       the collapse hands it the screen. */
    var o = 0;
    if (p7 > 0)      o = 1;
    else if (p6 > 0) o = 0.5 + 0.5 * clamp01(p6 / 0.25);
    else if (e5 > 0) o = 0.5 * clamp01((e5 - 0.35) / 0.4);
    root.style.setProperty('--loop-o', o.toFixed(3));
    loopLive(o > 0.02);
  }

  /* ------------------------------------------------------------------------
     2. THE SPIN  (act 3)
     87 frames, half a rotation, scrubbed by the act's progress and pushed by
     pointer drag. Never autoplays: the object is still until the reader moves.
     ---------------------------------------------------------------------- */
  var COUNT = 87;
  var TIERS = [720, 1024, 1440];

  var frame = document.getElementById('spin');
  var canvas = frame && frame.querySelector('canvas');
  var hint = document.getElementById('spin-hint');

  var spin = null;

  function pickTier() {
    var want = frame.clientWidth * Math.min(devicePixelRatio || 1, 2);
    for (var i = 0; i < TIERS.length; i++) if (TIERS[i] >= want) return TIERS[i];
    return TIERS[TIERS.length - 1];
  }

  function probe(url) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i.naturalWidth > 0); };
      i.onerror = function () { res(false); };
      i.src = url;
    });
  }

  function startSpin() {
    var tier = pickTier();
    probe('./spin/' + tier + '/f000.avif').then(function (avif) {
      var ext = avif ? 'avif' : 'webp';
      var imgs = new Array(COUNT);
      var decoded = 0;

      spin = { imgs: imgs, drawn: -1, drag: 0, vel: 0, grabbed: false, ready: false };

      /* Sequential, in order, so the reader can scrub the early part of the
         turn before the far end has arrived. A hairline rule reports it;
         never a spinner, never a percentage. */
      var i = 0;
      (function next() {
        if (i >= COUNT) { frame.classList.add('is-ready'); spin.ready = true; return; }
        var n = i++;
        var img = new Image();
        img.decoding = 'async';
        img.src = './spin/' + tier + '/f' + String(n).padStart(3, '0') + '.' + ext;
        imgs[n] = img;
        var done = function () {
          decoded++;
          frame.style.setProperty('--decoded', (decoded / COUNT).toFixed(3));
          if (decoded === 1) { frame.classList.add('is-live'); spin.drawn = -1; }
          next();
        };
        /* decode() keeps the frames as browser-managed <img>, which matters:
           87 ImageBitmaps at this size is a few hundred MB of RGBA that the
           page would then own outright. */
        if (img.decode) img.decode().then(done, done);
        else { img.onload = done; img.onerror = done; }
      })();

      bindPointer();
      bindKeys();
      if (hint) hint.textContent = matchMedia('(pointer: fine)').matches ? 'Drag to turn' : 'Scroll to turn';
    });
  }

  function drawSpin() {
    if (!spin) return;
    var p = progress('act3');
    var base = p * (COUNT - 1);
    var idx = clamp(Math.round(base + spin.drag), 0, COUNT - 1);
    if (idx === spin.drawn) return;
    var img = spin.imgs[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    var ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    spin.drawn = idx;
  }

  function bindPointer() {
    if (!matchMedia('(pointer: fine)').matches) return;
    var lastX = 0;
    frame.addEventListener('pointerdown', function (e) {
      spin.grabbed = true; lastX = e.clientX; spin.vel = 0;
      frame.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    frame.addEventListener('pointermove', function (e) {
      if (!spin.grabbed) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      /* One full width of drag is a full sweep of the sequence. */
      var d = dx / frame.clientWidth * (COUNT - 1);
      spin.drag += d; spin.vel = d;
    });
    var release = function (e) {
      if (!spin.grabbed) return;
      spin.grabbed = false;
      try { frame.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', release);
  }

  function bindKeys() {
    frame.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      spin.drag += (e.key === 'ArrowRight' ? 1 : -1);
      spin.vel = 0;
      e.preventDefault();
    });
  }

  function spinFrame() {
    if (!spin) return;
    if (!spin.grabbed) {
      /* Light inertia on release, then the drag offset eases out so scroll
         position quietly reasserts itself rather than fighting the reader. */
      spin.drag += spin.vel;
      spin.vel *= 0.90;
      if (Math.abs(spin.vel) < 0.01) spin.vel = 0;
      spin.drag *= 0.94;
      if (Math.abs(spin.drag) < 0.02) spin.drag = 0;
    }
    drawSpin();
  }

  /* ------------------------------------------------------------------------
     3. THE LOOP
     Muted, looping, silent. Never fetched at all under the lite switch: the
     poster holds the composition on its own.
     ---------------------------------------------------------------------- */
  var loopEl = document.getElementById('loopv');
  var loopArmed = false, loopPlaying = false;

  function loopLive(on) {
    if (!loopEl || lite) return;
    if (on && !loopArmed) {
      loopArmed = true;
      var mp4 = document.createElement('source');
      mp4.type = 'video/mp4'; mp4.src = './media/slide-loop.mp4';
      var webm = document.createElement('source');
      webm.type = 'video/webm'; webm.src = './media/slide-loop.webm';
      loopEl.appendChild(webm); loopEl.appendChild(mp4);
      loopEl.load();
    }
    if (!loopArmed) return;
    if (on && !loopPlaying) {
      loopPlaying = true;
      var q = loopEl.play();
      if (q && q.catch) q.catch(function () { loopPlaying = false; });
    } else if (!on && loopPlaying) {
      loopPlaying = false; loopEl.pause();
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && loopPlaying) { loopEl.pause(); loopPlaying = false; }
  });

  /* ------------------------------------------------------------------------
     The tally in act 6. Marks, not a count: the page never claims a number
     it has not sourced, so these are unlabelled and uncounted.
     ---------------------------------------------------------------------- */
  var tally = document.getElementById('tally');
  if (tally) {
    var fill = function () {
      var cols = Math.floor(tally.clientWidth / 9);
      var rows = Math.floor(tally.clientHeight / 9);
      var n = clamp(cols * rows, 0, 1600);
      if (n === tally.childElementCount) return;
      tally.textContent = '';
      var f = document.createDocumentFragment();
      for (var i = 0; i < n; i++) f.appendChild(document.createElement('i'));
      tally.appendChild(f);
    };
    fill();
    addEventListener('resize', fill, { passive: true });
  }

  /* ------------------------------------------------------------------------ */
  function tick() { washFrame(); spinFrame(); requestAnimationFrame(tick); }

  if (frame) {
    if (lite) {
      /* The still is already in the DOM and already painted. Do not fetch the
         sequence at all, and leave the frame as a plain image. */
      frame.removeAttribute('tabindex');
      if (hint) hint.textContent = '';
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io.disconnect(); startSpin(); }
      }, { rootMargin: '200% 0px' });
      io.observe(frame);
    } else {
      startSpin();
    }
  }

  requestAnimationFrame(tick);
})();
