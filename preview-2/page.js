/* ============================================================================
   Studio Rowan — preview 2, bespoke page behaviour.
   Chaptered editorial. Written against the engine's published act geometry;
   the engine in ./engine/ is vendored and never edited.

     1. The reprint  the signature move, in chapter five
     2. The spin     chapter two's media plate, the one scrub this grammar allows
     3. The loop     a small captioned plate in the peak's margin
     4. The figures  70,000 and 120,000,000, ticking on entry rather than on scroll

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
  /* turn1 and turn2 are the two held beats between chapters one and two, and
     turn2 is pulled up a viewport to slide over turn1. They carry one line each
     and fit any stage, so they are never demoted in practice - they are in the
     list because the list is the page's only answer to "may this be pinned?",
     and a section that is exempt from it is a section nobody is checking. */
  /* What is left after the static holds came out. A pinned frame with nothing
     happening in it is the defect - measured against Apple's own product pages,
     which pin MORE than this one and for longer (holds up to 3 viewports, 40%
     of the page) but never hold a still frame: every hold there carries media,
     staged text or images in motion the whole way through. ch1s and ch3 held
     nothing once the figures moved to an entry tick and the claims to a single
     arrival, so they flow. What remains earns its hold: the spin scrubs 87
     frames across ch2, the peak prints 29 impressions across ch5, and the two
     turns carry the page's hinge. */
  var MUTABLE    = ['turn1', 'turn2', 'ch2', 'ch5'];
  /* ch2 is on this list because of a measurement, not a composition. Its spread
     was 11px over a 390x844 stage and stayed pinned on taller phones, so the
     page held in different places on different devices - the cause of the half
     join into chapter three. Reclaiming the folio's 27px of clearance tipped it
     the other way and it began pinning on a 390 phone too. Either way it is the
     wrong answer: the phone holds on the two turns and nothing else, by rule
     rather than by whichever way a measurement happens to fall.

     ch1s is here for the same reason and it is the same story: 919px of content
     clears a 932px stage on a large phone and not a 844px one, so it held on
     some phones and not others. The list is now every content chapter, which is
     the rule stated plainly - on a phone, the only things that hold are the two
     turns, because they are the only two short enough to hold anywhere. */
  var PHONE_FLOW = ['ch2', 'ch5'];

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

  /* Section 1 was the folio, and then the chapter observer that outlived it to
     hand the standing ask off at the colophon. Both are gone: the page carries
     no running label and no persistent control, so there is nothing here to
     observe, and the data-ch / data-ch-t attributes the observer read have been
     removed from the markup with it.
     ---------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------
     1. THE REPRINT  (chapter five, the peak)
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
    /* marks holds impressions two upward; impression one is the cued
       .press__first in the markup. The cascade starts at 0.12 rather than 0,
       AFTER impression one has finished arriving (cued 0.05..0.10): started at
       0 it raced its own first line, and four impressions were already down
       before the setup sentence that leads them was legible. */
    var START = 0.12, END = 0.78;
    var n = Math.round(clamp01((p - START) / (END - START)) * marks.length);
    if (n === lastShown) return;
    for (var i = 0; i < marks.length; i++) {
      marks[i].style.opacity = i < n ? '1' : '0';
    }
    lastShown = n;
  }

  /* ------------------------------------------------------------------------
     2. THE SPIN  (chapter two)
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
     3. THE LOOP
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
     4. THE FIGURES
     70,000 and 120,000,000 tick once, on their own, when they come into view.

     They used to be the engine's [data-sc-count], scrubbed across a window of
     chapter one's pinned act: the value climbed only while the reader kept
     scrolling, and only arrived if they scrolled far enough. That makes the
     reader perform the animation. It reads well with a flick and badly with
     everything else - a trackpad nudge, a wheel click, a thumb dragged short -
     and it is the sort of thing that makes a long page feel like work. A figure
     is a fact, not a reward for scrolling.

     The engine has exactly this behaviour built in, and it cannot be used here:
     its entry-counter path takes only counters that are NOT inside an act
     (`!c.closest('[data-sc-act]')`), and both of these live inside chapter one.
     There is no attribute to opt a counter out of scrubbing, and the engine is
     vendored and never edited - so this is the engine's own idea, reimplemented
     on our side of the line, against our own attribute so the engine ignores it.

     The target is authored in the markup exactly as it should render, commas
     and all, and the template drives the formatting - the same contract the
     engine's counters use.
     ---------------------------------------------------------------------- */
  var figures = [].slice.call(document.querySelectorAll('[data-count-to]'));

  function countFmt(v, tpl) {
    var out = String(Math.round(v));
    if (tpl.indexOf(',') > -1) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return out;
  }

  function runCount(el) {
    var tpl = el.getAttribute('data-count-to') || '0';
    var to = parseFloat(tpl.replace(/,/g, '')) || 0;
    var ms = parseFloat(el.getAttribute('data-count-ms')) || 1600;
    /* Reduced motion gets the number, not the performance. */
    if (reduce || ms <= 0) { el.textContent = countFmt(to, tpl); return; }
    var t0 = null, last = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var t = Math.min((now - t0) / ms, 1);
      /* Cubic ease-out: fast enough at the start to read as a count rather than
         a crawl, and slow at the end so the value lands rather than stopping. */
      var out = countFmt(to * (1 - Math.pow(1 - t, 3)), tpl);
      if (out !== last) { el.textContent = out; last = out; }
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (figures.length) {
    if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          runCount(e.target);
          fio.unobserve(e.target);
        });
        /* Fires once per figure and then stops watching it: a number that
           re-runs every time it scrolls back into view is a distraction, and
           the second reading is never the one that matters. */
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.5 });
      figures.forEach(function (el) { fio.observe(el); });
    } else {
      figures.forEach(function (el) {
        el.textContent = countFmt(parseFloat((el.getAttribute('data-count-to') || '0').replace(/,/g, '')) || 0,
                                  el.getAttribute('data-count-to') || '0');
      });
    }
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
