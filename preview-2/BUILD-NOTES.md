# Studio Rowan preview 2 — notes

The second design proposal. Lives at `/preview-2/`, `noindex`, alongside the
holding page and preview 1. Nothing at the root was touched.

Serve the repo root and open **`/preview-2/`** with the trailing slash.

**Grammar: chaptered editorial** (uniqueness.md 2.2). Chosen because the ask was
"one thing at a time", and this grammar is built out of exactly that: a
full-stop intertitle, then one dense asymmetric spread, then the next
intertitle. Nothing crossfades; chapters hard-cut between grounds.

---

## What this fixes that preview 1 did not

The eyebrow problem. In preview 1 the naming of each world sat as a `.meta`
line above a heading, and next to the wordmark **"What hospitality has / Worn
for moments, wasted forever."** reads as if it introduces *our* product rather
than the one being replaced. Six eyebrows across seven acts also broke
scroll-craft's cap of one per three sections, which is the same failure
prototype 06 was pulled up for.

This grammar moves that job into the chrome permanently. **The folio** is one
line in the margin naming the chapter you are in, and it is the only place
either world is named. A heading never has to carry a label, so there is
nothing to misread. Preview 1 has also been corrected: its eyebrows are down
from six to one, and its divider labels were promoted to carry the naming.

## Structure

| Unit | Ground | Device | Span |
|---|---|---|---|
| Title page | Ivory | `flow` + `in` | flow |
| Intertitle → Chapter one, the hotel slipper | Clay | prose | flow |
| &nbsp;&nbsp;↳ the figures, held | Clay | `count` | 2.4 |
| Intertitle → Chapter two, the Never-Ending Slipper | White | `scrub` | 2.6 |
| Intertitle → Chapter three, why it holds up | Ivory | `reveal` | 2.6 |
| &nbsp;&nbsp;↳ **the peak, still chapter three** | Ivory | **the reprint** | **4.6** |
| Intertitle → Chapter four, our mission | Hemp | `flow` + `in` | flow |
| Colophon | Olive | `flow` | flow |

Twelve sections, **23.3vh** total, clear of the recorded 13.6–13.8vh band.
Preview 1 runs to the same length in seven acts, so the two differ on shape
rather than on size: twelve short chaptered units against seven long acts. Six device families,
none twice in a row, exactly one `scrub` (this grammar's limit), peak has the
largest span, and chapter four is quieter than it.

## The signature move: the reprint

Chapter five prints itself again, and again. Each impression is set smaller and
tighter than the last and stepped across the sheet, so the repetitions cascade
like proofs coming off a press. Thirty impressions, the first at 9.4vh, each
0.87 of the one before, so the run occupies roughly 69vh and the last
impressions stop being readable and become texture. That is the argument made
of the page's own material: one pair, over and over, until the repetition is
the whole page, and the texture at the bottom is the rhyme with 70,000.

The margin carries the impression number and one line, *"One pair. Every
impression is one wash."* Deliberately **not** a countdown: that is preview 1's
wash line, and a signature move that appears on two builds is not a signature
move.

## Deliberate differences from preview 1

- **Media never bleeds under type.** The spin sits in a captioned media column,
  and the ambient loop is a small captioned plate in the peak's margin. There
  is no full-bleed anything, so preview 1's ending (loop takes the screen) has
  no equivalent here by design.
- **The close is a colophon**, not a plate over media. The ask is set as a line
  of running text inside the paragraph rather than a button island, and there
  is no magnet: both are this grammar's bans.
- **No progress readout.** The folio says where you are, not how far through.

## Assets

Shared with preview 1 by relative path (`../preview/spin/`,
`../preview/media/`) rather than duplicated, so this proposal costs about 60 KB
on top of what preview 1 already ships. **If this direction is chosen, the
assets move with it** and the paths become local, which is a one-line change in
`page.js` (`BASE`) and two in the markup.

## Verified

Desktop, mobile 390×844 and reduced-motion: **no dead scroll**, **no cues that
fail to peak**, **all contrast clears 4.5:1** on the composited page at its
worst frame.

One mobile defect found and fixed, worth recording because it is structural
rather than cosmetic: chapters three and five were pinned, and on a 390×844
screen their spreads stack to well over one viewport. A pinned stage is one
viewport tall, so the bottom of those spreads was content the reader could
never reach — the press tail measured **1.54:1**, not because of colour but
because it was pinned off-screen. Both chapters now **flow on mobile**, set
before mount in `page.js` because the engine reads `data-sc-act` once. The
scrub chapter stays pinned, since pinning is how a scrub works at all.

**A second structural defect, found by eye rather than by the harness.** The
engine's stage is exactly one viewport tall and clips. Content dropped into it
sits flush against the very top edge, and anything shorter than a viewport
leaves the rest of the frame dead — while a pinned act HOLDS on that
composition for its whole span. Chapter two's spread was 466px inside a 900px
stage, so the page paused for nearly three viewport-heights on a top-jammed,
half-empty screen. Every automated check passed: the copy cued correctly, the
contrast was fine, there was no dead scroll. It was simply badly composed.

The pinned spreads now fill the stage and centre in it, with their own vertical
padding, and chapter two's span came down from 3.0 to 2.6 so the hold is
shorter. The stage itself is untouched: the rules are on my own elements.

Worth carrying forward: **a pinned act is only as good as the single frame it
holds on.** Nothing in the harness measures composition, so a pinned stage
wants checking by eye at its held position, not just walked through.

**Not verified: a real phone**, same as preview 1.

## Sticky audit

Audited on request. Three defects in the pinned acts, all measured rather than
eyeballed (`scrollcraft/builds/studio-rowan/sticky-audit.mjs`).

**1. Pinned sections carried vertical padding.** Sticky is constrained by its
containing block, which is the section's *content* box, so 99px of padding stole
from both ends of every pin. Measured stage position across an act:

| act | before | after |
|---|---|---|
| ch2 | +99 … −128 | 0 … 0 |
| ch3 | +70 … −128 | 0 … 0 |
| ch5 | +16 … −74 | 0 … 0 |

The stage had not stuck when the act began and had already slid away before it
ended, so the tail of the spin played on a frame that was sliding off. Pinned
sections now carry no vertical padding; the breathing room lives on the spread
inside the stage.

**2. `ch5` overflowed its stage** by 22px, which `overflow: clip` made
permanently unreachable. The press spread now fits.

**3. A `count` device restaled the geometry of every act below it.** Chapter
one's height changed 1131px → 1102px as its counters ran, because the growing
number re-sized its grid column and rewrapped the prose beside it. The engine
measures acts on mount, resize and `fonts.ready`, never on content-driven
height changes, so every pinned act below was left 29px from where the engine
thought it was. Fixed at the cause (`minmax(0, 1fr)` tracks, so the number
cannot size its column) and backed by a `ResizeObserver` that calls
`sc.layout()` when the document height moves. Verified not to loop: zero calls
while idle, two across a full scroll pass.

Both previews now pass a continuous-scroll check in which every pinned stage
must sit at exactly 0 for the whole of its pin, desktop and mobile.

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

## The peak folded back into chapter three

Chapters three and five read as interrupted by four, because they were: the
slipper's case ran claims → *company philosophy* → repetitions. Moving the
setup line was not enough. The mission is not about the slipper, and it sat in
the middle of the argument that is.

The peak is now part of **chapter three**, so the case runs unbroken from the
product through the claims to the repetitions, and the mission follows it. That
is also the order the approved copy has: in prototype 06 the whole slipper
argument is one section and the mission comes after it.

What changed structurally, and what did not:

- The peak is still its own **act** (`pin`, span 4.6, the largest on the page).
  Only the *chapter* merged: same folio, no new chapter title, one ground held
  across all four of chapter three's sections.
- "And again." became an `h3` turn inside chapter three rather than an `h2`
  chapter heading, so the heading order stays h1 → h2 → h3 with nothing skipped.
- **The authored silence moved.** BRIEF.md records it as act 5, the mission,
  immediately before the peak. Here it is the turn screen — "Most importantly,
  they can be washed and used again. / And again." — which is near-empty and
  sits directly before the reprint. The requirement (the act before the peak is
  quieter) still holds; the act providing it is different, and BRIEF.md is now
  out of date for this build. Preview 1 still follows BRIEF.md as written.
- The feeling curve gains a beat after the peak: release → reflection (mission)
  → resolution (colophon), rather than ending on the peak's tail.

**Preview 1 cannot take this change**, and that is now a real difference
between the two proposals rather than an inconsistency. Its signature move is
the wash line, which steps left through the peak and resolves at the collapse.
Putting the mission between those two would strand the divider mid-travel with
the argument paused around it. In split stage the peak and the close are one
mechanism; in chaptered editorial they are separate chapters, so the mission
can move.

## The turn screen folded into the press

The standalone "Most importantly… / And again." screen was a mistake of the
same kind as the one before it. It put the setup line and the first repetition
on their own screen, then that screen scrolled away and the press began its
cascade from scratch underneath. The repetition broke and restarted, with dead
space in the join, and by the time the stack was framed the readout was already
around 13 — so the number never lined up with what you had actually watched
happen.

The line and the first "And again." now live **inside** the press, at the head
of the stack. The heading *is* impression one: it is real markup styled to
match the generated impressions exactly, and the cascade continues from it
rather than starting again below it. The readout is `impressions shown + 1`, so
at the top of the act it reads 1 with one line on screen, and it agrees with
the page from the first frame to the last.

That also removed a section (twelve to eleven) and 1.3 viewports of scroll.

## The full stops now stop

They did not before, and the earlier gap measurement could not see it. An
intertitle was a tall sparse **flow** section: the line drifted up through the
frame and left, exactly like any other content. The page never paused, so the
emptiness read as a void rather than as a held statement. An ink-coverage scan
counts what is on screen; it cannot tell whether the screen is moving, which is
the whole difference between a full stop and a void.

Each intertitle is now a short **pinned** act. Measured hold, at 1440x900:

| span | line held still for | page length | dead scroll |
|---|---|---|---|
| flow (before) | 0 | 17.5vh | none |
| 1.4 | 0.29 viewports | 19.6vh | none |
| **1.9 (shipped)** | **0.69 viewports** | **21.6vh** | none |
| 2.4 | 1.09 viewports | 23.6vh | not tested |

At 1.9 the reader scrolls two thirds of a screen and the line does not move.
One statement, held, never crossfading into another: this grammar bans pinned
crossfade type acts, and a held page-turn is not one.

### What is left, and why it is not tunable

Sparse scroll splits into two kinds, and only one is a fault:

- **sparse and held** — a full stop. 48 samples across the page.
- **sparse and moving** — a void. Worst runs: 0.72, 0.61 and 0.56 viewports.

Those remaining voids are the **stage sliding in and out**, not the line inside
it. A one-viewport stage is mostly empty wherever the line sits, so entering a
stop means crossing half an empty stage and leaving one means crossing the
other half. Biasing the line to the upper third was measured and changed the
void lengths by **exactly nothing**.

So the levers left are structural, not numeric: fewer intertitles, or shorter
spans, and both trade against the thing they were added for. Preview 1 measures
no sparse-and-moving runs at all because it has no intertitles.

### The cost

The page is now **21.6vh**, against preview 1's 14.8vh. Roughly 2.8 viewports of
that is a single line held on screen. That is the grammar working as intended,
but it is the expensive version of it, and it is the number to look at if the
page feels long rather than deliberate.

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

## The full stops now land where the reading is

Audited on request, because the page read as though the pauses were in the
wrong places. They were, and it is measurable. `pace.mjs` walks the page and
records, per section, how much scroll passes while that section's own copy is
stationary on screen. Before:

| section | act | words | held |
|---|---|---|---|
| One, intertitle | pin 1.9 | 3 | 0.69vh |
| One, the Alps story | **flow** | 58 | **0** |
| One, the figures | pin 2.4 | 98 | 1.33vh |
| Three, the claims | pin 2.6 | 75 | 1.60vh |
| Three, the press | pin 4.6 | 58 | 3.56vh |
| Four, intertitle | pin 1.9 | 2 | 0.69vh |
| **Four, the mission** | **flow** | **121** | **0** |

The page was spending its stillness on its emptiest screens. The mission
carries more copy than any other section and was the only multi-paragraph
chapter that never stopped; the two-word intertitle directly above it held for
0.69 viewports. "Prose wants to be read past" was the reasoning for flowing the
Alps story, and it is not wrong, but it was applied to the two densest screens
on the page and nowhere else.

Both are now pinned. Held: the Alps story **0.98vh**, the mission **1.80vh**.

### The colophon was the only chapter without a full stop

A second measure, `coresident.mjs`, counts frames where two chapters' copy are
readable at once. In this grammar that should be zero, and everywhere it was,
because a pinned intertitle clears the screen between chapters. Everywhere
except one join:

```
before:  19/802 frames (2.4%)  ->  0.53vh  [Four + Colophon]
after:   0/986  frames (0.0%)
```

The colophon had no intertitle, so the olive ground and the closing headline
arrived underneath the mission's last paragraph. It has one now — "Work with
us.", the name the folio was already using — and the colophon's headline
dropped to `h3` to match every other chapter's shape. Zero on mobile too.

### A stage fit that no breakpoint would have caught

Pinning the mission surfaced the older lesson again. Its spread clears a
1440x900 stage and does not clear a 1366x768 one, which `overflow: clip` makes
unreachable — and no width breakpoint sees that, because it is a property of the
viewport's *height*. So `page.js` now measures: if a spread will not fit a
stage, its act is demoted to `flow` and it gets its padding back. One `unpin()`
path serves both this and the phone list, so the two leave the page in the same
state.

**The guard has to measure the built page.** First written, it ran before
`buildStack()` and so measured the press with an empty stack — a spread that is
not the spread. `buildStack()` now runs before the guard; it touches no engine
state, so it is free to run that early.

Chapter one's story pins everywhere, including 375x667, with room to spare.
The mission pins at 1440x900 and flows below that.

### The peak was clipping its own last line

Found while extending that guard to `ch5`, and it predates every change here.
The closing lines — *"They're better for guests. Better for businesses. Better
for the planet."* — were revealed and then sat **outside** the stuck stage,
behind `overflow: clip`, where no amount of scrolling reached them:

| viewport | visible content outside the stage |
|---|---|
| 1440x900 | none |
| 1366x768 | 54px |
| 1280x720 | 67px |
| 1024x700 | 76px |

The earlier note records this spread as fixed at "922px inside a 900px stage".
That was true, and only ever true at 1440x900 — the one size it was measured at.

`ch5` is now in the guard, so it flows where it cannot fit. The peak also lost
14px of padding and margin gaps, which is not cosmetic: without it the guard
measures 910 at 1440x900 and flows the signature move at the size the page is
composed for. Pinned at 1440x900 and above, flowed below. No visible content
sits outside any stage at any size checked, phone to 1512x982.

**On measuring this at all.** Two attempts at it produced false positives worth
recording, because both looked authoritative:

1. `scrollHeight` against the stage. A spread with `height: 100%` reports the
   stage's own height, so it cannot see its own overflow. This is where the
   "48px at 1366x768" figure came from, and it was measuring nothing.
2. Element rectangles against the stage rectangle, without checking visibility.
   A `data-sc-cue` element sits *below* its final position while it waits to be
   revealed, so every cued block reads as clipped before its cue fires. And
   opacity does not inherit as a computed value: a `<span>` inside an unrevealed
   `<p>` still computes `opacity: 1`, so filtering on the element's own opacity
   does not help. Effective opacity has to be walked up the ancestors.

The check that finally held: walk the whole pin, and count content as clipped
only where it is **effectively visible** and outside the stage.

### The cost

**23.3vh -> 28.4vh** at 1440x900. Two pinned chapters and one new intertitle, so roughly
five more viewports of scroll, and the length note above applies with more
force than it did: about 4.6 viewports of this page is now a single held
screen. If the page reads long, this is the first place to trim, and the
cheapest single cut is the mission's span rather than any of the intertitles.

## The press printed its echo before its setup

Found by eye, not by the harness, and it is the sharpest example yet of what
the harness cannot see. In the peak, `.press__setup` carried a cue and
`.press__first` ("And again.") carried none. **A cue is clamped to p=0 for the
whole of a pinned stage's entry slide**, so the setup was held at zero opacity
for a viewport of scrolling while the uncued heading below it painted at full
strength. Measured:

| position | setup | "And again." |
|---|---|---|
| entry slide | 0.00 | **1.00** |
| p = 0.00 | 0.00 | **1.00** |
| p = 0.10 | 1.00 | 1.00 |

The reader got the echo a full viewport before the sentence it echoes. The copy
order above went to some trouble to put "...washed and used **again**." directly
against "And **again**." precisely so the hinge would land, and the reveal order
was undoing it.

The line that leads an act arrives *with* the act, so `.press__setup` is no
longer cued at all. "And again." is cued instead (0.05..0.10), and it is now the
first thing on that screen that moves. The cascade starts at 0.12 rather than 0,
because started at 0 it raced its own first line: four impressions were already
down before the setup was legible. The readout is cued with impression one, so
it never counts something that is not on screen.

**The general rule, worth carrying to any build on this engine:** on a pinned
act, an uncued element is visible for the entire entry slide and a cued one is
not. Cueing is therefore not just timing within the pin, it decides what the
reader sees *before* the pin — and the copy that sets up an act must be on the
uncued side of that line.

## Open items

Everything still open on preview 1 applies here, because the copy and the
assets are the same:

1. The **120,000,000 figure ships uncited**, on an explicit decision, for this
   preview only. Marked in the markup with a visible note.
2. The **treaded-sole claim has no visual evidence** (no sequence B).
3. Contact is `hi@studiorowan.com`; the holding page uses
   `info@studiorowan.co.uk`.
4. Raptor V2 Premium unlicensed; Outfit Light stands in behind `--display`.
5. No Instagram handle supplied.

One item specific to this build: the folio uses spelled-out chapter words
("One", "Two") rather than an `01 / 06` counter, which scroll-craft bans
outright. If a numeral folio is wanted it should stay a book folio and never
become an x-of-y progress readout.
