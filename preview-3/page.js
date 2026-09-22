/* ============================================================================
   Studio Rowan — preview 3 (forked from preview 2), bespoke page behaviour.
   Chaptered editorial. Written against the engine's published act geometry;
   the engine in ./engine/ is vendored and never edited.

     1. The reprint  the signature move, in chapter five
     2. The spin     chapter two's media plate, the one scrub this grammar allows
     3. The field    70,000 dots drifting on the title page's olive ground
     4. The figures  70,000 and 120,000,000, ticking on entry rather than on scroll
     5. The sample form  the colophon's ask; see the note there about its backend

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
  /* The turn is not on this list any more because it is not a section any
     more: the couplet is an overlay on chapter two, and it lives or dies with
     whether chapter two is pinned. See THE HINGE in the stylesheet. */
  var MUTABLE    = ['ch2'];
  /* ch2 is on this list because of a measurement, not a composition. Its spread
     was 11px over a 390x844 stage and stayed pinned on taller phones, so the
     page held in different places on different devices - the cause of the half
     join into chapter three. Reclaiming the folio's 27px of clearance tipped it
     the other way and it began pinning on a 390 phone too. Either way it is the
     wrong answer: the phone holds nothing here at all, by rule rather
     than by whichever way a measurement happens to fall.

     It is the only entry on either list now. Chapter three came off both when
     the reprint stopped being driven by scroll - a section authored `flow` is
     not a decision anything makes at runtime - and chapter two is the last
     section on the page that pins anywhere. */
  var PHONE_FLOW = ['ch2'];

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
    /* The SPREAD, explicitly, not the stage's first child. Chapter two's stage
       now opens with the hinge overlay, which is inset:0 when pinned and
       therefore always reports exactly one stage of height - it would answer
       "yes, it fits" for every viewport there is and retire the guard without
       anyone noticing. What has to fit is the chapter under it. */
    var inner = a.el.querySelector('[data-sc-stage] .spread')
             || a.el.querySelector('[data-sc-stage] > *');
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

  /* The press builds its impressions here, BEFORE the stage-fit guard below and
     before mount, because both measure this spread and an empty stack is not
     the spread. Measured with the stack empty the peak reads ~895px and looks
     like it fits a 900px stage; built, it is 922px and clips its own closing
     lines by 11px top and bottom. buildStack touches no engine state, so it is
     free to run this early. */
  buildStack();

  /* THE PRESS RUNS OFF THE SCROLL AGAIN (preview 3) - without either of the
     things that got it taken off the scroll last time.

     It was scrubbed once: the peak was PINNED and printFrame() counted
     impressions out of the act's progress, which held the page still for 2.05
     viewports and un-printed the stack whenever the reader scrolled back up.
     It was then made a one-shot: the stack crosses the observer and all 29
     run on a 55ms stagger, done in 1.9s whatever the reader is doing.

     This is neither. Nothing is pinned: each impression prints when ITS OWN
     top edge passes 86% of the screen height, so the run comes off the press
     at the speed the page is moving and the page never stops to let it.
       IT RUNS BOTH WAYS. It was written one-way first, on the old objection
       that a stack which un-prints on the way back up is a stack the reader
       cannot go back and look at. But one-way is a trigger with extra steps,
       not a scrub: what makes it feel attached to the hand is that it comes
       off the sheet as readily as it goes on, and the full stack is always
       there for anyone who stops scrolling below it. The photograph and the
       closing copy follow the same rule, so the margin never shows an answer
       to a run that is no longer on the page.
     Because the impressions shrink by 0.87 each, the same distance of scroll
     prints more and more of them: the press speeds up as it goes, which is
     the argument the stack was always making.

     THE ORDER. The photograph and the closing copy stand beside the stack on
     a wide screen, so left to themselves they are on the page before the
     first "And again." has printed - the answer ahead of the repetition it
     answers. "The same pair, still going." only means something once the
     reader has watched the pair come back a dozen times. So the margin is
     gated on the run: the photograph arrives between 30% and 60% of the way
     down the stack, while the press is still going beside it, and the
     closing copy between 65% and 95%, landing as the last lines print.
       On a phone the margin is UNDER the stack, the run is finished before it
     is reached, and a gate that is already open would show it all at once -
     so each also has to cross the screen itself. Its progress is the lesser
     of the two: the gate governs on a wide screen, position on a narrow one.

     The engine's handles come off the stack so its one-shot never fires.
     With reduced motion none of this runs and the engine's reveal stands. */
  var pressEl = stack && stack.closest ? stack.closest('.press') : null;
  if (pressEl && !reduce) (function () {
    stack.removeAttribute('data-sc-in'); stack.removeAttribute('data-sc-stagger');
    pressEl.classList.add('is-scrub');
    var plate = pressEl.querySelector('.press__margin .plate');
    var tail = pressEl.querySelector('.press__tail');
    var printed = 0, last = [-1, -1], queued = false;

    function own(el, vh) { return el ? clamp01((vh * 0.92 - el.getBoundingClientRect().top) / (vh * 0.2)) : 0; }
    function gated(el, idx, gate, vh) {
      if (!el) return;
      var p = Math.min(gate, own(el, vh));
      if (p !== last[idx]) { last[idx] = p; el.style.setProperty('--in', p.toFixed(3)); }
    }
    function write() {
      queued = false;
      var vh = window.innerHeight, line = vh * 0.86;
      /* BOTH WAYS. The run is in document order, so the printed impressions
         are always a prefix of `marks`: walk the boundary forward while the
         next one is above the line, back while the last one has dropped below
         it. Scrolling up takes them off the sheet in the reverse of the order
         they went on. */
      while (printed < marks.length && marks[printed].getBoundingClientRect().top < line) {
        marks[printed].classList.add('on'); printed++;
      }
      while (printed > 0 && marks[printed - 1].getBoundingClientRect().top >= line) {
        printed--; marks[printed].classList.remove('on');
      }
      /* DISTANCE through the stack, not the count of impressions. They shrink
         by 0.87 each, so the count lags the scroll badly - measured, 45% of
         them is not reached until 77% of the way down, and a gate keyed to the
         count held the photograph back for most of the run and then opened it
         inside a single wheel step. */
      var sr = stack.getBoundingClientRect();
      var run = clamp01((line - sr.top) / (sr.height || 1));
      gated(plate, 0, clamp01((run - 0.30) / 0.30), vh);
      gated(tail, 1, clamp01((run - 0.65) / 0.30), vh);
    }
    function ask() { if (!queued) { queued = true; requestAnimationFrame(write); } }
    window.addEventListener('scroll', ask, { passive: true });
    document.body.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    write();
  })();

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

     Impressions are real elements, created once here and revealed ON ENTRY by
     the engine's flow reveal - `data-sc-in` + `data-sc-stagger` on the stack
     in the markup, which fires once and never reverses. They used to be
     revealed by SCROLL, which held the peak still for 2.05 viewports and
     un-printed the stack whenever the reader scrolled back up. Nothing here
     runs per frame any more; this function just writes the impressions and
     stops.
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
      /* vh capped in vw, the same pair .press__first takes (styles.css): sized
         off the height alone the first impressions outran a narrow screen. */
      var fs = Math.max(size, 0.85);
      b.style.fontSize = 'min(' + fs.toFixed(3) + 'vh, ' + (fs * 17.5 / 9.4).toFixed(3) + 'vw)';
      /* Stepped across the sheet so the stack cascades rather than aligning
         into a column, which would read as a list instead of a print run. */
      b.style.transform = 'translateX(' + (i * 0.9) + 'ch)';
      /* NO inline opacity. The engine's flow-reveal rule owns it now
         (`[data-sc-stagger] > *` at 0, `> .sc-in` at 1), and an inline 0 here
         would beat a stylesheet 1 and hold every impression invisible for
         ever. The inline TRANSFORM is deliberate the other way round: it beats
         the engine's 14px rise, so these keep their stepped offset across the
         sheet and gain no vertical travel. */
      b.style.color = i < 3 ? 'var(--onyx)'
                    : 'color-mix(in oklab, var(--onyx) ' + Math.max(38, 100 - i * 2.2) + '%, transparent)';
      b.style.transition = 'opacity 260ms var(--sc-ease-out)';
      frag.appendChild(b);
      marks.push(b);
      size *= ratio;
    }
    stack.appendChild(frag);
  }

  /* printFrame() lived here and is gone. It recomputed how many impressions
     should be showing from the act's progress on every frame, which is what
     made the peak the largest held block on the page AND what made it re-hide
     on scroll-up. The cascade is `data-sc-in` + `data-sc-stagger` in the
     markup now; nothing about it runs per frame. */

  /* ------------------------------------------------------------------------
     2. THE SPIN  (chapter two)
     ---------------------------------------------------------------------- */
  var COUNT = 87;
  var SPIN_START = 0.5;    /* the sheet has cleared the plate by here; see --lift in styles.css */
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

  /* THE HOLD. The head script has the page behind the curtain (index.html)
     from before first paint; this is what lets it go. Two things have to be
     in: every frame of the turn, and the fonts, so the title page arrives
     set. Releasing is one class off the root, and it is idempotent - the
     head's own 20s timer removes the same class if this never runs, and
     both may fire. */
  var curtain = document.getElementById('curtain');
  var holdFrames = false, holdFonts = false;
  function release() {
    if (holdFrames && holdFonts) document.documentElement.classList.remove('is-holding');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { holdFonts = true; release(); },
                              function () { holdFonts = true; release(); });
  } else { holdFonts = true; }

  function startSpin() {
    var tier = pickTier();
    probe(BASE + tier + '/f000.avif').then(function (avif) {
      var ext = avif ? 'avif' : 'webp';
      var imgs = new Array(COUNT), decoded = 0;
      spin = { imgs: imgs, painted: null, live: false, drag: 0, vel: 0, grabbed: false };
      var i = 0;
      (function next() {
        if (i >= COUNT) { frame.classList.add('is-ready'); holdFrames = true; release(); return; }
        var n = i++;
        var img = new Image();
        img.decoding = 'async';
        img.src = BASE + tier + '/f' + String(n).padStart(3, '0') + '.' + ext;
        imgs[n] = img;
        var done = function () {
          decoded++;
          frame.style.setProperty('--decoded', (decoded / COUNT).toFixed(3));
          if (curtain) curtain.style.setProperty('--loaded', (decoded / COUNT).toFixed(3));
          /* `is-live` is NOT set here any more. It hides the still, and it
             used to fire on the first decode - before anything had been
             painted. drawSpin() sets it after its first drawImage(), so the
             still stays up until there is a frame on the canvas to replace
             it. See the note there. */
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
    /* The spin starts where the reveal lands, not where the act does. The first
       0.58 of chapter two is the hinge: the couplet arriving and the olive
       sheet it is printed on travelling off the top of the frame.
       Mapped from 0 the slipper spent that whole stretch turning behind an
       opaque sheet - half the rotation spent, unseen, before anyone had been
       shown the thing - and arrived at the reveal already half way round.
       Remapped, frame 0 is what the sheet uncovers and the turn is the
       reader's from there. The window is 0.38 of a 2.5vh hold, which is 0.95
       viewports of scroll against the 1.2 the whole act gave it before. */
    var sp = clamp01((progress('ch2') - SPIN_START) / (1 - SPIN_START));
    var idx = clamp(Math.round(sp * (COUNT - 1) + spin.drag), 0, COUNT - 1);
    /* THE NEAREST FRAME THAT HAS ARRIVED, not the exact one or nothing. The
       frames come in one at a time from 0, and the reader is wherever they
       are: on a phone connection a reader already past the reveal wanted
       frame 60 while frame 4 was landing, and the plate stood empty - the
       still hidden, the canvas never painted - for as long as the other 56
       took. A frame that fails outright (a dropped request, a decode the
       browser refuses) was a hole the plate fell into for good whenever the
       scroll parked on it. Now the canvas shows the closest frame it has
       and the still is only hidden once something has been painted; when
       the frame it actually wants arrives, it is drawn over the stand-in. */
    var img = nearestReady(idx);
    if (!img || img === spin.painted) return;
    canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, canvas.width, canvas.height);
    spin.painted = img;
    if (!spin.live) { spin.live = true; frame.classList.add('is-live'); }
  }
  function ready(i) {
    var img = spin.imgs[i];
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  }
  function nearestReady(idx) {
    var img = ready(idx);
    for (var d = 1; !img && d < COUNT; d++) img = ready(idx - d) || ready(idx + d);
    return img;
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
     3. THE FIELD  (title page)
     Exactly 70,000 dots on olive: one for every pair of disposable slippers
     a single hotel throws away in a year.

     THIS IS PROTOTYPE 02'S FIELD, PORTED NUMBER FOR NUMBER (one exception,
     marked in the vertex shader: dot size and brightness no longer grow with
     the viewport). Same scatter, same
     camera, same vertex maths, same sprite falloff, same pointer lean and the
     same dispersal on scroll. The only thing that did not come across is
     three.js: the prototype pulled it from a CDN, which this build's CSP
     (script-src 'self') refuses, and the whole field is ONE draw call of
     gl.POINTS with a custom shader - so it is written against WebGL directly
     rather than vendoring a 600KB library to make one call through it.

     An earlier version here painted the dots into five flat 2D layers and
     slid the layers against each other. It was cheap and it looked it: every
     dot in a layer moved in lockstep, there was no perspective, and nothing
     answered the pointer or the scroll. What makes the prototype's field read
     as a volume is that each dot wanders on its OWN phase (`seed`) inside a
     real perspective projection, and that only happens per vertex.

     With reduced motion, Save-Data or a 2g connection one frame is drawn and
     left still (the prototype drew nothing at all). With no WebGL, or no
     script, the title page is type on flat olive, which is a complete page.
     ---------------------------------------------------------------------- */
  var fieldHost = document.getElementById('field');
  if (fieldHost) (function () {
    var COUNT = 70000;
    var cv = document.createElement('canvas');
    var gl = null;
    try {
      gl = cv.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    } catch (e) {}
    if (!gl) return;

    var VS = [
      'attribute vec3 position; attribute float seed;',
      'uniform float uTime, uScroll, uPR, uCamZ, uAspect; uniform vec2 uRot;',
      'varying float vA;',
      'void main(){',
      '  vec3 p = position; float t = uTime * .12 + seed * 6.2831;',
      '  p.x += sin(t + p.y * .35) * .18; p.y += cos(t * .8 + p.x * .22) * .14;',
      '  p.y += uScroll * (2.5 + seed * 4.0); p.z += uScroll * seed * 6.0;',
      /* points.rotation: Euler XYZ, so Ry first, then Rx */
      '  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);',
      '  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);',
      '  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);',
      '  float mz = p.z - uCamZ;',
      /* PerspectiveCamera(38, aspect, .1, 100) */
      '  float f = 2.904211; float n = .1; float fr = 100.;',
      '  gl_Position = vec4(f / uAspect * p.x, f * p.y, (fr + n) / (n - fr) * mz + 2. * fr * n / (n - fr), -mz);',
      /* THE ONE DEPARTURE FROM THE PROTOTYPE. It sized and lit each dot by
         its distance from the camera, and it moves the camera: z = 20 under
         700px, z = 14 above. So on anything wider than a phone every dot
         was about 43% larger AND its alpha rose from roughly .42 to .63 -
         bigger and brighter at once, behind a page with far more copy on it
         than the prototype's title had. The narrow look is the one that
         reads, so size and alpha are taken from `lz`, the depth the dot
         WOULD have from z = 20, at every width. The projection above still
         uses the real camera: wide screens keep the closer framing, which
         spreads the same dots further apart, so they end up quieter than
         the phone rather than louder. */
      '  float lz = mz - (20.0 - uCamZ);',
      '  float depth = clamp((lz + 22.0) / 16.0, 0.0, 1.0);',
      '  gl_PointSize = (1.6 + seed * 2.2) * uPR * (16.0 / -lz);',
      '  vA = (0.35 + depth * .55) * (1.0 - uScroll * .85);',
      '}'].join('\n');
    /* The prototype's sprite was a 64px radial gradient - 1 at the centre, .5
       at 55% of the radius, 0 at the edge - sampled as a texture. It is three
       numbers, so it is computed here instead of uploaded. */
    var FS = [
      'precision mediump float; uniform vec3 uColor; varying float vA;',
      'void main(){',
      '  float r = length(gl_PointCoord - .5) * 2.;',
      '  float a = r < .55 ? mix(1., .5, r / .55) : mix(.5, 0., clamp((r - .55) / .45, 0., 1.));',
      '  gl_FragColor = vec4(uColor, a * vA);',
      '}'].join('\n');

    function sh(type, src) {
      var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o);
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    /* Points scattered in a wide, shallow slab with a soft central density -
       the prototype's distribution, verbatim. */
    var pos = new Float32Array(COUNT * 3), seed = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) {
      var r = Math.pow(Math.random(), 0.6) * 11, a = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(a) * r * 1.6;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.75 + (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      seed[i] = Math.random();
    }
    function attrib(name, data, size) {
      var loc = gl.getAttribLocation(prog, name), b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    attrib('position', pos, 3); attrib('seed', seed, 1);

    var U = {};
    ['uTime', 'uScroll', 'uPR', 'uCamZ', 'uAspect', 'uRot', 'uColor'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform3f(U.uColor, 246 / 255, 245 / 255, 242 / 255);   /* #F6F5F2 */
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    /* three's NormalBlending for a transparent material */
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    fieldHost.appendChild(cv);

    var pr = 1, camZ = 14;
    function resize() {
      var w = fieldHost.clientWidth, h = fieldHost.clientHeight;
      if (!w || !h) return;
      pr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * pr); cv.height = Math.round(h * pr);
      gl.viewport(0, 0, cv.width, cv.height);
      /* UNDER 390 THE PHONE FRAMING IS SCALED, NOT CROPPED. The camera sat at
         z = 20 for every width under 700, and dot size is in pixels, so a
         320px screen showed the middle four fifths of the 390 composition
         with dots a fifth larger against it: the shaped cloud became an even
         speckle, edge to edge. The camera now backs off in proportion (the
         same cloud, the same shape, smaller) and the dots shrink with it. The
         shader sizes dots as if from z = 20 whatever uCamZ is, so the two
         have to be scaled together, here. */
      var narrow = Math.min(1, Math.max(w, 280) / 390);
      camZ = w < 700 ? 20 / narrow : 14;
      gl.uniform1f(U.uPR, pr * (w < 700 ? narrow : 1)); gl.uniform1f(U.uCamZ, camZ); gl.uniform1f(U.uAspect, w / h);
      if (lite) draw(0);
    }

    var mx = 0, my = 0, tmx = 0, tmy = 0, scroll = 0, targetScroll = 0;
    var hero = fieldHost.parentNode, t0 = performance.now(), live = true, raf = 0;

    function draw(time) {
      gl.uniform1f(U.uTime, time); gl.uniform1f(U.uScroll, scroll);
      gl.uniform2f(U.uRot, my * 0.08, mx * 0.12);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, COUNT);
    }
    function loop() {
      cancelAnimationFrame(raf);
      (function frame() {
        if (!live || document.hidden) { raf = 0; return; }
        scroll += (targetScroll - scroll) * 0.06;
        mx += (tmx - mx) * 0.03; my += (tmy - my) * 0.03;
        draw((performance.now() - t0) / 1000);
        raf = requestAnimationFrame(frame);
      })();
    }

    resize();
    window.addEventListener('resize', resize);
    fieldHost.classList.add('is-on');
    if (lite) { draw(0); return; }

    if (matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      targetScroll = clamp01(y / (hero.offsetHeight * 0.9));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    document.addEventListener('visibilitychange', function () { if (!document.hidden && live && !raf) loop(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { live = en[0].isIntersecting; if (live && !raf) loop(); }).observe(fieldHost);
    }
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); live = false; });
    loop();
  })();

  /* ------------------------------------------------------------------------
     THE LIT LINES  (the mission statement, and the hinge's answer)
     A display line lights one word at a time as it comes up the screen. The
     prototype did it with GSAP's ScrollTrigger scrubbing a stagger; this reads
     the line's own rect, because the build carries no GSAP and two sentences
     do not justify it. With reduced motion nothing is split or dimmed.

     THE WINDOW IS MEASURED ON THE LINE'S TOP EDGE AND NOTHING ELSE: it starts
     lighting when the top crosses `from` of the screen height and is fully lit
     by `to`. It used to end on the BOTTOM edge reaching 45%, which a tall
     statement in a sticky column never did - it stuck at 18vh with its foot at
     54% and the last two words stayed dark until the column released. The
     statement is static now (styles.css) and this no longer depends on how
     tall the line sets.

     The hinge's answer finishes higher up the window than the mission does,
     because it has a deadline: the sheet it is printed on slides up into the
     pin with its top edge around 54% of the screen, and it should be fully lit
     as it comes to rest, so the hold is spent reading it rather than watching
     it arrive.
     ---------------------------------------------------------------------- */
  var LIT = { mission: [0.86, 0.36], hinge: [0.96, 0.60] };
  var litEls = reduce ? [] : [].slice.call(document.querySelectorAll('[data-words]'));
  litEls.forEach(function (el) {
    var win = LIT[el.getAttribute('data-words')] || LIT.mission;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var sp = document.createElement('span'); sp.className = 'w'; sp.textContent = t;
            frag.appendChild(sp);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    var words = el.querySelectorAll('.w'), lit = -1;
    el.classList.add('is-scrub');
    function light() {
      var vh = window.innerHeight, top = el.getBoundingClientRect().top;
      var p = clamp01((vh * win[0] - top) / (vh * (win[0] - win[1])));
      var n = Math.round(p * words.length);
      if (n === lit) return; lit = n;
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
    }
    /* Two frames, not none. The hinge's answer rides a sheet the ENGINE moves,
       and the engine writes that position in its own frame callback - so read
       straight off the scroll event, the last event of a gesture measured the
       line where it had been a frame earlier and could leave it a word short
       for good. The second frame is after the engine's, whichever order the
       two were registered in. */
    var queued = false;
    function ask() {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () { queued = false; light(); }); });
    }
    window.addEventListener('scroll', ask, { passive: true });
    document.body.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    light();
  });

  /* ------------------------------------------------------------------------
     THE CLAIMS  (chapter three)
     Each of the four claims under "Why it holds up." is written in by the
     scroll rather than by a timer: see `.claims.is-scrub` in styles.css for
     what `--in` drives and why it never goes back down.
     ---------------------------------------------------------------------- */
  var claimsEl = document.querySelector('.claims');
  if (claimsEl && !reduce) (function () {
    var items = Array.prototype.slice.call(claimsEl.querySelectorAll('.claim'));
    var best = items.map(function () { return 0; }), queued = false;
    claimsEl.classList.add('is-scrub');
    function write() {
      queued = false;
      var vh = window.innerHeight, from = vh * 0.9, run = vh * 0.22;
      for (var i = 0; i < items.length; i++) {
        if (best[i] === 1) continue;
        var p = clamp01((from - items[i].getBoundingClientRect().top) / run);
        if (p > best[i]) { best[i] = p; items[i].style.setProperty('--in', p.toFixed(3)); }
      }
    }
    function ask() { if (!queued) { queued = true; requestAnimationFrame(write); } }
    window.addEventListener('scroll', ask, { passive: true });
    document.body.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    write();
  })();

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
    /* Zeroed here, not in the markup. The markup carries the real figure so the
       page is never wrong without script; this is the one place that knows an
       animation is actually about to happen, so it is the only place entitled
       to replace a true number with a zero. */
    figures.forEach(function (el) { el.textContent = '0'; });
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

  /* ------------------------------------------------------------------------
     THE SAVING  (the calculator above the form)
     Two sliders in, one large number out. What they spend now is pairs x
     price; what they would spend is pairs x OURS_PER_STAY, one pair of
     disposables being one guest stay; the saving is the difference.
     OURS_PER_STAY is the studio's all-in estimate, and the same figure the
     "How we work this out" note quotes.

     THE PAIRS SLIDER IS NOT LINEAR, because hotels are not: a guesthouse gets
     through a thousand pairs a year and a resort half a million, and on a
     linear track everything under 50,000 would live in the first tenth of it.
     The track is a position from 0 to 1000 and the value is 1,000 x 500^t,
     rounded to two significant figures - so every stop is a number a person
     would say, and equal movements are equal RATIOS wherever the thumb is.
     684 is the page's own 70,000.

     THE REVEAL IS THE COUNT-UP. The figure is zeroed and counts to its value
     the first time it comes into view - the same ease the 70,000 at the top
     of the page lands on. After that it follows the sliders with nothing in
     between: a number that animates behind a drag always feels late.
     ---------------------------------------------------------------------- */
  var OURS_PER_STAY = 0.25;
  /* Grams in one pair of disposables, for the waste figure. The note quotes
     it; change both together. */
  var WASTE_G_PER_PAIR = 50;
  var calc = document.getElementById('calc');
  if (calc) (function () {
    var pairsEl = document.getElementById('c-pairs'), costEl = document.getElementById('c-cost');
    var out = { save: 'calc-save', now: 'calc-now', ours: 'calc-ours', waste: 'calc-waste',
                pairsOut: 'c-pairs-out', costOut: 'c-cost-out' };
    Object.keys(out).forEach(function (k) { out[k] = document.getElementById(out[k]); });
    var gbp = function (v) { return '\u00A3' + Math.round(v).toLocaleString('en-GB'); };
    var counting = false, saveText = '';

    function pairsAt(pos) {
      var v = 1000 * Math.pow(500, pos / 1000);
      var mag = Math.pow(10, Math.floor(Math.log10(v)) - 1);
      return Math.round(v / mag) * mag;
    }
    function fill(el) {
      var min = +el.min, max = +el.max;
      el.style.setProperty('--fill', ((+el.value - min) / (max - min) * 100).toFixed(2) + '%');
    }
    function compute() {
      var pairs = pairsAt(+pairsEl.value), cost = +costEl.value;
      var now = pairs * cost, ours = pairs * OURS_PER_STAY, save = now - ours;
      /* The cost slider stops at 30p, so ours is never the dearer of the two
         and the saving is never negative; Math.max is the belt to that. */
      saveText = gbp(Math.max(save, 0));
      if (!counting) out.save.textContent = saveText;
      out.now.textContent = gbp(now); out.ours.textContent = gbp(ours);
      out.pairsOut.textContent = pairs.toLocaleString('en-GB');
      out.costOut.textContent = '\u00A3' + cost.toFixed(2);
      pairsEl.setAttribute('aria-valuetext', pairs.toLocaleString('en-GB') + ' pairs a year');
      costEl.setAttribute('aria-valuetext', '\u00A3' + cost.toFixed(2) + ' a pair');
      /* Kilograms until there is a tonne of it, then tonnes to one decimal:
         "3,500 kg" is a number, "3.5 tonnes" is a skip full of slippers. */
      var kg = pairs * WASTE_G_PER_PAIR / 1000;
      out.waste.textContent = kg < 1000 ? Math.round(kg).toLocaleString('en-GB') + ' kg'
        : (Math.round(kg / 100) / 10).toLocaleString('en-GB') + (kg < 1050 ? ' tonne' : ' tonnes');
      fill(pairsEl); fill(costEl);
    }
    calc.addEventListener('input', function () { counting = false; compute(); });
    calc.addEventListener('submit', function (e) { e.preventDefault(); });
    compute();

    if (!reduce && 'IntersectionObserver' in window) {
      counting = true; out.save.textContent = '\u00A30';
      var cio = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        cio.disconnect();
        var t0 = null;
        requestAnimationFrame(function frame(now) {
          if (t0 === null) t0 = now;
          var t = Math.min((now - t0) / 1600, 1);
          if (t >= 1 || !counting) { counting = false; out.save.textContent = saveText; return; }
          var to = parseInt(saveText.replace(/[^\d]/g, ''), 10) || 0;
          out.save.textContent = gbp(to * (1 - Math.pow(1 - t, 3)));
          requestAnimationFrame(frame);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.6 });
      cio.observe(out.save);
    }
  })();

  /* ------------------------------------------------------------------------
     5. THE SAMPLE FORM  (colophon)
     Six answers, then "We will be in touch."

     The answers are POSTed as JSON to SAMPLE_ENDPOINT, a Cloudflare Pages
     Function (/functions/api/sample-request.js) that emails them to the
     studio; same-origin, because the CSP is connect-src 'self'. A 2xx shows
     the confirmation. If the request fails - the function is not configured
     yet, the reader is offline, or this is a plain static server with no
     functions at all - the answers are handed to the reader's own email app
     instead, addressed, subjected and filled in, and the confirmation says
     to press send. Nothing is ever reported as sent that was not.

     `website` is the honeypot: a field no person can see or tab to, which
     the function treats as proof of a script if it arrives filled.

     Validation is the browser's own (required, type=email), asked for on
     submit: `novalidate` is on the form only so the first complaint can be
     put in the page's voice beside the button rather than in a native bubble
     that looks different in every browser.
     ---------------------------------------------------------------------- */
  /* EMPTY ON PURPOSE, for now: the studio is keeping the email handoff rather
     than setting up a sending service. Empty means submit goes straight to
     the reader's email app with no request made first. The function is
     written and waiting - set this to '/api/sample-request' once it has
     something to send through. */
  var SAMPLE_ENDPOINT = '';
  var SAMPLE_TO = 'info@studiorowan.co.uk';
  var form = document.getElementById('sample-form');
  var done = document.getElementById('sample-done');
  if (form && done) (function () {
    var err = form.querySelector('.sample__err');
    var btn = form.querySelector('button[type="submit"]');
    var note = done.querySelector('.sample__done-note');
    var LABELS = { name: 'Name', email: 'Email', company: 'Company', quantity: 'Estimated order quantity',
                   needed_by: 'Needed by', comments: 'Comments' };

    function values() {
      var out = {};
      Object.keys(LABELS).forEach(function (k) { out[k] = (form.elements[k].value || '').trim(); });
      return out;
    }
    function say(msg) { err.textContent = msg; err.hidden = !msg; }
    function finish(msg) {
      note.textContent = msg;
      form.hidden = true; done.hidden = false;
      done.focus({ preventScroll: true });
      /* The confirmation is a fraction of the form's height, so everything
         under it moves up. The engine caches act geometry; tell it. */
      sc.layout();
    }
    function byEmail(v) {
      var body = Object.keys(LABELS).map(function (k) { return LABELS[k] + ': ' + (v[k] || '-'); }).join('\n');
      var lead = 'Your email app should have opened with your answers filled in. Press send and we will take it from there.';
      location.href = 'mailto:' + SAMPLE_TO
        + '?subject=' + encodeURIComponent('Sample box request - ' + v.company)
        + '&body=' + encodeURIComponent(body);
      /* The same gap as the email links (section 6): with no email app the
         handoff opens nothing. So the answers go on the clipboard as well,
         and the confirmation says where to send them if they are needed. */
      var tail = ' If nothing opened, email ' + SAMPLE_TO + ' instead';
      copy(body).then(function () { finish(lead + tail + ' - your answers are copied, ready to paste.'); },
                      function () { finish(lead + tail + '.'); });
    }

    /* THE FORM OPENS ON REQUEST. Its own button opens it; so does any link to
       #sample - the two "Start with a sample box" buttons on the title page -
       and so does arriving with #sample already in the address. Focus goes to
       the first field only when the reader is already here: from the top of
       the page it would cut the scroll short. */
    var row = document.getElementById('sample'), opener = document.getElementById('sample-open');
    function openForm(focus) {
      if (!row.classList.contains('is-waiting')) return;
      row.classList.remove('is-waiting');
      form.classList.add('is-opening');
      opener.setAttribute('aria-expanded', 'true');
      if (focus) form.elements.name.focus({ preventScroll: true });
      sc.layout();
    }
    if (row && opener) {
      row.classList.add('is-waiting');
      opener.addEventListener('click', function () { openForm(true); });
      [].forEach.call(document.querySelectorAll('a[href="#sample"]'), function (a) {
        a.addEventListener('click', function () { openForm(false); });
      });
      if (location.hash === '#sample') openForm(false);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('is-tried');
      if (!form.checkValidity()) {
        var bad = form.querySelector(':invalid');
        say(bad && bad.type === 'email' && bad.value ? 'That email address does not look right.'
                                                     : 'Please fill in the fields marked above.');
        if (bad) bad.focus();
        return;
      }
      say('');
      var v = values();
      var trap = form.elements.website;
      if (!SAMPLE_ENDPOINT) { byEmail(v); return; }
      btn.disabled = true;
      fetch(SAMPLE_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ website: trap ? trap.value : '' }, v))
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        finish('Thank you, ' + v.name.split(' ')[0] + '. We have your request and will reply to ' + v.email + '.');
      }).catch(function () { btn.disabled = false; byEmail(v); });
    });
  })();

  /* ------------------------------------------------------------------------
     6. THE EMAIL LINKS
     Every "Get in touch" is a plain mailto: link and stays one. But a mailto
     only does something on a machine with an email APP set up to take it, and
     a great many people - anyone who reads their mail in a browser tab - have
     none: the link is pressed and nothing at all happens, which reads as a
     broken button. The page cannot detect that. So as well as letting the link
     do its job, a press copies the address and says so, in a line that is on
     screen for a few seconds. With an email app the reader gets both; without
     one they get an address on their clipboard and are told it is there.

     The one thing on this page that is fixed to the viewport, and only while
     it is speaking. role="status" so it is read out, not just shown.
     ---------------------------------------------------------------------- */
  var toast = null, toastTimer = 0;
  function announce(msg) {
    if (!toast) {
      toast = document.createElement('p');
      toast.className = 'toast'; toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    void toast.offsetWidth; toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 5200);
  }
  function copy(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.reject();
    return navigator.clipboard.writeText(text);
  }
  [].forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) {
    a.addEventListener('click', function () {
      var addr = a.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
      copy(addr).then(function () { announce('Opening your email app. We have copied ' + addr + ' too, in case it does not.'); },
                      function () { announce('Opening your email app. If nothing happens, write to ' + addr + '.'); });
    });
  });

  /* ------------------------------------------------------------------------ */
  /* buildStack() ran before mount; see the note above the stage-fit guard. */

  /* One thing left in the frame loop: the spin, which is a real scrub. */
  function tick() { spinFrame(); requestAnimationFrame(tick); }

  /* The turn loads NOW, not when the plate comes within two viewports: the
     page is held on it (THE HOLD, above), so there is nothing to defer it
     behind. Lite (reduced motion, save-data, 2G) shows the still, loads no
     frames and was never held - the head script makes the same test - so
     it simply lets the hold go in case it is somehow on. */
  if (frame && !lite) startSpin();
  else {
    if (frame) { frame.removeAttribute('tabindex'); if (hint) hint.textContent = 'shown as a still'; }
    holdFrames = true; release();
  }

  requestAnimationFrame(tick);
})();
