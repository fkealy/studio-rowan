# Studio Rowan preview build — notes

Built 10 September 2026. Lives at `/preview/`, `noindex`, alongside the holding
page. Nothing at the root was touched: `index.html`, `styles.css` and `main.js`
are byte-identical to what shipped.

Serve the repo root and open **`/preview/`** with the trailing slash. The only
absolute path inside this folder is `/fonts/`, shared with the holding page, so
the subtree can be promoted by moving it rather than rewriting URLs.

---

## The act 3 sequence, and where it came from

`docs/build-prompt.md` §9 said the 360 sequence did not exist and had to be
rendered from CAD or shot on a turntable. Neither was possible here. It was
built instead from the **untrimmed Higgsfield source**
(`hf_20260910_162110_…mp4`, 175 frames, 7.292s), supplied 10 September.

The important find: `media/slide-loop.mp4` was cut from the **second** half of
that clip (source frames 87–173) and **the first half had never been used**.
The two halves behave very differently, and the difference is exactly the one
that decides whether footage can be scrubbed:

| | baseline travel | silhouette height |
|---|---|---|
| frames 1–87 (unused) | 18px of 720, **±2.5%** | 150–169 |
| frames 88–175 (the loop) | 91px of 720, **±12.6%** | 168–259 |

In the loop's range the slide lifts clear of its shadow and shrinks. At
playback speed that reads as float, which is what §4 says and why it is right
for act 5/6. Under a scrub, where the reader can park on a frame, it reads as
an error. The unused half holds a near-constant baseline, so **act 3 uses
source frames 0–86**: 87 frames, roughly 180°, profile through the end-on view
to the opposite profile.

§10's rejection of AI video *for the hero scrub* still stands on its own
reasoning. This is the same footage used within the limits that reasoning sets:
the passage that does not drift.

### Encode

Graded to lift the warm studio cast toward neutral **without** lifting the
ground into the product's tonal range. Measured first: backdrop sits at luma
197, product highlights peak at 241. Only 44 levels separate them, so pushing
the ground to Ivory would clip the product and flatten the strap ribbing, which
BRIEF.md makes the first thing every asset decision must protect. The grade
therefore stops well short of Ivory and the plate reads as its own studio
stage inside the right column.

Quality was tuned against the ribbing, not against file size, per §3. Ridges
hold cleanly to crf 28 and begin merging at 36; shipped at **crf 18** with
margin. Cropped 1440×900 from the square source, verified against five rotation
extremes for clipping.

| tier | AVIF | WebP |
|---|---|---|
| 1440 | 1.10 MB | 2.50 MB |
| 1024 | 0.80 MB | 1.56 MB |
| 720 | 0.66 MB | 1.05 MB |

All inside §3's 4 MB budget, so the 48-frame fallback was not needed.

## The loop was re-trimmed, and why that is not a violation

§4 says not to re-trim without re-running the loop-point search. The search was
re-run, and it found the shipped trim was not sitting on the points §4
describes.

Measured at full resolution, mean consecutive-frame motion **0.766**:

| trim | frames | secs | seam | vs ordinary motion |
|---|---|---|---|---|
| shipped (src 87–173) | 87 | 3.61 | 1.244 | **1.62×** |
| rebuilt (src 89–172) | 84 | 3.50 | 0.845 | **0.91×** |

§4's criterion is a seam smaller than the movement the eye is already tracking.
The shipped cut was 1.6× *larger*; the rebuilt one is below it, and 89–172 is
the best of every candidate between 3.0s and 3.8s. §4's recorded figures
(1.06 against 1.83) match the rebuilt pair closely, so the search behind §4 was
right and the export drifted off it, which is the classic keyframe snap when
trimming by timestamp. The rebuild is frame-exact (`select='between(n,89,172)'`)
and carries the same grade as the spin so the two assets do not clash.

`media/slide-loop.mp4` at the root is untouched. The re-trim lives only in
`preview/media/`.

## Deviations from the spec, and why

- **Half a rotation, not 360.** The source contains 180°. A scrub does not need
  to close, only a loop does, but drag-to-spin stops at each end rather than
  wrapping. `COUNT` in `page.js` is the only thing to change when a full
  sequence exists.
- **No alpha; the plate keeps its ground.** §3 asks for transparent frames.
  Keying a near-white product off this backdrop would erode the ribbing at the
  strap edges (§9 flags exactly this) and would throw away the contact shadow,
  which §2a says does most of the work separating white on white. The graded
  plate keeps both.
- **`<img>` + `decode()` rather than `createImageBitmap`.** Same goal,
  sequential decode ahead of use. 87 ImageBitmaps at this size is a few hundred
  MB of RGBA the page would own outright; `<img>` leaves it browser-managed.
- **One tier loaded, not lowest-first then upgraded.** The chosen tier is under
  1.1 MB, so the second fetch buys little.
- **Sequence B does not exist.** There is no underside anywhere in the source,
  so the **treaded sole claim is stated without visual evidence**. It is the one
  claim in act 4 whose angle does not show what it asserts. See open items.
- **Source is 1440px, not 3000.** Tiers are 1440/1024/720 rather than
  2400/1600/1000.

## Grammar and score, as built

Split stage. Two grounds (Clay left, Ivory right) that hold; only the boundary
moves. No nav bar, no centred copy, no full-bleed before the resolve. `pan`,
`spotlight`, `magnet`, `drift` unused; exactly one `scrub`.

| # | Act | Device | Span |
|---|---|---|---|
| 1 | Recognition | `pin` | 2.2 |
| 2 | Tension, the story | prose | flow |
| 2b | Tension, the figures | `count`, held | 2.4 |
| 3 | Turn | `scrub` | 3.0 |
| 4 | Substance | `reveal` | flow |
| 5 | Mission | `flow` + `in` | flow |
| 6 | **Peak** | `kinetic` + wash line | **4.4** |
| 7 | Collapse | `pin` | 1.6 |

Six device families, none twice in a row, one `scrub`, peak has the largest
span, act 5 is quieter than it. Total **16.8vh**, clear of the recorded
13.6–13.8vh band. (Acts 2 and 4 became `flow` in the sticky audit below, and act 2's figures were
then split back out into their own held act so the counters can land. Eight acts
now, not seven.)

In preview 1 the couplet moved to the **right** column of the held figures act,
where it belongs: "We thought there had to be a better way. So we redesigned
them." is the alternative emerging, not part of the tally. The wash readout was
re-pointed at that act and shares its count window, so the line and the column
reach 70,000 together instead of the line arriving there first.

**The wash line.** Holds at 50% while the argument is laid out, then steps left
through act 6 in **14 discrete steps** — 70,000 ÷ 14 is exactly 5,000 a step, so
the readout lands on round numbers — and resolves to 0 at the collapse, where
the loop is full-bleed and the CTA sits in the winning column.

**Honesty.** The readout depletes the real 70,000 (one hotel, one year). Its
label never changes to imply pairs diverted to date. The mobile composition
rotates the same move: bands rather than columns, boundary rising.

## Verified

Desktop, mobile 390×844 and reduced-motion strips: **no dead scroll** (act 5's
authored silence was correctly not flagged), **all cues clear 4.5:1** on the
composited page at their worst frame. Focus order is skip link → spin → CTAs →
email, no traps. One `h1`, six `h2`, one per act.

Fallbacks measured by request count, not by inspection:

| condition | sequence frames | loop video | still |
|---|---|---|---|
| normal | 87 | 1 | 1 |
| `prefers-reduced-motion` | **0** | **0** | 1 |
| `Save-Data` | **0** | **0** | 1 |
| no JavaScript | **0** | **0** | 1 |

The no-JS case renders the split at 50/50 with both headlines, both grounds, the
divider, the still and all four claims: the engine parks `[data-sc-cue]` and
`[data-sc-in]` at opacity 0 as their pre-paint state, so `styles.css` carries an
`html:not(.js)` escape and an inline script in `<head>` sets `.js` before first
paint, which costs no flash.

One harness flag is left standing and is not a page defect: the counter inside a
cue element changes its own text between shots, and the harness keys cues by
text, so each shot becomes a separate key that only ever sees one sample.
Measured directly, that cue holds opacity 1.00 across a 0.76-wide plateau.

**Not verified: a real phone.** Headless Chrome cannot reproduce an iPhone's
video decoder, autoplay policy or Low Power Mode. The loop and the scrub both
need testing on device before this is promoted.

## Feel check, against BRIEF.md

Read off the final strips, then diffed against the intended curve.

| # | Intended | Felt | |
|---|---|---|---|
| 1 | Orientation, slight unease | Orientation | **unease is weaker than written** |
| 2 | Weight | Weight | ✓ |
| 3 | Curiosity | Curiosity | ✓ |
| 4 | Reassurance | Reassurance | **slightly undercut, see below** |
| 5 | Stillness | Stillness | ✓ |
| 6 | **Release** | **Release** | ✓ strongest passage on the page |
| 7 | Resolution | Resolution | ✓ |

Two honest gaps, neither fixed, both for a reason:

- **Act 1 delivers orientation but little unease.** The left column names the
  disposable world; it does not yet make you feel its cost, because the figure
  that carries the cost is act 2's and moving it forward would spend the
  counter early. The pacing is probably right and the brief's word is
  "slight", but it is a gap and it is recorded rather than papered over.
- **Act 4's reassurance is undercut by the treaded-sole claim**, which is the
  one claim whose angle does not evidence it. That is the missing sequence B,
  not a composition problem, and it resolves when the asset exists.

The peak holds the most scroll room and the largest visual change on the sheet,
and the last screen resolves rather than fading out.

## Sticky audit (added after review)

Auditing preview 2 turned up two defects here that the harness had passed.

**1. Approved copy was unreachable.** Act 2's column is 1332px of content and a
pinned stage is exactly one viewport tall with `overflow: clip`, so 432px sat
permanently below the fold: the second figure's paragraph, its sourcing note,
and the whole **"We thought there had to be a better way. / So we redesigned
them."** couplet, which is the act's payoff. Act 4 lost 69px the same way, and
on a phone acts 2, 3 and 4 lost 486px, 140px and 363px.

Acts 2 and 4 are now `flow`. Neither device needs a pin: the counters tick on
entry and the reveals run against act progress either way. The scrub keeps its
pin, and its mobile spread was tightened to fit inside one viewport.

**2. The content columns tracked the live wash line, and that grew the page.**
`.split` set its columns from `var(--wash-x)`, which is a global that runs to 0
at the collapse. So the moment the divider reached the edge, the left column of
*every earlier act* collapsed to zero width, rewrapped its text into hundreds of
lines and grew the document. Measured across two scroll passes: act 2 went
1280px → 1649px → 4196px and the document 13348 → 13717 → 16264. It happens
above the viewport, so it is invisible; what it does is stale the cached
geometry of every pinned act, which is what made the later pins slip.

It was always broken. Pinned heights were masking it, because the engine fixes a
pinned act's height at `span × vh` regardless of what its content does. Making
acts 2 and 4 flow is what exposed it.

The columns are now fixed at `50vw`. Only the chrome (divider, grounds, loop)
and the peak's own mechanism read the live variable, because there it *is* the
mechanism. A `ResizeObserver` relayout was added as a backstop, as in preview 2.

After both fixes the document height is stable across repeated passes (13348,
unchanged), and every pinned stage holds at exactly 0 for the whole of its pin
on desktop and mobile.

**Worth carrying forward:** a live layout variable driving content columns is
only safe if every value it takes is a valid layout for every act that uses it.
Here it was not, and the failure was silent because it happened off-screen.

## Copy order: the peak's setup line

Chapters three and five read as interrupted by four, and they were. In the
approved copy this is one unbroken run, hinged on a single word:

> Most importantly, they can be washed and used **again**.
> And **again**. And **again**. And **again**.
> Every wash keeps another disposable pair out of landfill...

The act order is right: `build-prompt.md` §7 puts the mission at act 5 and the
peak at act 6, and BRIEF.md wants that silence immediately before the peak. The
error was filing **"Most importantly, they can be washed and used again."** at
the end of the claims chapter. It is not the claims' conclusion, it is the
peak's setup, and leaving it two beats early put the mission in the join and
severed the handoff.

It now opens the peak, so the mission's silence falls before the setup rather
than inside it, and the hinge is intact. Same correction applied to both
previews.

## The numbers now get a full stop

A counter needs the page to hold still while it runs. As a flow section the
figures scrubbed past as the reader scrolled, so the number was still moving
when it left the frame and never landed on its value.

Chapter one is now split: the Swiss Alps story **flows**, because it is prose
and wants to be read past, and the figures get their **own pinned section**.
Measured across that act:

| act progress | 70,000 | 120,000,000 | the couplet |
|---|---|---|---|
| 0.00 | 0 | 0 | — |
| 0.20 | 23,525 | 40,329,218 | — |
| 0.40 | 69,376 | 118,930,041 | — |
| **0.45** | **70,000** | **120,000,000** | — |
| 0.60 → 1.00 | held | held | arrives, holds |

The numbers complete at 0.45 and then sit at their final value for the rest of
the act, which is about 0.77 viewports of holding on a finished figure. The
couplet that concludes them arrives afterwards, at 0.5, rather than competing
with the counting.

## Open items

1. **The 120,000,000 US landfill figure ships uncited**, on an explicit
   decision, for this preview only. It is marked in the markup and carries a
   visible "figure not yet sourced" note. `/preview/` is `noindex`. **It must be
   sourced or cut before this is promoted to the root** — scroll-craft bans
   invented statistics in a counter outright.
2. **The treaded-sole claim has no evidence.** Either shoot sequence B, supply a
   single underside still, or reword the claim.
3. **Contact is `hi@studiorowan.com`** (guidelines + prototypes). The live
   holding page uses `info@studiorowan.co.uk`. Four occurrences in
   `index.html`; still unresolved.
4. **Raptor V2 Premium is still unlicensed.** Outfit Light 300 is vendored at
   `/fonts/outfit.woff2` (SIL OFL) behind `--display`. When the licence lands,
   self-host the woff2 and change that one variable.
5. **Instagram** is not in the footer; no handle was supplied.
6. GSAP is not used and not loaded, per §8's recommendation.
7. Whether `/preview/` needs Cloudflare Access rather than `noindex` alone.

## Rebuilding the assets

`lab/` holds the verification output and is disposable. The spin sequence and
the loop were built with ffmpeg + cwebp; the exact grade, crop and encode
settings are in this file and in the header comments of `page.js`.
