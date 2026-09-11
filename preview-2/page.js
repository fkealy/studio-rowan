/* ============================================================================
   Studio Rowan — preview 2, bespoke page behaviour.
   Chaptered editorial. Written against the engine's published act geometry;
   the engine in ./engine/ is vendored and never edited.

     1. The folio    the navigation: one line in the margin, naming the chapter
     2. The reprint  the signature move, in chapter five
     3. The spin     chapter two's media plate, the one scrub this grammar allows
     4. The loop     a small captioned plate in the peak's margin

   Assets are local: ./spin and ./media. This build is self-contained and can be
   moved, deployed or deleted without touching /preview/. They were shared with
   preview 1 by relative path until that became the only thing coupling the two
   proposals together; see BUILD-NOTES.md.
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

  /* ------------------------------------------------------------------------
     ACT TYPES

     A pinned act sticks a stage exactly one viewport tall, and that stage
     CLIPS. So a spread taller than the stage is copy nobody can scroll to, and
     whether a chapter may be pinned is one question asked two ways:

       1. Is it on the phone list? Chapters three, four and five stack to well
          over a viewport on any phone, and an editorial page wants to flow
          there anyway. (Chapter one is not on the list - it carries head, story
          and both figures now, so it is a measurement, not a guess.)
       2. Does its spread fit the stage? Measured, at any width.

     ch2, the scrub chapter, is included and used to be exempt on the reasoning
     that pinning is how a scrub works at all. True of the ENGINE's scrub
     device; not true of this page, which has no [data-sc-scrub] or
     [data-sc-sequence] in the markup at all - the spin is drawn by hand off
     progress('ch2'), and progress() computes a flow act's p as readily as a
     pinned one. The act type was buying the pin and nothing else, and at
     375x667 the pin cost 133px of clipped copy.

     THE STAGE IS NOT innerHeight. The engine sizes it `height: 100vh; height:
     100svh`. On a phone innerHeight is the LARGE viewport - the one you get
     with the browser chrome hidden - and 100svh is the small one, so measuring
     against innerHeight overestimates the stage by about the height of an
     address bar and lets that much content clip. Measured in an emulated
     375x667 the two read 806 and 667. The smaller of the pair is the
     conservative read, and conservative is the right direction: a chapter
     flowed that could have been pinned loses a full stop, a chapter pinned that
     does not fit loses copy behind `overflow: clip`.

     This is re-decided ON RESIZE, and that is a fix rather than a refinement.
     It used to run once, with a note saying a window resized after load keeps
     the act it was given. That is not a caveat, it is broken content: load at
     1440x900 and drag the window to 478 wide and chapter three stayed pinned
     with a sticky, clipping 850px stage over 1069px of spread - the claims cut
     off mid-list and the summary reduced to one sliced line with the next
     chapter painted over the rest of it.

     Re-deciding means touching engine state, because the engine reads the act
     type once at mount too: the act object's `pinned` is what its layout uses
     to decide whether to set the section's height, and its update loop uses to
     choose the pinned or the flow progress formula. `sc.acts` is published, so
     these flip it there rather than editing the vendored engine.
     ---------------------------------------------------------------------- */
  /* turn1 and turn2 are the two held beats between chapters one and two. They
     carry one line each and fit any stage, so they are never demoted in
     practice - they are in the list because the list is the page's only answer
     to "may this be pinned?", and a section that is exempt from it is a section
     nobody is checking. */
  var MUTABLE    = ['ch1s', 'turn1', 'turn2', 'ch2', 'ch3', 'ch4', 'ch5'];
  var PHONE_FLOW = ['ch3', 'ch4', 'ch5'];

  /* Declared before the first unpin() call, not with the mount below: `var` is
     hoisted as undefined, and unpin() indexes it. */
  var byId = {};

  /* The authored configuration, captured before anything demotes it, so a
     promotion has something to restore. */
  var authored = {};
  MUTABLE.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    authored[id] = {
      el: el,
      device: el.getAttribute('data-sc-act') || 'flow',
      span: el.getAttribute('data-sc-span'),
      dwell: el.getAttribute('data-sc-dwell')
    };
  });

  function stageVh() {
    return Math.min(innerHeight, document.documentElement.clientHeight);
  }

  /* Measured in whatever state the section is currently in, which works both
     ways round: pinned, the spread is height:100% of the stage and scrollHeight
     reports the overflow past it; flowed, scrollHeight is simply the content.
     Either way the number is "how tall this chapter wants to be". */
  function fits(id) {
    var a = authored[id];
    if (!a || a.device === 'flow') return true;
    if (PHONE_FLOW.indexOf(id) !== -1 && matchMedia('(max-width: 860px)').matches) return false;
    var inner = a.el.querySelector('[data-sc-stage] > *');
    if (!inner) return true;
    return inner.scrollHeight <= stageVh();
  }

  /* The .is-unpinned class is what the stylesheet keys off: a section that is
     no longer pinned needs its vertical padding back and its spread has to stop
     claiming a stage's height, and neither follows from the act attribute alone
     once .press has overridden the padding rule. The rest undoes what the
     engine did at mount. */
  function unpin(id) {
    var a = authored[id];
    if (!a || a.el.getAttribute('data-sc-act') === 'flow') return;
    var el = a.el;
    el.setAttribute('data-sc-act', 'flow');
    el.removeAttribute('data-sc-span');
    /* Meaningless on a flow act, and left behind it would be a lie about what
       the section does. */
    el.removeAttribute('data-sc-dwell');
    el.classList.add('is-unpinned');
    el.classList.remove('sc-act--pinned');
    var stage = el.querySelector('[data-sc-stage]');
    if (stage) stage.classList.remove('sc-stage');
    el.style.height = '';
    var act = byId[id];
    if (act) { act.pinned = false; act.device = 'flow'; act.span = 0; }
  }

  function repin(id) {
    var a = authored[id];
    if (!a || a.device === 'flow') return;
    var el = a.el;
    if (el.getAttribute('data-sc-act') === a.device) return;
    el.setAttribute('data-sc-act', a.device);
    if (a.span) el.setAttribute('data-sc-span', a.span);
    if (a.dwell) el.setAttribute('data-sc-dwell', a.dwell);
    el.classList.remove('is-unpinned');
    el.classList.add('sc-act--pinned');
    var stage = el.querySelector('[data-sc-stage]');
    if (stage) stage.classList.add('sc-stage');
    var act = byId[id];
    if (act) {
      act.pinned = true;
      act.device = a.device;
      act.span = parseFloat(a.span) || 1.5;
      act.stage = stage;
    }
  }

  /* Restore everything to its authored state first, then demote what does not
     fit, so the measurement is always taken against the composition the page is
     written for. Measured in the flowed state it would be ~80px short - a
     flowed spread has had its block padding removed - and chapters would be
     promoted straight back into clipping.

     Both passes run inside one task, so nothing paints between them. */
  function decideActs() {
    MUTABLE.forEach(repin);
    void document.body.offsetHeight;
    MUTABLE.forEach(function (id) { if (!fits(id)) unpin(id); });
  }

  /* The press's state, declared up here rather than with the rest of section 2
     below, because buildStack() runs before the guard and a `var` assigned
     later is hoisted as undefined: called early against the original ordering
     it hit `if (!stack) return` and silently built nothing. */
  var IMPRESSIONS = 30;
  var stack = document.getElementById('stack');
  var counter = document.getElementById('impression');
  var marks = [];
  var lastShown = -1;

  /* The press builds its impressions here, BEFORE the stage-fit guard below and
     before mount, because both measure this spread and an empty stack is not
     the spread. Measured with the stack empty the peak reads ~895px and looks
     like it fits a 900px stage; built, it is 922px and clips its own closing
     lines by 11px top and bottom. buildStack touches no engine state, so it is
     free to run this early. */
  buildStack();

  /* The first decision, before mount, while the engine still reads the
     attributes. */
  decideActs();

  var sc = ScrollCraft.mount(document.body);
  sc.acts.forEach(function (a) { if (a.el.id) byId[a.el.id] = a; });

  /* And again on resize. Debounced, because a drag fires this continuously and
     every pass re-measures five chapters. */
  var reflow = null;
  addEventListener('resize', function () {
    clearTimeout(reflow);
    reflow = setTimeout(function () { decideActs(); sc.layout(); }, 180);
  }, { passive: true });

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
  /* The standing ask's state, declared here rather than with the rest of
     section 5, because the folio's observer below reaches into it and a `var`
     assigned later in the body is hoisted as undefined. It is the same reason
     the press's state is declared early. */
  var ask = document.getElementById('ask');
  var onColophon = false;
  var askShown = null;
  var folio = document.getElementById('folio');
  var fN = folio.querySelector('.folio__n');
  var fT = folio.querySelector('.folio__t');
  var current = null;

  /* Keyed on the pair, not on the label alone. The labels stopped being unique
     when they stopped being ordinals: the title page and the colophon both
     carry an empty one, because neither is a step in the argument and neither
     takes a label on the page either. Keyed on the label, the colophon would
     have inherited whatever the title page left in the folio. */
  function setFolio(n, t) {
    var key = n + '|' + t;
    if (key === current) return;
    current = key;
    folio.classList.add('is-turning');
    setTimeout(function () {
      fN.textContent = n; fT.textContent = t;
      /* The label's separator rule is drawn on the label itself, so an empty
         label has to take the rule with it rather than leave a hairline
         floating in front of the title. */
      folio.classList.toggle('is-unlabelled', !n);
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
      // The colophon is Olive; the folio changes ink with it.
      var dark = !!(best && best.classList.contains('page--colophon'));
      folio.classList.toggle('on-dark', dark);
      /* The standing ask retires when the real one arrives: on the colophon
         both asks are set in the running text a few lines below it, and a pill
         floating over them is the page asking twice. Ink is switched as well,
         for the frames where olive is on screen but has not won yet. */
      if (ask) {
        ask.classList.toggle('on-dark', dark);
        onColophon = dark;
        syncAsk();
      }
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
    /* marks holds impressions two upward; impression one is the cued .press__first
       in the markup, so the readout is marks-shown + 1 and matches what is on
       screen. The cascade starts at 0.12 rather than 0, AFTER impression one has
       finished arriving (cued 0.05..0.10): started at 0 it raced its own first
       line, and four impressions were already down before the setup sentence
       that leads them was legible. */
    var START = 0.12, END = 0.78;
    var n = Math.round(clamp01((p - START) / (END - START)) * marks.length);
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
  var BASE = './spin/';

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
      webm.type = 'video/webm'; webm.src = './media/slide-loop.webm';
      var mp4 = document.createElement('source');
      mp4.type = 'video/mp4'; mp4.src = './media/slide-loop.mp4';
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

  /* ------------------------------------------------------------------------
     5. THE STANDING ASK
     The page's one persistent control, and it is the ask itself rather than a
     way back to it. It was a back-to-top chevron, which is navigation where
     this page needs action: a reader convinced at chapter three had twelve
     viewports to scroll before they could do anything about it.

     Hidden in two places. On the title page, where the real pair is on screen
     and this would be a third copy of one of them; and on the colophon, where
     the asks are set in the running text (see the folio observer above).

     Nothing here manages the tab order: the hidden state is `visibility:
     hidden`, which takes the link out of it already, and the transition steps
     that property rather than easing it so the link is never focusable while
     it is invisible.
     ---------------------------------------------------------------------- */
  function syncAsk() {
    if (!ask) return;
    var want = scrollY > innerHeight * 0.75 && !onColophon;
    if (want === askShown) return;
    askShown = want;
    ask.classList.toggle('is-on', want);
  }

  if (ask) {
    addEventListener('scroll', syncAsk, { passive: true });
    syncAsk();
  }

  /* ------------------------------------------------------------------------ */
  /* buildStack() ran before mount; see the note above the stage-fit guard. */

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
