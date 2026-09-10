/* ============================================================================
   Studio Rowan — preview 2, bespoke page behaviour.
   Chaptered editorial. Written against the engine's published act geometry;
   the engine in ./engine/ is vendored and never edited.

     1. The folio    the navigation: one line in the margin, naming the chapter
     2. The reprint  the signature move, in chapter five
     3. The spin     chapter two's media plate, the one scrub this grammar allows
     4. The loop     a small captioned plate in the peak's margin

   Assets are shared with preview 1 by relative path (../preview/spin,
   ../preview/media) rather than duplicated. If this direction is chosen, the
   assets move with it; see BUILD-NOTES.md.
   ========================================================================== */
(function () {
  'use strict';

  var reduce   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn     = navigator.connection || {};
  var saveData = !!conn.saveData;
  var thin     = /(^|[^a-z])(slow-2g|2g)$/.test(conn.effectiveType || '');
  var lite     = reduce || saveData || thin;

  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var clamp01 = function (x) { return clamp(x, 0, 1); };

  /* Mobile act types, set BEFORE mount because the engine reads them once.

     A pinned act sticks a stage one viewport tall. On a phone these spreads
     stack to well over that, so the bottom of a pinned stage is content the
     reader can never scroll to: the press tail measured 1.54:1 there, not
     because of colour but because it was pinned off-screen. Editorial pages
     want to flow on a phone anyway. The scrub chapter stays pinned, because
     pinning is how a scrub works at all. */
  if (matchMedia('(max-width: 860px)').matches) {
    ['ch1n', 'ch3', 'ch5'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('data-sc-act', 'flow');
      el.removeAttribute('data-sc-span');
    });
  }

  var sc = ScrollCraft.mount(document.body);
  var byId = {};
  sc.acts.forEach(function (a) { if (a.el.id) byId[a.el.id] = a; });

  function progress(id) {
    var a = byId[id];
    if (!a || !a.height) return 0;
    var travel = a.pinned ? (a.height - innerHeight) : (a.height + innerHeight);
    var pos    = a.pinned ? (scrollY - a.top) : (scrollY + innerHeight - a.top);
    return clamp01(pos / Math.max(travel, 1));
  }

  /* The engine measures act geometry on mount, on resize and once fonts are
     ready. It does not re-measure when CONTENT changes height, and this page
     has content that does: a counter growing from "0" to "120,000,000" rewraps
     the section it lives in. When that happens every act below it is offset
     from the geometry the engine cached, so pins engage and release in the
     wrong place. Watch the document height and re-measure when it moves. */
  if ('ResizeObserver' in window) {
    var lastH = document.documentElement.scrollHeight;
    var relayout = null;
    new ResizeObserver(function () {
      var h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      clearTimeout(relayout);
      relayout = setTimeout(function () { sc.layout(); }, 120);
    }).observe(document.body);
  }

  /* ------------------------------------------------------------------------
     1. THE FOLIO
     This grammar has no bar. One line in the margin says which chapter you are
     reading, and it is the only place either world is named: an eyebrow over a
     heading gets read as part of the headline, which is exactly the failure
     this replaces.
     ---------------------------------------------------------------------- */
  var folio = document.getElementById('folio');
  var fN = folio.querySelector('.folio__n');
  var fT = folio.querySelector('.folio__t');
  var current = null;

  function setFolio(n, t) {
    if (n === current) return;
    current = n;
    folio.classList.add('is-turning');
    setTimeout(function () {
      fN.textContent = n; fT.textContent = t;
      folio.classList.remove('is-turning');
    }, 180);
  }

  var chapters = [].slice.call(document.querySelectorAll('[data-ch]'));
  if ('IntersectionObserver' in window) {
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen.set(e.target, e.intersectionRatio); });
      // The chapter occupying the most of the screen owns the folio.
      var best = null, bestR = 0;
      seen.forEach(function (r, el) { if (r > bestR) { bestR = r; best = el; } });
      if (best) setFolio(best.getAttribute('data-ch'), best.getAttribute('data-ch-t'));
      // The colophon is Olive; the folio has to change ink with it.
      folio.classList.toggle('on-dark', !!(best && best.classList.contains('page--colophon')));
    }, { threshold: [0, 0.15, 0.35, 0.6, 0.9] });
    chapters.forEach(function (c) { io.observe(c); });
  }

  /* ------------------------------------------------------------------------
     2. THE REPRINT  (chapter five, the peak)
     The chapter prints itself again, and again. Each impression is set smaller
     and tighter than the last and stepped across the sheet, so the repetitions
     stack like proofs coming off a press. The smallest ones stop being
     readable and become texture, which is the argument: one pair, over and
     over, until the repetition is the whole page.

     Impressions are real elements, created once and revealed by scroll. No
     crossfade anywhere: this grammar cuts.
     ---------------------------------------------------------------------- */
  var IMPRESSIONS = 30;
  var stack = document.getElementById('stack');
  var counter = document.getElementById('impression');
  var marks = [];
  var lastShown = -1;

  function buildStack() {
    if (!stack) return;
    var frag = document.createDocumentFragment();
    /* Impression one is real markup in the page (.press__first), so the
       generated run starts at two and continues its cascade exactly. */
    var ratio = 0.87;
    var size = 9.4 * ratio;
    for (var i = 1; i < IMPRESSIONS; i++) {
      var b = document.createElement('b');
      b.textContent = 'And again.';
      b.style.fontSize = Math.max(size, 0.85) + 'vh';
      /* Stepped across the sheet so the stack cascades rather than aligning
         into a column, which would read as a list instead of a print run. */
      b.style.transform = 'translateX(' + (i * 0.9) + 'ch)';
      b.style.opacity = '0';
      b.style.color = i < 3 ? 'var(--onyx)'
                    : 'color-mix(in oklab, var(--onyx) ' + Math.max(38, 100 - i * 2.2) + '%, transparent)';
      b.style.transition = 'opacity 260ms var(--sc-ease-out)';
      frag.appendChild(b);
      marks.push(b);
      size *= ratio;
    }
    stack.appendChild(frag);
  }

  function printFrame() {
    if (!marks.length) return;
    var p = progress('ch5');
    /* Front-loaded: the run is complete well before the chapter ends, so the
       tail copy has a settled block to sit against rather than a moving one. */
    /* marks holds impressions two upward; impression one is always printed,
       so the readout is marks-shown + 1 and matches what is on screen. */
    var n = Math.round(clamp01(p / 0.78) * marks.length);
    if (n === lastShown) return;
    for (var i = 0; i < marks.length; i++) {
      marks[i].style.opacity = i < n ? '1' : '0';
    }
    if (counter) counter.textContent = String(n + 1);
    lastShown = n;
  }

  /* ------------------------------------------------------------------------
     3. THE SPIN  (chapter two)
     ---------------------------------------------------------------------- */
  var COUNT = 87;
  var TIERS = [720, 1024, 1440];
  var BASE = '../preview/spin/';

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
    probe(BASE + tier + '/f000.avif').then(function (avif) {
      var ext = avif ? 'avif' : 'webp';
      var imgs = new Array(COUNT), decoded = 0;
      spin = { imgs: imgs, drawn: -1, drag: 0, vel: 0, grabbed: false };
      var i = 0;
      (function next() {
        if (i >= COUNT) { frame.classList.add('is-ready'); return; }
        var n = i++;
        var img = new Image();
        img.decoding = 'async';
        img.src = BASE + tier + '/f' + String(n).padStart(3, '0') + '.' + ext;
        imgs[n] = img;
        var done = function () {
          decoded++;
          frame.style.setProperty('--decoded', (decoded / COUNT).toFixed(3));
          if (decoded === 1) { frame.classList.add('is-live'); spin.drawn = -1; }
          next();
        };
        if (img.decode) img.decode().then(done, done); else { img.onload = done; img.onerror = done; }
      })();
      bindPointer(); bindKeys();
      if (hint) hint.textContent = matchMedia('(pointer: fine)').matches ? 'drag to turn' : 'scroll to turn';
    });
  }

  function drawSpin() {
    if (!spin) return;
    var idx = clamp(Math.round(progress('ch2') * (COUNT - 1) + spin.drag), 0, COUNT - 1);
    if (idx === spin.drawn) return;
    var img = spin.imgs[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, canvas.width, canvas.height);
    spin.drawn = idx;
  }

  function bindPointer() {
    if (!matchMedia('(pointer: fine)').matches) return;
    var lastX = 0;
    frame.addEventListener('pointerdown', function (e) {
      spin.grabbed = true; lastX = e.clientX; spin.vel = 0;
      frame.setPointerCapture(e.pointerId); e.preventDefault();
    });
    frame.addEventListener('pointermove', function (e) {
      if (!spin.grabbed) return;
      var d = (e.clientX - lastX) / frame.clientWidth * (COUNT - 1);
      lastX = e.clientX; spin.drag += d; spin.vel = d;
    });
    var rel = function (e) {
      if (!spin.grabbed) return;
      spin.grabbed = false;
      try { frame.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    frame.addEventListener('pointerup', rel);
    frame.addEventListener('pointercancel', rel);
  }
  function bindKeys() {
    frame.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      spin.drag += (e.key === 'ArrowRight' ? 1 : -1); spin.vel = 0; e.preventDefault();
    });
  }
  function spinFrame() {
    if (!spin) return;
    if (!spin.grabbed) {
      spin.drag += spin.vel; spin.vel *= 0.90;
      if (Math.abs(spin.vel) < 0.01) spin.vel = 0;
      spin.drag *= 0.94;
      if (Math.abs(spin.drag) < 0.02) spin.drag = 0;
    }
    drawSpin();
  }

  /* ------------------------------------------------------------------------
     4. THE LOOP
     A small captioned plate in the peak's margin. It never goes full-bleed:
     this grammar keeps media in its own column, which is the clearest single
     difference from preview 1's ending.
     ---------------------------------------------------------------------- */
  var loopEl = document.getElementById('loopv');
  var armed = false, playing = false;

  function loopLive(on) {
    if (!loopEl || lite) return;
    if (on && !armed) {
      armed = true;
      var webm = document.createElement('source');
      webm.type = 'video/webm'; webm.src = '../preview/media/slide-loop.webm';
      var mp4 = document.createElement('source');
      mp4.type = 'video/mp4'; mp4.src = '../preview/media/slide-loop.mp4';
      loopEl.appendChild(webm); loopEl.appendChild(mp4);
      loopEl.load();
    }
    if (!armed) return;
    if (on && !playing) {
      playing = true;
      var q = loopEl.play();
      if (q && q.catch) q.catch(function () { playing = false; });
    } else if (!on && playing) { playing = false; loopEl.pause(); }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && playing) { loopEl.pause(); playing = false; }
  });

  if (loopEl && !lite && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { loopLive(en[0].isIntersecting); },
      { rootMargin: '20% 0px' }).observe(loopEl);
  }

  /* ------------------------------------------------------------------------ */
  buildStack();

  function tick() { printFrame(); spinFrame(); requestAnimationFrame(tick); }

  if (frame) {
    if (lite) {
      frame.removeAttribute('tabindex');
      if (hint) hint.textContent = 'shown as a still';
    } else if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io2.disconnect(); startSpin(); }
      }, { rootMargin: '200% 0px' });
      io2.observe(frame);
    } else { startSpin(); }
  }

  requestAnimationFrame(tick);
})();
