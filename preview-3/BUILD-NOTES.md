# Studio Rowan preview 2 — notes

The second design proposal. Lives at `/preview-2/`, `noindex`, alongside the
holding page and preview 1. Nothing at the root was touched.

Serve the repo root and open **`/preview-2/`** with the trailing slash.

**Grammar: chaptered editorial** (uniqueness.md 2.2). Chosen because the ask was
"one thing at a time", and this grammar is built out of exactly that: one dense
asymmetric spread per chapter, each opening under a ruled chapter head, each on
its own ground. Nothing crossfades; chapters hard-cut between grounds.

The full stop between chapters used to be a pinned **intertitle** — the chapter
title alone on an empty screen, held. It is a header now; see *"The intertitles
became headers"* below for the measurement that decided it.

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
| Title page, with the two asks top right | Ivory | `flow` + `in` | flow |
| The hotel slipper — story and figures | Clay | `count` | 3.0 |
| *We thought there had to be a better way.* | Clay | `pin` | 1.5 |
| *So we redesigned them.* | White | `pin` | 1.5 |
| The Never-Ending Slipper | White | `scrub` | 2.6 |
| Why it holds up — the claims | Ivory | `pin` + `in` | 2.6 |
| &nbsp;&nbsp;↳ the poolside frame (its own section on a phone) | Ivory | `flow` | flow |
| &nbsp;&nbsp;↳ **the peak, still the same chapter** | Ivory | **the reprint** | **4.6** |
| Our mission | Hemp | `pin` + `in` | 2.8 |
| Work with us | Olive | `flow` | flow |

The folio still names each chapter by its job — *the problem, the solution, the
proof, the studio* — but the page itself no longer does; see below.

Nine sections, **20.6vh** total at 1440×900, clear of the recorded 13.6–13.8vh
band. It was twelve sections and 23.3vh before the intertitles became markers
and chapters one and the colophon were each folded into a single beat: the same
reading, 5.7 viewports shorter. Six device families, none twice in a row,
exactly one `scrub` (this grammar's limit), peak has the largest span, and
chapter four is quieter than it.

## The signature move: the reprint

Chapter five prints itself again, and again. Each impression is set smaller and
tighter than the last and stepped across the sheet, so the repetitions cascade
like proofs coming off a press. Thirty impressions, the first at 9.4vh, each
0.87 of the one before, so the run occupies roughly 69vh and the last
impressions stop being readable and become texture. That is the argument made
of the page's own material: one pair, over and over, until the repetition is
the whole page, and the texture at the bottom is the rhyme with 70,000.

The margin carried the impression number and one line, *"One pair. Every
impression is one wash."* Both have since been cut — see *The count came off
the press*, below. The margin is now the turning-slipper loop and the tail
copy, and the cascade is the only reading of how many.

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

**Local. This build is self-contained.** `./spin` (87 frames at three tiers,
7.6 MB), `./media` (1.6 MB) and `./og.jpg` are its own, so `/preview-2/` can be
moved, deployed or deleted without touching `/preview/`, and vice versa.
Verified by hiding `/preview/` entirely and reloading: 95 requests, none
leaving `/preview-2/`, no failures.

The two previews were sharing these by relative path (`../preview/spin/`,
`../preview/media/`) while both were live proposals, which kept preview 2 at
about 60 KB on top of what preview 1 already shipped. That coupling was the
only thing left joining the two builds, and it meant neither could be retired
without breaking the other.

**The cost of the split is real: about 9.2 MB, duplicated.** Both copies are
byte-identical and both are tracked. If preview 1 is retired, deleting
`preview/spin`, `preview/media` and `preview/og.jpg` reclaims all of it from
the working tree (not from history). If BOTH proposals are being kept
long-term, the cheaper shape is a shared top-level `assets/` that each build
points at — but neither build is self-contained then, which is the thing this
change was asked for.

`_headers` now gives `/preview-2/spin/*` and `/preview-2/media/*` the same
`immutable` rules preview 1's carry; it previously noted that preview 2
declared no asset rules of its own, which is no longer true.

The remaining cross-build dependency is not a build dependency at all: both
previews load `/fonts/*` by root-absolute path, which is site-level and
correct.

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
rather than starting again below it. (The readout that used to track this was
later cut; the cascade is the count.)

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
down before the setup was legible.

**The general rule, worth carrying to any build on this engine:** on a pinned
act, an uncued element is visible for the entire entry slide and a cued one is
not. Cueing is therefore not just timing within the pin, it decides what the
reader sees *before* the pin — and the copy that sets up an act must be on the
uncued side of that line.

## Feedback round two

Five notes came back on this build. Four of them are the same note in different
places — *this beat is a whole screen and it should be a header* — and the fifth
is the one thing the grammar had deliberately left out.

### The intertitles became markers inside the sections

Every chapter opened with a pinned intertitle: the title alone on an empty
screen, held dead still for a little under half a viewport, with a viewport of
stage sliding in before it and a viewport sliding out after. Five of them.

Measured as page length that is **9.5 viewports of scroll whose only content is
a chapter title**, on a page whose densest screens — the mission at 121 words,
the peak with its margin column — were being trimmed to the pixel to fit inside
a single stage. The page was spending its space on its emptiest screens.

The first fix was a ruled head across the top of each spread. That solved the
length and introduced a different problem: **a full-width rule with a title over
it is a masthead**, and a masthead is page furniture that the chapter happens to
sit under. Five identical bands, one per chapter, each announcing its section
rather than belonging to it — and each one a separate grid row, which meant a
separate wrapper (`.chapter` as a two-row grid) between the stage and the
spread.

So there is no band. The marker sits **inside the section's own first column**,
at the head of the same stack as the headline and the copy, on that column's own
spacing:

* chapter one, first in `.spread__lead`, above *"Worn for moments, wasted
  forever."*
* chapter two, first in `.spread__text`, above the lede
* chapter three, first in the claims column
* chapter four, first in `.spread--quiet`
* the colophon, first in `.colophon`

The chapter names itself in its own voice and then keeps talking.

**Label over title, not beside it**, and measurably so: set on one baseline a
12.9px label against a 32.4px line leaves ~20px of air above the label and none
below, so the small half hangs low and left off the big one, with 12.6px of gap
doing nothing to separate two sizes that far apart. It read as lopsided because
it was. Stacked, the two parts share a left edge and each gets its own line —
which is what the phone was already doing by wrapping, and it read better there
than it did anywhere the line fitted.

It cannot be misread as an eyebrow running into the title, which is the failure
the folio exists to avoid: the label ends in a colon and is set in the same
micro-caps as the folio and the figure rubrics, so it reads as apparatus rather
than as the first half of a sentence.

The title sits at `--sc-t-lg`, two steps **below** the chapter's own headline —
a marker names, a headline speaks. It was `xl` while the label sat beside it;
stacked, `xl` put two display lines in a row above a third and chapter one read
as "The hotel slipper." *and* "Worn for moments, wasted forever." competing.
At `lg` the three-step hierarchy — micro-caps label, marker, headline — is
unambiguous without needing the ~50px of separation that fixing it by spacing
would have cost.

The wrapper is gone with the band, so the spreads fill the stage themselves
again, exactly as they did before any of this.

Three measurements that came out of it:

* A chapter carries ~50px more inside its stage than it did before it had a
  marker at all. Block padding is `clamp(1rem, 3vh, 2.5rem)` at the head and the
  row gap in a spread is `4.5vh` rather than the `6vw` gutter value doing double
  duty — 80px of leading between blocks in a single-column spread was the
  "too much space" note in miniature.
* The foot padding is larger than the head's, at `clamp(2.75rem, 6vh, 4rem)`,
  and that is not taste. The folio is fixed at the bottom-left of the viewport,
  so a chapter that fills its stage prints its last line straight through it.
  **The peak is the one spread that does not take this clearance**: its
  impressions cascade to the middle of the sheet, not into the bottom-left
  corner, and 45px it does not need is 45px that flows the signature move.
* **The mission needed a tighter row rhythm.** Stacking the marker costs ~27px
  even with the smaller title, and the mission is four blocks in one column —
  marker, headline, the three "changed" lines, 121 words of prose. At the shared
  4.5vh row gap that came to 931px inside a 900px stage and the guard flowed the
  longest read on the page for 31 pixels. `.spread--quiet` takes `3vh` instead
  and clears with ~39px to spare.
* `.spread--claims` needs **explicit** grid placement now that the marker is a
  third item in it, and that placement has to be scoped to the two-column case:
  `grid-column: 2` inside a single-column grid does not clamp, it creates an
  implicit second column. Unscoped, the phone layout collapsed to two columns
  and set *"Why / it / holds / up."* one word per line.

All five chapters still pin at 1440×900. The page is **20.6vh** against 23.3vh
before the intertitles went: 17.6vh of chapters, plus the 3.0 the turn takes to
land on two held screens of its own.

### Chapter one is one chapter again

The story and the figures were two separately held screens, and the split had
put the story's own sentences *inside* the figures — *"It was one of those
numbers that was difficult to forget about"* was sitting under 70,000, and *"So,
once back in the UK, we reached out to hotels and spas"* under 120,000,000. Copy
that is telling a story, set inside a device that presents facts.

So they are one chapter, and the two kinds of writing are separated by column
rather than by screen. The narrative runs continuously down the lead column, all
three paragraphs and the turn. The figures keep the treatment that was working —
display numeral, small-caps rubric, the national figure in ochre — and carry
nothing but a number and what it counts.

Four smaller decisions inside that:

* The figures column reads **70,000, then 120,000,000, then the turn** — the
  numbers, then the sentence that answers them. The couplet sits under the
  figures rather than at the foot of the story column, and that is also the
  only arrangement that puts it *after* the numbers on a phone: the two columns
  stack in source order there, so a turn written into the story column arrived
  before the figures it responds to.
  (Briefly the two figures were held at opposite ends of the column instead, on
  the reasoning that the distance between them was the escalation they
  describe. It read as a movement and it was wrong twice: it set the couplet
  level with the second number rather than under it, and it broke the phone
  ordering.)
* The numbers are set at `--sc-t-2xl`, one step down from the `3xl` they had
  when they owned a screen. They are the chapter's evidence now, not its
  headline — and at `3xl` the eleven nowrap glyphs of "120,000,000" run out of
  their column between roughly 1000px and 1200px wide (464px of glyph in a
  465px column).
* The turn — *"We thought there had to be a better way. / So we redesigned
  them."* — drops to `--sc-t-xl` for the same reason: the headline is the
  chapter's statement and this is the answer to it. Set level with the headline
  it wrapped to three lines, and those two extra lines were 43 of the pixels
  that decided whether the chapter could be held still at all.
* **The turn is not in this chapter at all.** *"We thought there had to be a
  better way. / So we redesigned them."* is two full stops of its own between
  chapters one and two — see below.
Span is 3.0, down from 2.0 + 2.4.

### The colophon is one beat

*"Work with us."* and *"Still paying for thousands of disposable slippers every
year?"* were two screens with a ground change between them, and they are one
thought: the chapter head names the ask and the question is the ask. Set
together, the reader meets the proposition and the reason for it in a single
reading. The olive ground now cuts once, at the colophon, instead of twice.

### The asks, and the one that stands

This grammar bans a fixed bar and it bans a magnetic CTA, and the page had
neither — which left it with no way to act on what it had just argued except the
mailto links in the running text at the very bottom.

Two asks now sit top right of the **title page**: *Get in touch*, and *Request a
sample* in a hairline pill. A hairline, not a filled block: the page is paper,
and a solid slab of accent above the fold would be louder than the headline
beside it.

They scroll away with the title page rather than riding over five hard-cut
grounds. What persists is **the second pill, standing still** — the same element,
same classes, same hairline — which appears once the title page has gone.

This started as a back-to-top chevron and that was the wrong object. A chevron
delivers *navigation* where this page needs *action*: a reader convinced at
chapter three had twelve viewports to scroll before they could do anything about
it. A dropdown was the other candidate and it has the same shape of problem in a
different place — to be legible its collapsed trigger has to read "Contact" or
similar, because nobody clicks a bare glyph hoping for a contact form, and once
the trigger is a word you are hiding two short links behind a click to save
roughly the width of one of them. A dropdown earns its keep at five items.

So: one ask, always there, one tap. *Request a sample* rather than *Get in
touch* — the specific, low-commitment one; the vaguer one is already set in the
colophon's running text and again in its masthead.

Two placements, both measured rather than chosen:

* **Top right above 700px.** Below that the corner is not free: every chapter
  opens with its head on that line, and the longest of them, *"The Never-Ending
  Slipper."*, reaches x=410 in a 600px viewport while the pill starts at 418. At
  700px there is ~70px of clearance and below it there is none.
* **Foot right below 700px**, which is where a thumb is anyway, and one line
  *above* the folio rather than beside it: side by side at 375px the folio's
  chapter title runs to within 10px of the pill.

It retires on the colophon, where both asks are set in the running text a few
lines below it — a pill floating over them is the page asking twice. The
olive-ground ink is kept as insurance for the frames where the colophon is on
screen but hemp still owns it.

Nothing manages the tab order: the hidden state is `visibility: hidden`, which
takes the link out of it already, and the transition steps that property rather
than easing it, so the link is never focusable while it is invisible.

---

## The chapter labels stopped being ordinals

The chapter markers read *One, Two, Three, Four, Colophon*. Two problems with that, and
the second one is the one that matters.

"Colophon" is the correct printing term for a closing note about how a thing was
made, and it is a word this page's audience — hotel and spa operators — has no
reason to know. It was a grammar term escaping into the copy.

The larger one: an ordinal tells the reader *where* they are and nothing about
*what they are getting*. On a feature this long the label slot is the one place
that can carry the argument's shape, and it was spending it on counting. So the
labels name the job each chapter does:

| | Label | Title |
|---|---|---|
| 1 | The problem: | The hotel slipper. |
| 2 | The solution: | The Never-Ending Slipper. |
| 3 | The proof: | Why it holds up. |
| 4 | The studio: | Our mission. |
| 5 | *(none)* | Work with us. |

Two judgement calls in that table, both easy to change:

* **"The proof:"** for chapter three is mine — the brief sketched problem,
  solution and mission, and chapter three sits between solution and mission
  doing the evidence. *The detail:* or *The case:* would work as well.
* **"The studio:"** for chapter four, because *The mission: / Our mission.*
  restates itself. It is also true to what the chapter is: the one place the
  page talks about Studio Rowan rather than the product, which is why the
  masthead's first row is *Studio* too.

The last chapter takes **no label**. Every chapter before it is labelled with
its job in the argument; this one is the studio asking, and a category word in
front of it would be the page describing its own ask instead of making it. The
title page is unlabelled for the mirror reason — it is not a step in the
argument either — so the folio simply reads "STUDIO ROWAN" there, where it used
to read "TITLE | STUDIO ROWAN".

The folio takes the same labels, minus the colons: it reads `data-ch`, which is
kept clean, while the colon is written into the head. Where the label is empty
the separator rule goes with it (`.folio.is-unlabelled`), and the folio is now
keyed on the label *and* the title together — keyed on the label alone, the
colophon would have inherited whatever the title page left there, both being
empty.

### What the longest marker turned up

*"The solution: The Never-Ending Slipper."* is the only marker long enough to
wrap on a phone, and wrapping it cost 25px. That was enough to push chapter two
past its stage — and measuring why turned up something that had been wrong since
before any of this round:

* **The scrub chapter had never fitted a small phone.** At 375×667 its copy,
  plate and caption stack to 800px inside a 667px stage that clips: ~133px lost,
  of which only 25 were the new marker. It was over by ~47px before this round.
  It had been excluded from the stage-fit guard on the reasoning that *pinning
  is how a scrub works at all* — true of the engine's scrub device, and not true
  of this page, which has no `[data-sc-scrub]` or `[data-sc-sequence]` in the
  markup at all. The spin is drawn by hand off `progress('ch2')`, and
  `progress()` computes a flow act's p as readily as a pinned one. So the act
  type was buying the pin and nothing else. Chapter two is in the guard now, and
  flowed on a short phone the whole chapter is reachable and the slipper still
  turns as the reader scrolls.
* **The guard was measuring against the wrong height.** It compared content to
  `innerHeight`; the engine sizes its stage `height: 100vh; height: 100svh`. On
  a phone those are different numbers — `innerHeight` is the *large* viewport,
  the one you get with the browser chrome hidden, and `100svh` is the small one
  — so the guard had been overestimating the stage by roughly the height of an
  address bar and letting that much content clip. Measured in an emulated
  375×667 the two read 806 and 667. It now takes `Math.min(innerHeight,
  documentElement.clientHeight)`, the conservative read, because the two
  failures are not symmetrical: a chapter flowed that could have pinned loses a
  full stop, while a chapter pinned that does not fit loses copy behind
  `overflow: clip`.

After both, nothing changes at 1440×900 (all five pinned) or at
1280×720 (chapters four and five flow, as they always did). At 375×812 and
375×667 the whole page flows, including chapter two.

---

## The label came off the page, and the proof got its evidence

### One line, not two

The chapter marker was a micro-caps label over a title: *THE PROBLEM: / The
hotel slipper.* The label is gone from the page. It named the job each chapter
does in the argument, and that naming now lives wholly in **the folio**, which
is this grammar's designated place for it — one line in the margin, always on,
never inside a heading where it can be read as part of one. The folio reads THE
PROBLEM | THE HOTEL SLIPPER for the whole of chapter one; the page just says
*The hotel slipper.*

On the page the label was a second, smaller thing above the title that the title
then had to be sized around — it is why the title had been pushed down to
`--sc-t-lg`. With the label gone the title is back at `--sc-t-xl` and is simply
the size it wants, one step below the chapter's own headline.

### The proof spread

The claim list is an argument about how the thing behaves in a wet, busy, public
place — *waterproof, treaded sole, designed with wet poolside floors in mind* —
and it was making that argument entirely in words, next to nothing. The poolside
frame from prototype 06 is the evidence for it, so the claims read down the left
of the spread and the photograph carries the right, where the reader can check
one against the other. Argument first, evidence beside it — which is also plain
source order, so the phone stacks it the same way.

The summary paragraph is set **under** the image, as the figure's caption, in
prose rather than in the small caption voice the other plates use — it is there
to be read, not to label.

Under, not over, and that is the measurement rather than the preference: the
slippers sit low and centre-left in the frame, and the only region clear enough
to carry type is the pool water in the top left. Type placed there is legible at
this crop and lands on the slippers at any narrower one — and this grammar keeps
media in its own column with a caption and never bleeds type across it. Under
the image is the version of "well placed" that survives every viewport.

Two mechanics worth recording:

* No `order` juggling: the plate is second in source and second on screen, so
  the phone's stacking order is the reading order — title → claims →
  photograph → summary. (It was briefly set left with `order: -1`, which worked
  but meant the visual and source orders disagreed for no gain.)
* The image ships as WebP at 1402w and 800w, in `preview-2/media/`, keeping this
  build self-contained. No AVIF: there is no AVIF encoder on the machine this
  was built on. At a high device-pixel-ratio a phone will pull the 1402w file
  (123KB) rather than the 800w (49KB); a 1100w step would close that gap if it
  matters.

### One thing that went wrong

Rebuilding chapter three by string index **deleted the entire press section** —
the signature move — because the closing-tag sequence the edit searched for
first occurred after it rather than inside it. It was restored from the last
commit and verified identical to it, character for character, bar the one
`data-ch` value this round had changed. Recorded because the lesson is general:
index-based surgery on this file needs a structural check afterwards, not just a
look at the part that was meant to change. Tag balance and the act list are both
cheap to assert.

---

## Act types are re-decided on resize

Reported as a display bug: on a narrow window, chapter three's summary paragraph
was sliced to one line, its claims list cut off mid-item, and the next chapter's
copy painted over the rest. Reproduced by loading at 1440×900 and dragging the
window to 478 wide — chapter three stayed pinned, with a sticky, `overflow:
clip` stage 850px tall holding 1069px of spread. Everything past the stage was
unreachable.

The cause was a caveat that had been written down and accepted twice in this
file: *"an act type is read at mount, so a window resized short after load keeps
the act it was given; the engine has the same limit."* That is not a caveat. It
is content the reader cannot get to, and the note was describing the bug rather
than the constraint.

So the decision runs again on resize, debounced. Re-deciding means touching
engine state, because the engine reads the act type once at mount too: an act
object's `pinned` is what its `layout()` uses to decide whether to set the
section's height in `vh`, and what its update loop uses to choose the pinned or
the flow progress formula. `sc.acts` is published, so `unpin()` and `repin()`
flip it there — along with the `.sc-stage` class, `.sc-act--pinned`, the inline
height and the `data-sc-*` attributes — rather than editing the vendored engine.

Two details that are load-bearing:

* **The authored configuration is captured before anything demotes it.** A
  promotion has to restore a device, a span and a dwell, and by the time it runs
  the attributes carrying them are long gone.
* **`decideActs()` restores everything to its authored state first, then demotes
  what does not fit.** Measured in the flowed state the numbers are ~80px short,
  because a flowed spread has had its block padding removed — chapters would be
  promoted straight back into clipping. Both passes run inside one task, so
  nothing paints between them.

Verified in both directions: loaded at 1440×900 and dragged to 478 wide, all
five chapters demote and no section loses a pixel; loaded at 375×667 and dragged
to 1440×900, all five promote, the page returns to 20.6vh and the press still
builds its 29 impressions.

---

## The turn is two full stops

*"We thought there had to be a better way."* / *"So we redesigned them."* is the
hinge the whole page pivots on — the sentence where the reader stops being told
about a problem and starts being shown an answer. It was a two-line couplet in
the foot of chapter one's figures column, arriving on one cue and read as a
single block in about half a second. The page never paused on it.

It was then tried as two beats *inside* chapter one, cued apart at 0.50 and 0.75
of the pinned act, so each line landed alone on a screen the act was already
holding still. That worked, and it kept the numbers on screen beside the lines —
but the lines were still furniture at the foot of a column rather than the thing
the page had stopped for.

So each line gets a screen: two short pinned acts, span 1.5, one statement held
dead still for about half a viewport of scrolling. It is the old intertitle
device, taken off the chapter titles — where five of them spent 9.5 viewports
naming things the folio already names — and spent on the one place it earns
something. These two cost 3.0, and the page runs to **20.6vh**.

**The ground changes between them, not at the chapter boundary after.** Clay is
the problem's colour and white is the product's, so the hard cut lands on *"So
we redesigned them."* — on the word that changes the story rather than on the
structural seam a screen later. The folio turns with it, from THE PROBLEM | THE
HOTEL SLIPPER to THE SOLUTION | THE NEVER-ENDING SLIPPER, and chapter two then
opens on a ground the reader is already standing on.

`turn1` and `turn2` are in `MUTABLE`, the resize machinery's list, even though a
one-line statement fits any stage and neither is ever demoted in practice. The
list is the page's only answer to "may this be pinned?", and a section exempt
from it is a section nobody is checking.

---

## The product's name is the main hit

*"The Never-Ending Slipper."* was set at `--sc-t-xl`, one step below *"Worn for
moments, wasted forever."* — the page's product name smaller than the problem it
solves. It is the thing the whole argument is built to deliver, so it is now the
largest line on the page after the title.

Chapter two is also the only chapter that can take the size. Every other marker
has a headline under it to defer to; chapter two leads with a lede rather than a
statement, so nothing is competing.

### Why it is sized to its column instead of to the scale

The name has a shape it has to keep. "Never-Ending" is one word with a hyphen in
it, and a hyphen is a legal break, so **every step on the type scale broke the
line there**: "The Never- / Ending Slipper." at 1440, and three lines —
"The Never- / Ending / Slipper." — between roughly 1100 and 1350. `text-wrap:
balance` actively preferred that break, because splitting at the hyphen is the
most even split available.

So the compound is held together (`.nb { white-space: nowrap }`) and the size is
bound to the measure rather than picked off the scale:

```
font-size: clamp(var(--sc-t-2xl), 5.6vw, 4.9rem);
```

The floor is a chapter headline — whatever else happens, the product's name is
never smaller than the problem it solves, which is where this started. The
ceiling sits just under the 5rem the `3xl` step would have given it.

The text column also changes hands: `.spread--media` was `1fr / 1.15fr` with the
plate as the wider half and is now `1.15fr / 1fr`. The name wants about 650px at
1440 to set "The Never-Ending" whole; the plate is a 16:10 frame that reads
perfectly well at 565px.

Verified by reading back the rendered line boxes, not by eye: at 1920 the name
sets on one line; at 1300, 1150, 1000, 880 and 375 it sets as "The Never-Ending
/ Slipper."; at 800 and 600, where the spread is a single column, it is one line
again. It never breaks inside the compound at any width, and no chapter loses a
pixel to its stage.

---

## The count came off the press

Read on a phone, the press margin stops being a margin. The two-column spread
folds to one, and everything that sat *beside* the cascade falls *under* it —
so the impression count and the line *"One pair. Every impression is one wash."*
arrived immediately after the last "And again.", reading as a caption to the
impressions rather than a reading of them. Worse, it restated in digits the
thing the stack had just spent a full act saying in type: the reader watched
thirty repetitions print, and was then told the number was thirty.

The count was composed for a margin, and the phone has no margin. Rather than
hide it under a breakpoint and leave two builds of the same section to keep in
agreement, both elements are gone at every width. The cascade is the count.

What this bought on the desktop composition, which was not the reason for it
but is worth recording: the press margin now top-aligns with the stack — the
turning-slipper loop starts on the same line as impression one — and the spread
measures 900px inside a 900px stage with nothing clipped. The peak's stage fit
has been the most fragile measurement on this page (see *Act types are
re-decided on resize*); removing ~100px from the margin column gives it
headroom it did not have.

Removed: `.press__count` and `.press__rule` in the markup and the stylesheet,
and the `#impression` lookup and readout write in `printFrame()`. `IMPRESSIONS`
and the cascade itself are untouched.

---

## The breath between chapters, on a phone

In two columns a chapter is a *shape*: the next chapter is a different shape,
and the change of composition does the separating before any spacing has to.
Stacked into one column every chapter becomes the same measure as the one
before it, and the only thing left to say "a new chapter started here" is
vertical space and the change of ground.

`.page`'s padding resolved to about 89px a side on a 812px phone — roughly
178px between chapters, which was not a long enough pause to register as a
break. It was worst at the join from chapter three into the peak, where both
sections are ivory: no colour change, so the gap read as dead space in the
middle of a chapter rather than the end of one.

Under 860px, flowed sections now take `clamp(5.5rem, 15vh, 9.5rem)` — about
122px a side at 812px tall, ~244px between chapters, and about 37% more air at
every screen height we check. The same amount at every join, whether or not the
ground changes, so the pause belongs to the page and not to the palette.

Pinned sections are excluded by selector, not left to specificity:

```css
.page:not([data-sc-act="pin"]):not([data-sc-act="scrub"])
```

A beat's stage *is* the viewport and its one line is composed on the centre of
it; section padding would push that line off-centre, and the `[data-sc-act]`
rule that zeroes this padding sits earlier in the file than the mobile block,
so an unqualified `.page` here would have won and broken both turns. The
attribute is the right thing to test because `unpin()` rewrites it to `flow`:
a section demoted by the phone list or by the measured guard picks the padding
up on its own, and one that stays pinned never does.

Verified at 375×667, 390×844 and 768×1024: the title page still measures
exactly 100vh at every one (its content is short enough to absorb the extra
padding inside `min-height`), both turns stay at zero, and every flowed section
gets the same figure.

---

## The copy stopped arriving one line at a time

Three blocks were choreographed when they should simply have been present. Each
was a set of sentences that argue together, cut into pieces that arrived
separately, so the reader met a thought half-finished and had to scroll for the
rest of it.

| Block | Was | Now |
| --- | --- | --- |
| Chapter two: the lede and its three paragraphs | four cues at `0`, `0.08`, `0.24`, `0.44` | one cue at `0` on the lede, one on `.prose` |
| Why it holds up: the four claims | four wipes at `0.06`, `0.24`, `0.42`, `0.6` | one `data-sc-in` on `.proof` — then, later, a 90ms time-based cascade; see *The claims count themselves in* |
| The press tail: the cost line and the "better for..." lines | cues at `0.5` and `0.68` | no cue at all — it paints with the act, like the plate above it |

Chapter two was the worst of them. Sixty-two words of argument — *it's wasteful,
it's not even good at the job, here is why, so we changed it* — were dealt out
across 44% of the act. The paragraph that lands the point (*"We saw an
opportunity to change that."*) was invisible until the reader had scrolled
almost halfway through a 2.6-viewport section, by which time the paragraph it
answers was old news. Copy this short is one breath.

The claims were the same mistake in a different shape. Four four-word claims are
a **set**: the reader's eye goes down them and compares them, which it cannot do
while the last one is still hidden. Syncing the four wipes was the first fix and
it was still one fix too many — the list did not want an entrance at all. Four
short labels under the heading that introduces them arrive *with* that heading,
so `data-sc-reveal` came off all four `li`s and `data-sc-in` moved from the
`.chapter` header up onto `.proof`, which wraps the header and the list. Moving
it rather than adding it is the point: two `data-sc-in` elements would be two
arrivals that merely happen to be close, and nesting one inside the other would
have had both writing opacity to the same subtree. `ch3` no longer uses the
`reveal` device at all, and the page has no `data-sc-reveal` left on it.

Two mechanical notes, both worth carrying:

- **Cue the container, not the children.** Chapter two's `.prose` carries one
  cue and its paragraphs carry none. Opacity inherits, so the block fades as one
  object. `.press__tail` went the same way first and then lost its cue entirely
  — see below.
- **A cue on a parent and `data-sc-in` on a child both write opacity**, so they
  must not be nested. That is why chapter two's cue went on `.prose` rather than
  on `.spread__text`, which contains the `data-sc-in` chapter header.

What is deliberately untouched: the `data-sc-stagger` blocks in chapter one,
the mission and the colophon. Those stagger *within* a flow reveal, over 70-90ms
— a settling, not a scroll-scrubbed wait, and the reader never has to move to
finish a sentence.

**The press tail then lost its cue altogether.** Collapsing two cues into one
was still a timing for a block that does not want one. The press margin is a
single column of one thing — the pair turning, and what that turning is worth —
and `.plate--small` above it has never been cued. A cue on the tail could only
ever hold the copy at zero opacity for half the act while the thing it captions
sat above it at full strength. Uncued, the whole margin paints with the act and
reads as one object, which is what it is.

That is *not* the same as cueing it at `0`. A cue is clamped to `p = 0` for the
stage's entire entry slide, so a cued-at-0 element still arrives a viewport of
scrolling after an uncued sibling — the trap this build already fell into once
with `.press__setup` (see *The press printed its echo before its setup*).

Verified by driving `ScrollCraft.instances[0].read()` at sampled progress
values rather than by scrolling, which is the reliable way to check cue timing:
in chapter two the lede and the prose go 0 → 1 together within `p < 0.02`; all
four claims report identical `clip-path` at every sample; and the press plate
and tail both read opacity 1 at every sample from `p = 0` to `0.8`. On a phone,
where these sections flow, each block reads fully arrived by the time it is
centred in the viewport.

---

## The claims count themselves in

The four claims have an entrance again — but the thing that was taken out and
the thing that is back are not the same device, and the distinction is the whole
of it.

What was removed was **four scroll-scrubbed wipes across 0.06 → 0.6 of a pinned
2.6-viewport act**: the reader had to keep scrolling — well over a viewport of
it — to finish reading a list of four short labels, and could not compare the
four until the last one had been dragged into existence. What is here now is a
**time-based cascade, 90ms apart, 350ms end to end**, fired once when the list
crosses the observer. Nobody waits for it and nobody scrolls through it; it is
finished in a third of a second whether the reader moves again or not.

That is the same species as the `data-sc-stagger` blocks this build already
keeps in chapter one, the mission and the colophon — a settling, not a wait —
and the paragraph above that calls those "deliberately untouched" is the
argument for this one too.

Three things move per claim, and they are one gesture, not three:

| Part | Motion | Offset from the claim's slot |
| --- | --- | --- |
| the rule above it | `scaleX(0 → 1)` from the left, 780ms | `--d` |
| the label and its line | 14px rise + fade, 620ms | `--d` |
| the icon | 10px rise, `scale(.92 → 1)` + fade, 620ms | `--d + 110ms` |

The rule arriving *ahead* of the words is what makes it read as the list ruling
itself off rather than four boxes fading up: the page is doing in motion what
the hairlines already do in layout. The rules are drawn by pseudo-elements
rather than by the `border-top` they sit on — a border can only fade, and a
fading line has no direction — so the borders stay in the box model to hold the
spacing and go transparent until their line arrives. `.claim:last-child` closes
the list with its bottom rule at `--d + 90ms`, last of everything.

**Not `data-sc-stagger`.** The engine's stagger writes one inline
`transition-delay` per child of the cued element, which can offset the claims
from each other but cannot offset anything *inside* a claim: all four icons
would fire together while their own lines were still 270ms apart. So the delays
are CSS — `--d` per `:nth-child` — and `data-sc-in` on the `<ol>` is a trigger
and nothing else. `.claims[data-sc-in]` neutralises the engine's own opacity and
lift on the container, because a container that lifts while its children lift
is the compounding this build spent a whole section removing.

`data-sc-in` moved back off `.proof` and onto the `.chapter` header, so the
heading and the list are two arrivals rather than a nested pair writing opacity
to the same subtree — the trap named two sections up. The first claim carries
80ms of head room for exactly this reason: on a tall screen the header and the
list cross the observer in the same frame, and without it the h2 and the first
claim would land together.

Reduced motion restates the block on the engine's terms — opacity still carries
the arrival, every position change is dropped, durations fall to 220ms and the
queue collapses to zero, because a 350ms sequence is a sequence the reader has
to wait through. The rules go back to being plain borders there.

Verified by reading `getAnimations({subtree: true})` off the list rather than by
sampling opacity, which is the reliable way to check a time-based cascade: 21
transitions, delays `80 / 170 / 260 / 350` for the rules and labels, `190 / 280
/ 370 / 460` for the icons, and the closing bottom rule at `440`. Held at
`currentTime = 500ms`, the section shows claims one and two settled, three
part-way and four still faint, with each rule shorter than the one above it.

---

## Half a join into "Why it holds up"

A join is made by two sections, and a pinned section contributes nothing to it:
its stage *is* the viewport, so it has no padding to give. For the turn beats
that is correct — their line fades out by `p = 0.16` and the rest of the span is
already air. Chapter two is different. It is the page's only `scrub` act, and a
scrub holds its content in the stage to the last frame: it ends with the spread
still on screen, and the next chapter starts immediately underneath it. *"Why it
holds up."* arrived on half a join.

The reason it survived the breath work is that **it only happens on a tall
phone**. Chapter two is the one content chapter not on the phone-flow list, so
it is demoted by measurement rather than by rule:

| Viewport | Chapter two | Join into chapter three | A normal join |
| --- | --- | --- | --- |
| 390×844 | flows | 253px | 253px |
| 414×896 | stays pinned | 134px | 269px |
| 430×932 | stays pinned | 140px | 280px |

The same page, a different pause, depending on which phone you read it on — and
375×667 and 390×844, the two sizes this build checks by habit, are both on the
correct side of it.

The following section now carries the whole join by itself:

```css
[data-sc-act="scrub"] + .page:not([data-sc-act="pin"]):not([data-sc-act="scrub"]) {
  padding-top: clamp(11rem, 30vh, 19rem);
}
```

Three things about that rule are deliberate. **30vh is exactly twice** the
`15vh` the breath rule uses, so this join measures the same as every other one
rather than merely bigger — 279.6px against 279.6px at 430×932, 268.8 against
268.8 at 414×896. **It is keyed to the attribute**, which means it applies only
when chapter two really did stay pinned: `unpin()` rewrites the attribute to
`flow`, so on a phone where chapter two flows the selector stops matching and
the ordinary pair of paddings makes the join, with no double-up. And the
**specificity is written to beat the breath rule** (0,4,0 against 0,3,0) rather
than to rely on sitting later in the file.

It is scoped to the one act type that needs it. A `pin` beat followed by a
flowed section is left alone on purpose: adding a quarter of a viewport to the
end of a beat that has already faded to an empty stage would be padding dead
space with more dead space.

---

## The phone got its hold back at "Why it holds up"

> **Superseded.** The hold described here was reverted, and `#ch3p` and
> `placePlate()` deleted with it — see *The phone's pause is made by the
> scroller*, below. Kept because the measurements are still the argument for
> why a phone cannot hold a chapter.


Chapter three is written to **hold**. Pinned, the page stops and the four claims
sit still while you read them — that holding is the chapter, not decoration on
it. On a phone it did not hold at all: `ch3` was on `PHONE_FLOW`, so it was
demoted to a flow act and scrolled past like body text. Two rounds of spacing
work went into this join before the actual complaint became clear, and neither
could have fixed it, because the missing thing was never whitespace.

It was on that list for a good reason. A pinned stage is exactly one viewport
and clips what will not fit, and the claims spread measures **1039px against an
844px stage**. But that is a measurement of a spread with the poolside plate
still in it:

| Part | Height at 390×844 |
| --- | --- |
| heading + the four claims (`.proof`) | 549px |
| grid gap | 38px |
| poolside plate (image 280 + caption 147) | 439px |
| the stage it has to fit | 844px |

The claims are not the problem. The plate is, and no amount of trimming fixes
it: even capping the image the way the press's small plate is capped leaves the
spread ~180px over, and the caption is the chapter's summary paragraph, so it
cannot go either. The poolside frame is the *evidence* for the treaded-sole
claim, and the only way to fit it inside the held frame was to reduce it to a
thumbnail on the one screen where it has something to prove.

So on a phone the plate leaves the stage. It moves — the same element, not a
copy — into `#ch3p`, an empty ivory section that sits directly after chapter
three and is `hidden` at every other width. `placePlate()` in page.js owns the
move and runs immediately before `decideActs()` in both places it is called,
because where the plate is *is* the measurement the guard takes. With the plate
out, the stage holds 625px and chapter three comes off `PHONE_FLOW` entirely: it
goes through the measured guard like every other chapter.

Measured after the change — 609/667, 625/844, 584/932 — it pins on every phone
checked, and on a screen too short for even the claims it would flow instead of
clipping, which is the whole reason the guard exists.

Three details worth keeping:

- **It is a move, not a copy.** The image is fetched once, the figure keeps its
  `data-sc-in` observation (`IntersectionObserver` tracks the element, not where
  it sits in the tree), and there is no second `alt` string to keep in agreement
  with the first.
- **Restoring it is an `appendChild` back onto the spread**, which is its
  authored position: `.proof` is the spread's only other child and comes first.
  Verified across a full round trip, run twice — the child order comes back as
  `[.proof, .plate--proof]`, `#ch3p` empties and re-hides, and there is still
  exactly one `.plate--proof` in the document.
- **`#ch3p` carries no `data-ch`.** It is not a step in the argument, it is the
  same chapter continuing, and the folio is hidden at this width regardless.

The join rule from the previous section grew a second selector for this and then
lost it again — see *The held frame had to fill its stage*, below. Extending it
to a `pin` was wrong: a held stage centres its spread, so it already ends in half
a stage of air and pays into the join with that.

---

## The folio comes off on a phone

The folio is a margin note, and a phone has no margin. Fixed to the bottom-left
of a 390px viewport it stops being *beside* the reading and sits *on top of* it,
over whatever line happens to be at the foot of the screen. It had been shrunk
to 10px at this width, which made it small enough to ignore without making it
stop overlapping — the wrong half of the problem.

It is hidden in CSS and deliberately **not** switched off in page.js. The
observer is cheap, and leaving it running keeps the label correct for a reader
who turns the phone into landscape past 860px, where the folio comes back.
Killed in script it would return blank, or naming whichever chapter was last on
screen in portrait. It is already `aria-hidden`, so nothing changes for a screen
reader either way.

Worth noting what this does *not* undo: the pinned spreads still take the
asymmetric bottom padding that exists to clear the folio's furniture. On a phone
that clearance is no longer buying anything, but the spreads that take it are
flowed at this width and have their block padding zeroed anyway, so there is
nothing to reclaim.

---

## The held frame had to fill its stage

> **Superseded.** Both fixes here applied to a mobile pin that no longer
> exists. The distinction it draws between a held act and a scrub is still
> live: it is why the scrub join rule survived the revert.


Giving chapter three its hold back left 927px of empty ivory between the last
claim and the poolside frame at 714×1217. Two causes, both introduced by the
change that gave it the hold:

**The spread was top-aligned in a stage it no longer flowed through.** The
phone's `.spread--claims, .spread--press, .spread--quiet { height: auto;
align-content: start }` was written when all three of those chapters flowed on a
phone — "so there is no stage to fill" is what the comment said, and it was true
when it was written. Chapter three now pins, and that rule parked 594px of
claims at the top of a 1217px stage and left 623px of dead ivory beneath them.

The fix is keyed to `.sc-act--pinned`, not to the act attribute:

```css
.sc-act--pinned .spread--claims { height: 100%; align-content: center; }
```

The class is written by the engine at mount and by `repin()`/`unpin()`, so it
means *this section is holding right now* — exactly the condition that wants a
filled stage. The attribute would have been wrong twice over: it survives on the
no-JS page where nothing ever pins, and it is the thing `unpin()` rewrites.

**And the join rule was doubling a gap that was already too big.** Extending it
from `scrub` to `[data-sc-act="pin"]:not(.beat)` looked right — a pin also
contributes no padding — but it is not the same case, and the distinction is
worth keeping:

> A **held** act pays into the join with its own empty stage: it centres its
> spread, so it ends in half a stage of air. A **scrub** does not — the next
> section starts the moment its last frame does.

So the second selector came off and the plate's host section takes the ordinary
breath. Measured after both fixes, the gap from the last claim to the frame:

| Viewport | Was | Now |
| --- | --- | --- |
| 375×667 | 331px | 159px |
| 390×844 | 472px | 273px |
| 714×1217 | 927px | 514px |

At 714×1217 the remaining 514px is not a gap so much as the bottom half of a
centred held frame — there is 362px above the heading to match it. A 594px block
in a 1217px stage floats, and that is what pinning means; the turn beats do the
same thing with a single line. On the phone sizes the page is actually composed
for, the frame reads tight: 149px above the heading and 146px below the last
claim at 390×844.

---

## The phone's pause is made by the scroller

Three rounds of work went into giving the phone a pinned hold, and the whole
approach was the wrong instrument. A pinned act can only hold what fits one
stage. The stage is 844px. Measured the way the guard measures them — flowed
height plus the ~75px of block padding a spread gets back when repinned:

| Section | Needs | Over an 844px stage by |
| --- | --- | --- |
| `turn1` *"We thought there had to be a better way."* | 57px | — holds |
| `turn2` *"So we redesigned them."* | 30px | — holds |
| `ch2` The Never-Ending Slipper | 855px | 11px |
| `ch4` Our mission | 885px | 41px |
| `ch1s` The hotel slipper | 919px | 75px |
| `ch5` The peak | 1342px | 498px |

The turns are not stops because they are tuned well. They are stops because they
are 57px and 30px — **short by construction**, so they fit any phone. Every
other chapter is a whole spread, and a whole spread never fits a phone. Chapter
three was only made to hold by carrying the poolside plate out of its stage, and
the machinery that did it (`#ch3p`, `placePlate()`, and its resize handling) was
the source of every bug in this stretch: the half join, the top-aligned stage,
the 927px void. `ch2` misses by 11px and `ch4` by 41px, and closing those gaps
would have bought a page that holds in different places on different phones.

**So the pause is made somewhere else.** The scroller is given a rhythm instead:

```css
html { scroll-snap-type: y proximity; }
.page { scroll-snap-align: start; }
```

A flick now comes to REST at the head of a chapter rather than drifting to a
stop wherever momentum ran out. It is a pause made of *where the page stops
moving* rather than of a stage held still, so it costs no viewports, needs
nothing to fit anything, and works identically on a 57px beat and a 1342px peak.
It compounds with the pins rather than fighting them: a snap point at a pinned
section's top *is* its held composition.

`proximity`, never `mandatory` — mandatory would force a rest at every point and
take away the reader's ability to stop mid-chapter on the sections taller than
the viewport. `scroll-snap-stop` stays at `normal`, so one long flick can still
cross several chapters rather than rationing the page out one per gesture. The
engine already uses proximity snapping on its horizontal pan rail; this is the
same instrument pointed down the page.

With the pause coming from the scroller, chapter three goes back on
`PHONE_FLOW`, the plate goes back into the claims spread at every width, and
`#ch3p` / `placePlate()` / `.sc-act--pinned .spread--claims` / `.page[hidden]`
are all deleted. The phone keeps exactly two holds, the two that were never a
problem.

**What deliberately survived the revert:** the scrub join rule. With chapter
three flowing again, chapter two still scrub-pins on a tall phone and still
contributes nothing to the join beneath it — so the rule is load-bearing again
for the reason it was written. Measured at 430×932 after the revert: 279.6px
into chapter three against a 279.6px normal join.

| | Before | After |
| --- | --- | --- |
| Phone page length | 14.2 viewports | 12.3 |
| Phone holds | turn1, turn2, ch3 | turn1, turn2 |
| Desktop | — | untouched, 20.6vh, ch3 still pins 900/900 |

The one thing no measurement here settles is whether the snap *feels* right,
which is the only question that matters about it. Snap is a tactile quality and
it has to be judged on a real phone, not in an emulated viewport.

---

## The folio came off, and took three things with it

The folio was the page's only per-section furniture: one fixed line at the
bottom-left naming the chapter you were in. It is gone at every width, and the
page now carries no running label at all — the ground, the headline and the
order of the argument are what say where you are.

Three consequences, in order of how much they mattered:

**The chapter observer survived it.** The observer that drove the folio was also
doing the standing ask's handoff at the colophon — when olive wins the screen,
the pill retires because both asks are set in the running text a few lines
below. That logic stayed; only the folio half was cut. Verified at the colophon
after the change: `on-dark` true, pill opacity 0, visibility hidden.

**The block padding went symmetric.** Pinned spreads carried an extra ~27px at
the foot purely to clear the folio, which a chapter filling its stage would
otherwise set its last line straight through. With no furniture in the frame the
clearance is dead weight: content centred in a stage is now actually centred,
and the stage budget gets 27px back.

**Which promoted chapters nobody asked to promote.** That reclaimed 27px tipped
`ch2` — 11px over an 844px stage — into fitting, so it started pinning on a
390px phone, and `ch1s` was already pinning on a 430×932 one at 919px against a
932px stage. Both are the same fault: a page that holds in different places
depending on which phone you are holding. `PHONE_FLOW` is now every content
chapter:

```js
var PHONE_FLOW = ['ch1s', 'ch2', 'ch3', 'ch4', 'ch5'];
```

which states the rule plainly instead of leaving it to a measurement: **on a
phone, the only things that hold are the two turns, because they are the only
two short enough to hold anywhere.** Verified at 375×667, 390×844 and 430×932 —
`turn1` and `turn2` at all three, nothing else.

With `ch2` never scrub-pinning at this width, the doubled join rule finally had
nothing to do and came out too. Both sides of every phone join are flowed
sections paying half each.

### Snapping had to come off the held acts

The snap points went on every `.page`, which was wrong for a pinned act. A held
act is much taller than the viewport with its content at the top, so coming to
rest anywhere inside one, the nearest snap point is the *next chapter* — and
proximity snapping finishes the gesture for you and cuts the hold short. Snap is
for the sections that do not hold:

```css
.page:not([data-sc-act="pin"]):not([data-sc-act="scrub"]) { scroll-snap-align: start; }
```

For the record, the two turns' own timing, measured at 390×844: span 1.5 gives
**422px** of hold, and the cue `0 1 0.1 0.16` spends 42px fading in, **312px at
full strength**, and 68px fading out. The fade-out is 16% of the hold — quick,
but identical on both turns, so it is not what makes one feel shorter than the
other. The dials, if the hold still reads short: `span` 1.5 → 1.9 buys 0.9
viewports instead of 0.5, and `rampOut` 0.16 → 0.06 turns the exit from a fade
into something closer to a cut.

---

## Ten entrances on one screen

The mission screen carried four `data-sc-in` elements, two of them staggering
their children at 90ms and 70ms: ten separate entrances on one screen. Staggering
everything emphasises nothing — when the heading, the three "changed" lines and
three paragraphs all arrive in sequence, the sequence is the only thing the
reader notices, and *"And it's important that we change too."* arrives last and
reads as the end of an animation rather than the end of an argument.

One `data-sc-in` on the spread now, none on the children. The same fault was on
two more screens and got the same treatment: chapter one's story
(`.spread__lead`) and the colophon. **There is no `data-sc-stagger` left on the
page.**

One trap inside that change: the colophon's masthead had its own `data-sc-in`,
and wrapping the colophon put it *inside* another — two nested reveals writing
opacity to the same subtree. It came off. The page has ten reveals left and none
of them nest.

---

## Nothing is fixed to the viewport any more

Two asks came off: the **standing pill** that followed the reader down the page,
and **"Get in touch"** on the title page.

The pill was the page's one persistent control, and it was already failing on a
phone. Below 700px it moved to the foot of the frame, where it sat on top of the
running text — the mission's closing paragraph read *"that create unneces⟨Request
a sample⟩ and design better alternatives."* The offset it used had been chosen to
clear the folio, and when the folio went the pill was left floating over body
copy with nothing to relate to.

"Get in touch" was the vaguer of the title page's pair, and it is already set
twice in the colophon — once in the running text and once in the masthead. On
the title page it was a second, softer ask competing with the specific one
beside it.

So the page asks **once at the top and once at the end**, and the end is where
the reader has a reason to answer:

| Where | Ask |
| --- | --- |
| Title page | *Request a sample* |
| Colophon, in running text | *get in touch* / *request a sample pair* |
| Colophon, masthead | `info@studiorowan.co.uk` |

**The page now has zero `position: fixed` elements.** Measured at 390×844 and
1440×900: nothing rides over the grounds at all. That is the grammar's own
position — *no fixed bar* — arrived at completely rather than partially.

### What this deleted downstream

Removing the pill emptied two things that were only still alive to serve it:

- **`syncAsk()` and its scroll listener.** The pill appeared past 0.75 of a
  viewport and retired on the colophon; both rules go with the element.
- **The chapter observer.** It had already lost the folio and was kept solely
  for the colophon handoff. With no pill to hand off to, the whole
  `IntersectionObserver` over `[data-ch]` is gone, and `page.js` section 1 with
  it — the remaining sections renumber to reprint / spin / loop.

The `data-ch` and `data-ch-t` attributes went with it — eighteen of them across
nine sections. They had no consumer left, not even as a selector, and they were
the last record of the chapter naming: *the problem, the solution, the proof,
the studio*. That naming is now nowhere in the build except in these notes.

It is worth being explicit that this was a deliberate deletion rather than a
tidy-up, because the naming was a real piece of editorial work — it replaced
ordinals precisely so the folio would say what each chapter was *for* rather
than where it sat. The folio is what gave it somewhere to be said. With no
folio, the labels were data addressed to nobody.

---

## The turn was cued, so it flashed

*"So we redesigned them."* read as a blink: you scrolled, the line appeared, and
it was gone. Two rounds went looking for the cause in the wrong places — first
the fade-out's length, then the scroll-snap that had just been added. It was
neither. It was the cue.

**A cue is clamped to `p = 0` for the stage's entire entry slide.** A pinned
stage is on screen for a viewport of scrolling before the pin engages and a
viewport after it releases, and for both of those the cued line sits at opacity
zero. Measured at 390×844 before the fix:

| | |
| --- | --- |
| Scroll spent on the beat | 2110px |
| Line on screen for | **422px — 20% of it** |
| Of which at full strength | 312px (0.37 viewports) |

The other 80% was an empty ground sliding in and out. "Flash and disappear" is a
precise description of a line that is absent for four fifths of its own section.

The fix is to take the cue off. Uncued, the line is painted the whole time the
stage is on screen: it rides up into the frame, **stops dead**, and rides off.
The stopping is the full stop — a fade was standing in for a gesture the pin
already performs better.

This is the same fault and the same fix as the press's setup line (*The press
printed its echo before its setup*), and it is the second time this build has
been caught by it, so the rule is worth stating plainly one more time:

> On a pinned act, an **uncued** element is visible for the entire entry slide.
> A **cued** one is not — including one cued at `0`.

The span went 1.5 → **1.9** at the same time. 1.9 is the value the intertitles
shipped at when this device was measured in *The full stops now stop*; at 1.5,
with the cue's ramps, the line was at full strength for 0.37 viewports against
the 0.69 that table recorded as working. Both turns now hold dead still for
**0.9 viewports** — 760px at 390×844, 810px at 1440×900.

| | Before | After |
| --- | --- | --- |
| Line on screen | 422px (20% of the beat) | 2448px (**100%**) |
| Dead still | 0.5 viewports, 0.37 at full strength | **0.9 viewports** |
| Page, desktop | 20.6vh | 21.4vh |
| Page, phone | 12.3vh | 13.1vh |

The 0.8vh both turns cost is the whole price, and it buys the page's two hinge
statements going from barely-seen to unmissable. The clay→white cut still lands
between them, on *"So we redesigned them."*, unchanged.

---

## The figures play; they are not scrolled

70,000 and 120,000,000 were `data-sc-count`, scrubbed across a window of chapter
one's pinned act: the value climbed only while the reader kept scrolling, and
only arrived if they scrolled far enough. That makes the reader perform the
animation. It reads well with a flick and badly with everything else — a
trackpad nudge, a wheel click, a thumb dragged short — and feedback was that the
page felt like work. **A figure is a fact, not a reward for scrolling.**

They now tick once, on their own, over 1600ms when they come into view.

The engine has exactly this behaviour and it could not be used: its
entry-counter path takes only counters that are **not** inside an act
(`!c.closest('[data-sc-act]')`), and both of these live inside chapter one.
There is no attribute to opt a counter out of scrubbing, and the engine is
vendored and never edited — so it is reimplemented in page.js against our own
`data-count-to`, which the engine ignores. Same authoring contract as the
engine's: write the target exactly as it should render, commas and all, and the
template drives the formatting. Reduced motion gets the number without the
performance.

The two `.fig` wrappers were uncued at the same time, and for the reason this
build keeps relearning: a cue holds an element at zero for the whole of a pinned
stage's entry slide, so a figure that ticks on entry would have run its entire
count behind an invisible element and been sitting on its final value by the
time it appeared.

Verified by scrolling into view **once** and then not scrolling at all: both
land on 70,000 and 120,000,000.

---

## The scroll budget, trimmed

> **Numbers superseded.** The method stands; the figures were overtaken twice
> over. The page is 13.5vh now, not 18.7 — see *Audited against Apple*.


The feedback was that the scroll is exhausting. The instinct is to make scroll
more sensitive, or to take the gesture and step the page a section at a time.
Both are wrong, and it is worth writing down why, because the reasoning is what
generalises.

**Neither is what the sites this page is measured against do.** Apple's product
pages are native scroll with `position: sticky` and scroll-linked transforms —
structurally what this engine does. They do not intercept the wheel. What they
are disciplined about is two other things: scrubbing only when *the motion is
the content* (a product rotating, an exploded view) and playing everything else
on entry; and keeping the scroll budget honest.

Taking the gesture instead breaks more than it fixes: one trackpad flick fires
dozens of wheel events, so it needs debouncing and then feels laggy or skips; a
wheel notch is not a flick; keyboard paging and find-in-page stop reaching
content; iOS rubber-banding fights it. It also turns the page into a slideshow,
and these sections are not slides — the peak's cascade, the mission and the
colophon are all taller than a viewport, so it would need scrolling *inside* a
step and the model would contradict itself.

And sensitivity is not the fault. **The fault is the budget**, and it is
measurable. At 1440×900 before the trim:

| | Viewports |
| --- | --- |
| Page | 21.5 |
| Spent holding or scrubbing | **12.4 — 58%** |
| Advancing to new content | 9.1 |

More than half the scrolling produced nothing new. Sensitivity would only make
the same 12.4 viewports pass faster while taking control away from the reader.

Four spans came down. Nothing was deleted and no composition changed:

| Act | Span | Held, before → after |
| --- | --- | --- |
| `ch1s` the story | 3.0 → **2.2** | 2.0 → 1.2 |
| `ch2` the spin | 2.6 → **2.2** | 1.6 → 1.2 |
| `ch3` the claims | 2.6 → **1.9** | 1.6 → 0.9 |
| `ch4` the mission | 2.8 → **2.0** | 1.8 → 1.0 |
| `ch5` the peak | 4.6 → **3.6** | 3.6 → 2.6 |

Two notes on why these four. `ch1s` was the cheapest of them to cut *because of
the change above*: its span had been sized partly so the counters could finish
scrubbing — the second ran to `p = 0.5` — and they do not scrub any more.
`ch2` was cut least because it is the one scrub on the page and its motion IS
the content, which is exactly the case that earns a budget. The spin is
normalised (`progress('ch2') × 86`), so it still runs all 87 frames; it simply
turns faster per pixel — 12.4px per frame against 16.6, still clear of where a
scrub goes steppy.

**The peak followed.** It was left alone in the first pass — it is the signature
move, and the one act where the holding *is* the argument — but at 3.6 viewports
it was 37% of all the holding left on the page, which made it the only lever
worth pulling next. `ch5` 4.6 → **3.6**, holding 3.6 → 2.6.

The cascade is specified in proportions of its act (`START = 0.12`, `END =
0.78`), so it scales rather than breaking: the 29 impressions now print across
1544px instead of 2138px — **53px of scroll per impression against 73px**. A
wheel notch is roughly 100px, so the run went from about 1.4 impressions per
notch to 2. It reads quicker; it does not read broken, and the stage still
measures 900/900 with nothing clipped.

| | Start of the trim | After ch5 |
| --- | --- | --- |
| Page | 21.5vh | **17.7vh** |
| Holding | 12.4 (58%) | **8.7 (49%)** |

Under half the page is holding for the first time since the intertitles went in.

None of this changes the phone, where every one of these chapters flows and only
the two turns hold: 13.1vh, 1.8 viewports of holding, unchanged.

---

## The white pushes up onto the clay

> **Superseded.** The band, the plane and the merged single-act version were
> all replaced by a real section overlap — see *Audited against Apple*, below.
> The reasoning about push-to-scroll ratio still holds and is why the overlap
> needed turn1's span raised.


The two turns are the page's hinge, and the ground changing between them is how
the hinge is said in colour — clay is the problem's, white is the product's. As
a plain section boundary that change was something the reader *scrolled past*.
Now the new ground arrives under its own power: a white band rises from the foot
of the clay stage and takes the whole screen, and the line standing on it, just
before the pin releases.

It is the answer pushing the question out, which is what the copy does.

```css
.beat--clay.sc-act--pinned .beat__stage::after {
  content: ""; position: absolute; inset: auto 0 0 0; z-index: 1;
  background: var(--white);
  height: calc(100% * clamp(0, (var(--sc-p, 0) - 0.7) / 0.3, 1));
}
```

**No script.** `--sc-p` is published by the engine on every act element as a
plain number, and this is the first thing on the page to read it from CSS. There
is nothing for the resize machinery to keep in step, and before the engine sets
it — including on the no-JS page — it falls back to `0`, the wipe never happens,
and the hard cut at the section boundary is what is left. Which is where this
started, so the fallback is the old behaviour exactly.

### The two numbers are the whole feel

The band crosses a full viewport of screen in whatever scroll the window buys,
so **the window sets the ratio of push to scroll**:

| Window | Scroll it buys (1440×900) | Screen crossed | Ratio |
| --- | --- | --- | --- |
| `0.82 .. 1` (first try) | 146px | 900px | **6.2 : 1** — a flash |
| `0.7 .. 1` (shipped) | 243px | 900px | **3.7 : 1** |

At 6:1 a trackpad gets through the whole thing in two gestures and it reads as a
glitch rather than a gesture. At 3.7:1 it is still clearly faster than the page —
which is what makes it read as the white *arriving* rather than as a boundary
being scrolled past — but slow enough to watch.

The ratio is the same on a phone, and not by coincidence: both the screen height
and the pinned travel scale with `vh`, so `stage / (0.3 × travel)` is 844/228
against 900/243. Identical by construction.

### The line collapses with it

Painting white *over* a line that stays put is a cover, not a push. The clay
screen has to go somewhere, and where it goes is up and out, so the line
translates by exactly the band's rise off the same `--push` variable:

```css
.beat--clay.sc-act--pinned .beat__stage { --push: clamp(0, (var(--sc-p,0) - 0.7) / 0.3, 1); }
.beat--clay.sc-act--pinned .beat__stage > p { transform: translateY(calc(var(--push) * -100svh)); }
.beat--clay.sc-act--pinned .beat__stage::after { height: calc(100% * var(--push)); }
```

Reading both off one variable is what makes them one motion rather than two
effects that happen to agree. Measured at 1440×900 — the line travels exactly
as far as the band rises:

| `p` | band | line Y in the stage |
| --- | --- | --- |
| 0.70 | 0px | 368 (centred) |
| 0.80 | 300px | 68 |
| 0.90 | 600px | −232 |
| 1.00 | 900px | −532 |

So the clay left on screen is a band that collapses, the line is carried out of
the top of the frame at `push 0.59` (`p ≈ 0.88`), and the last of the clay is
squeezed out behind it. Leaving the line standing would have put *"We thought
there had to be a better way."* on white — the product's colour — and the cut is
supposed to land on *"So we redesigned them."*

`svh`, not `vh`, because `svh` is the unit the engine gives the stage its height
in. On a phone the two differ by the browser chrome and the line would drift off
the edge it is supposed to be standing on.

Reduced motion drops the band and leaves the line where it was put: a ground
that moves is still motion, and so is a line leaving the frame.

### The bug that made it look like nothing happened

The first version gave the stage `position: relative`, to be the containing
block for the absolute band. `.beat--clay.sc-act--pinned .beat__stage` is
**(0,3,0)** and the engine's `.sc-stage { position: sticky }` is **(0,1,0)**, so
it won: the stage stopped sticking, the beat stopped pinning, and the whole turn
scrolled past as ordinary content. The band was still computing its height
correctly, which is the worst kind of broken — every number checked out and
nothing worked.

It was not needed at all. `sticky` is a positioned value and is already the
containing block for absolutely positioned descendants.

**The general lesson for this file:** anything written against `.sc-stage`,
`.sc-act--pinned` or any other engine class is written *against the engine*, and
the engine's own declarations are one class deep. They lose every argument by
default. Before adding a property to an engine-owned element, check whether the
engine already sets it — and whether it is load-bearing.

---

## Audited against Apple, and what came out

The feedback was that a gentle scroll "doesn't move the needle" — that getting
from the mission to the colophon was tiring unless you knew to flick. Rather
than guess at what the reference sites do, apple.com/macbook-pro was measured
directly. Five rules came out of it, and they are not the ones expected.

| | Measured on Apple | |
| --- | --- | --- |
| Scroll | Native. No Lenis, no Locomotive, no GSAP ScrollTrigger, no transformed fake-scroller, html/body overflow visible | they never touch the wheel |
| Mechanism | `position: sticky` + JS. **Zero** scroll-driven CSS animations | same instrument as this engine |
| Holds | 0.6, 0.9, 1.2, 2.0, 2.8, **3.0** viewports | LONGER than this page's |
| Inside a hold | 14 and 8 elements mid-transform or mid-fade, 6 and 30 images, video | **never a still frame** |
| Media | 2.6–5s clips, `autoplay: false`, muted, triggered on entry | one caught parked at t=4.03 of 4.0s |
| Share of page held | 40% | |

**So "Apple keeps it short" is wrong.** They pin more than this page and for
longer. The thing that separates them is that a pinned frame is never static —
there is always something to watch. Which makes the rule:

> Never hold a still frame. If nothing changes across a hold, do not pin it.

### Three chapters failed that and were unpinned

`ch4` the mission, `ch1s` the story and `ch3` the claims were all pinned and all
still. The mission was the worst: 1800px from its arrival to the colophon's, of
which 900px — half — was a pin with nothing moving. 36 trackpad nudges, 18 of
them on a frozen screen. Its content is 756px against a 900px viewport, so it
already fits a screen and never needed holding to be read in one.

`ch1s` is worth a note on cause: its hold only became static when the figures
moved from scrolling to ticking on entry. One change created the other.

| | Then | Now |
| --- | --- | --- |
| Page | 21.5vh | **13.5vh** |
| Held | 12.4vp (58%) | **5.6vp (42%)** |
| Mission → colophon | 1800px, half frozen | 965px, none frozen |

42% against Apple's 40%, and every remaining hold earns itself — verified by
sampling every descendant's transform and opacity at five points across each:

| Hold | Span | What moves across it |
| --- | --- | --- |
| `turn1` | 1.2vp | the line riding up, turn2 climbing over it (see the correction below) |
| `ch2` | 1.2vp | canvas pixels change between p 0.15 and 0.75 — 87 frames scrubbing |
| `ch5` | 2.6vp | 4 impressions at p 0.2, 25 at p 0.7 |
| `turn2` | 0.3vp | the line lands; too short to be a screen where nothing happens |

A warning for anyone repeating that audit: `ch2` and `ch5` first measured as
static and are not. Their motion is rAF-driven, and rAF is throttled when the
browser pane is hidden, so the probe saw nothing move. Sampling with 2.6s waits
found both.

**And a correction: `turn1` was passed when it should not have been.** The probe
sampled at p 0.1, 0.3, 0.5, 0.7, 0.9 and reported motion in 3 of 4 steps, which
looked like a pass. Two of those samples were inside a still window at the front
of the hold, and a coarse sweep found it: **475px — 0.53 of a viewport — with
nothing visibly moving.** Ten gentle scrolls, five wheel notches, no response.
Exactly the fault the audit was run to find.

The cause is structural rather than an oversight. The overlap only becomes
visible once the incoming stage has climbed into the frame, so any hold longer
than the slide has a dead patch at its front, and the still window is
`hold - viewport`. `turn1` went 2.5 → **2.2**: the hold is 1080px, the slide is
still a full viewport, and the still window is 180px — about two notches, so one
ordinary scroll carries the reader into the motion. Measured after: 190px at
1440×900 and 140px at 390×844.

A first sweep reported the still window as 25px and was wrong: it watched the
incoming stage's `getBoundingClientRect().top`, which changes from the very
start of the hold while the stage is still below the fold. Geometric change is
not visible change, and the audit only cares about the second.

**On indicators.** The obvious alternative was a scroll-pressure indicator, so
the reader knows the hold ends. Rejected on this build's own terms: the page now
carries zero `position: fixed` elements, having just had the folio and the
standing pill removed to get there, and these notes ban an x-of-y progress
readout outright. An indicator also tells a reader they are stuck without
unsticking them. The cause of "nothing is responding" is that nothing responds.

### The turn, rebuilt as a real overlap

Three versions were tried before this one: a white band growing by `height`
(layout every frame, cannot be smooth), a full-height plane on a transform, and
a single merged act carrying both lines. The last worked but cost the page a
section and broke the no-JS path — with `--push` unresolved, the second line was
unreachable.

What shipped is the standard pattern: two real sections, `turn2` pulled up a
viewport with `margin-top: -100svh` so its stage climbs while `turn1` is still
stuck. No plane, no duplicated copy, no shared variable — the real section
moving the only way a section can.

It has to be paid for in span, and the arithmetic is the whole reason `turn1` is
2.5. A pin holds for `(span - 1) x vh`. The overlap is ordinary scrolling and
therefore 1:1 — one viewport of screen costs one viewport of scroll — so the
hold has to be longer than a viewport or the slide begins before the line has
settled. At 1.9 the hold was 810px against a 900px slide: 111% of it. At 2.5 it
is 1350px, and the line sits clean for 450px first.

`turn2` is 1.3 and not 2.5 for the opposite reason. `turn1` does the work; by
the time `turn2` is stuck the arrival has already happened, so its own hold is
270px — enough to land, not enough to be the page's last still screen.

**The cost of 1:1.** A real section can only move at scroll speed. The plane
version crossed the screen at 1.85:1 and read as a push; this reads as a clean
arrival. That is the trade, and it was made deliberately.

### Two gotchas worth keeping

- **A `data-sc-in` element has a CSS transition on `transform`.** Anything
  driven from scroll on one of those chases the scroll instead of tracking it,
  arriving late and smearing every direction change. `transition-property:
  opacity` fixes it; opacity keeps its reveal, transform becomes instantaneous.
- **Engine declarations are one class deep and lose every argument.** Setting
  `position: relative` on `.beat__stage` at (0,3,0) beat the engine's
  `.sc-stage { position: sticky }` at (0,1,0) and silently stopped the beat
  pinning at all, while every number still checked out.

---

## The peak's first "And again." was a viewport late

*"Most importantly, they can be washed and used again."* sat alone on screen for
**975px — 1.08 viewports, twenty gentle scrolls** — before the first *"And
again."* arrived. Measured from the setup line becoming readable to
`.press__first` reaching full opacity, at 1440×900.

The cause is the one this build keeps rediscovering. `.press__first` was cued at
`0.05`, and a cue is clamped to `p = 0` for a pinned act's entire entry slide —
a whole viewport of scrolling — before its window even opens. The setup line
above it is uncued and therefore present the moment the act appears, so the
screen showed the sentence and nothing to answer it.

It is uncued now, and arrives with the act as the setup does.

The worry that put the cue there is recorded in *The press printed its echo
before its setup*: the echo must not precede the sentence it echoes. That is a
real constraint and reading order settles it on its own — both lines arrive
together and the reader meets them top to bottom, which is how every other block
on this page now works.

`START` went `0.12` → **`0.04`** with it. The 0.12 existed to wait for
impression one's cue to finish (0.05..0.10); with no cue to wait for it was
281px of a held screen showing one impression and nothing happening, on top of
the viewport of entry slide before it. 0.04 is as early as the cascade *can*
begin: `p` is clamped to 0 for the whole entry slide, so no value here starts
the run before the act is pinned. **Uncueing the first line is the only thing
that can put anything on that screen during the slide** — which is the whole
reason it matters.

Measured after, at 1440×900: both lines present from the moment the act appears;
first generated impression at `p ≈ 0.05` against 0.12; two down by 0.08, ten by
0.30; all 29 still complete by `END` 0.78.

**Not verified on a phone.** `printFrame` runs in page.js's rAF tick, and rAF
stops in a hidden browser pane, so every mobile sample read zero impressions at
every scroll position. That is the measuring instrument, not the page: the
engine's `--sc-p` sweeps 0.18 → 1.0 correctly there, and page.js's `progress()`
computes 0.543 against the engine's 0.5437 at the same point, so the two agree
and the cascade has what it needs. It wants an eye on a real device all the
same.

---

## The turn and the reveal became one act

*Supersedes* The turn is two full stops, Two held beats one overlap, *and the
intermediate round that made the turn a single diagonal section.* There is no
`turn` section any more. The couplet is an overlay on chapter two, and the cut
that used to change the ground now uncovers the product.

### What the audit found

The couplet is **setup**. It is the run-up, not the arrival. And it had a pinned
section of its own, two full-bleed grounds and the most bespoke move on the
page — while the thing the page is actually about turned up as a chapter
heading in the corner of a three-column spread with a lede and sixty words of
prose already beside it.

The page was spending its big move on a sentence and giving the slipper a
paragraph. Three rounds of tuning the turn never touched that, because the turn
was never the problem: its *existence* was.

The page's declared peak is the reprint in chapter three ("And again.", 3.6
viewports) and it stays there. A product reveal and an emotional peak are
different events, and separating them is right — the reveal lands mid-page, the
crescendo comes later. What was wrong was having a third moment, made of copy,
louder than the reveal.

### What replaced it

One act. A sheet of clay covers chapter two and carries the two lines, the
second arriving under the first in the same position. Then the cut takes the
sheet off to the left, and behind it is the slipper.

**The order is the point.** The sheet leaves upward so the frame clears from
the bottom, and the plate is centred in the right-hand column while the name
sits at the top of the left one, so **the object arrives before its name**:

| | |
|---|---|
| p 0 → 0.14 | clay, the couplet assembling |
| p 0.18 → 0.58 | the sheet travels off the top at scroll speed, carrying the couplet with it |
| p ~0.50 | the slipper is fully uncovered |
| p 0.58 → 0.63 | white. The slipper, alone, and nothing else on screen |
| p 0.63 | "The Never-Ending Slipper." lands where the couplet stood |
| p 0.62 → 1.0 | the spin turns |
| p 0.73 | the lede and the prose arrive |

The silent frame at 0.58–0.63 is what makes it a reveal instead of a heading,
and the couplet standing in the spread's own left column on the spread's own
vertical centring is what makes the name land *in its place* rather than
somewhere else on the screen. Measured: the couplet's first line and the
chapter title set within a couple of pixels of the same baseline.

### The three things that had to change underneath

**The stage needed a ground of its own.** A stage is transparent. With the
section driven to clay (see below) the cut was uncovering the *section's*
ground rather than the chapter's — the sheet came off and the slipper was
standing on the same clay it was supposed to be leaving. Caught on the first
frame shot after the fold; `[data-sc-stage]` carries `--white` now.

**The fit guard was measuring the wrong element.** `fits()` took the stage's
first child, which is now the hinge overlay — `inset: 0` when pinned, so it
reports exactly one stage of height at every viewport there is. It would have
answered "yes, it fits" forever and retired the guard without anyone noticing.
It selects `.spread` explicitly now: what has to fit is the chapter under the
sheet, not the sheet.

**The spin was spending its rotation behind an opaque sheet.** It was mapped
from the act's progress, so the first 0.62 — the couplet arriving and the sheet
leaving — turned the slipper through most of its rotation where nobody could
see it, and the reveal uncovered a product already half way round. `SPIN_START`
remaps it: frame 0 is what the sheet uncovers, and the turn is the reader's
from there. The window is 0.38 of a 2.5vh hold, 0.95 viewports of scroll
against the 1.2 the whole act gave it before.

### The cues had to go, all four of them

Caught on a phone screenshot: chapter two opened on a clay block, then **a full
screen of nothing**, then the slipper a viewport further down.

`data-sc-cue` is the engine's, and the engine honours it whether an act is
pinned or flowed. The four reveals were written against the pinned hinge
timeline — the name at 0.48, the lede and prose at 0.60 — and below 860px this
chapter flows, where there is no sheet, no cut and no reveal to stage. The cues
held the heading, the lede and the prose at zero opacity for the first half of
the section's on-screen life while they went on occupying every pixel of their
layout. Nothing was broken; it was simply staging a reveal that does not exist
there, out of a void.

All four are CSS now, scoped to `.sc-ready #ch2:not(.is-unpinned)` — so flowed,
the chapter is simply a chapter, which is the correct reading of it. Measured
after: the spread starts directly under the clay block, no gap, and the section
is 1484px against ~2400 with the void in it.

They key off `--sc-p` rather than `--t`, on purpose: these are positions in the
ACT, not in the lift, and three of the four land after the lift has finished —
measured against it they would sit past 1. Like a cue they are clamped to zero
for the whole of the entry slide, which is what keeps the couplet's first line —
the one thing that must be readable during the slide — uncued and untouched.

### And the flowed section's padding had to move with them

Same shape of fault, found the same way. With the void gone, the phone showed
"The Never-Ending Slipper." set **0px** below the clay band — the chapter's
biggest line jammed against the edge of the section above it.

A demoted section gets its vertical padding back at its own outer edges. But
the hinge is a full-bleed band at the TOP of this section now, so that padding
lands above the clay, where it is white space nobody asked for, and the chapter
underneath starts hard against the band with nothing between them. The join was
being paid on the wrong side of the ground change.

The section keeps none of it and the spread takes all of it: `#ch2` at
`padding-block: 0`, and the spread carrying the same two values the page gives
every other flowed section at each breakpoint. The id is what carries them past
`[data-sc-act="flow"] .spread { padding-block: 0 }`, which is right for every
other chapter, because there the section is still paying it.

Measured after, on a 375 phone: clay band flush to chapter one's clay above it
(0px, and correctly so — same ground), 122px from the band to the chapter's
name, and the ch2/ch3 join back to a normal 258px split 122/136 between the two
sections. The pinned path is untouched: `#ch2[data-sc-act="flow"]` does not
match when the attribute reads `scrub`.

### The cut became a lift, because the cut was the wrong idiom

The first version of this fold kept the previous round's device: a near-vertical
edge leaning nine degrees, travelling right to left, led by a 1.5px cutting
line. It worked. Every frame did what it was supposed to do.

It was still wrong, and the objection is one sentence: **a travelling diagonal
blade is motion-graphics vocabulary, and this page is a printed feature.** The
grammar at the top of the stylesheet says it outright — *hard cuts between
grounds, never an interpolation; `drift` is banned by this grammar for exactly
that reason.* The wipe was the one thing on the page arguing with the page. For
a studio whose whole proposition is considered physical objects, it read as a
software demo.

**What replaced it is not a transition at all.** The clay is a sheet at the top
of chapter two carrying the couplet. It travels straight up and off, *at exactly
scroll speed*, and the chapter underneath is pinned. The reader sees a page of
clay scroll away the way any page scrolls away, and the slipper is standing
behind it. Nothing animates. The only unusual thing in the frame is that the
chapter does not move with it, and nobody consciously notices that.

**1:1 is load-bearing and it is arithmetic.** The sheet travels one stage height
over its window, so that window must be worth exactly one viewport of scroll:

```
window = 1 / (span - 1)
```

At span 3.5 the hold is 2.5 viewports, so the window is 0.40 of it — which is
what `--lift` is. Measured at 900×760: 820px of travel over 820px of scroll,
ratio 1.000. Any faster and the sheet is being pulled off the screen by
something, which is an effect. Any slower and it drags. At 1:1 it is paper
moving.

The sheet and the type on it are **one thing and move as one thing** — same
transform, no fade on the copy, no separate travel. A sheet that slides out from
under its own words is a layer effect, which is the thing this section stopped
doing.

Everything else the fold bought survives the change. The sheet leaves upward so
the frame clears from the bottom, which is simply what scrolling looks like —
and the plate is centred in the right-hand column while the name sits at the top
of the left one, so **the object still arrives before its name**: fully
uncovered by p 0.50, the sheet gone at 0.58, the name at 0.63. That is 250px of
scroll with the product alone on white.

Gone with the wipe: `--lean`, `--over`, `--cut-line`, the skewed `::before`, the
two-box split that existed to make percentage travel resolve against the frame,
the portrait lean override, and the whole paragraph of geometry about a
rectangle's corners swinging into view under rotation. The replacement is
`transform: translateY(calc(var(--t) * -100%))`.

One thing that had to go with it, and would have been a real defect: the old
`prefers-reduced-motion` rule zeroed the couplet's transform. Under the wipe
that dropped a small drift. Under the lift it would have left the couplet
hanging on white while the sheet it is printed on left without it. Nothing is
dropped for reduced motion here now — the sheet moving *is* the sheet
scrolling, at the speed the reader is scrolling it, and a page that held it
still would never show the chapter behind it.

### Cost

| | Two beats | One diagonal turn | Folded in |
|---|---|---|---|
| Sections for the hinge | 2 | 1 | 0 |
| The hinge + chapter two | 4.7vh | 4.0vh | **3.5vh** |
| Whole page | 13.6vh | 12.9vh | **~12.0vh** |
| Moments competing to be the peak | 3 | 3 | 2 |
| Frames where the reveal is the product alone | 0 | 0 | 1 |
| Devices borrowed from motion graphics | 1 | 1 | **0** |

1.2 viewports off the page against where this started. The hinge is 0.3 longer
than the diagonal version was, and that is the 1:1 arithmetic buying the thing
back: a sheet that leaves at scroll speed costs exactly one viewport to leave.
It is the right trade — the big move now belongs to the big reveal, and it is no
longer a move.

### On a phone, none of this happens

Chapter two flows below 860px — its spread is taller than any phone stage, and
that is why it is on `PHONE_FLOW`. There is no stage for a sheet to cover, so
the overlay is simply a full-bleed clay block above a white chapter and the
ground cuts hard at the join. That is this grammar's default join everywhere
else on the page, it is also exactly the no-script fallback, and it costs less
than the turn section it replaces.

The consequence worth stating plainly: **nothing on this page pins on a phone
now.** The turn was the last thing that did. The scroller's snap points make
the phone's full stops instead, which is what the notes above already decided
when the intertitles went.

### Print, reduced motion, and reading order

The couplet is first in the document, before the chapter it sets up, because
that is its order in the argument — a screen reader walks setup then chapter
either way, and the cut is a paint, not a DOM change. Every rule that makes it
one frame is scoped to `.sc-ready` *and* to the pinned state, so both the
no-script page and the phone get the same honest two blocks.

Under `prefers-reduced-motion` the cut stays: it is scroll rather than
animation, and it is the only thing that changes the ground. The couplet's own
travel is dropped.

**Verified** at 900×760 and 1280×820 pinned and at 375×812 flowed, by real
wheel scrolling as well as by seeking: the lift measures 1.000 against scroll,
the couplet assembles and leaves with its sheet, the slipper is uncovered
before its name, the silent frame holds, the title lands on the couplet's own
baseline without reflow when the prose arrives, the spin starts at frame 0 on
the reveal and completes its half rotation by the end of the act, the section's
ground turns at the instant the lift starts, clean white into chapter three's
ivory, no console errors. Flowed: sheet hidden, everything at full opacity,
122px from the clay band to the chapter's name and a normal 258px join into
chapter three. **Not verified on a real phone**, same caveat as everything else
here.

One thing worth a second opinion: the couplet is now the only copy on the page
that exists purely as run-up. Apple would probably cut "We thought there had to
be a better way." entirely and let "So we redesigned them." carry the turn on
its own. That is a copy decision, not a build one, and it is not mine to make —
but the structure above would take it without a single change to the timing.

---

## The peak stopped being driven by scroll

The observation that started it was about chapter three's claims: *those
bullets aren't controlled by the scroll, and that's probably where they should
be.* Correct — and it turns out to be a rule the page was only half following.

**The test.** Scrub the scroll only when scroll position genuinely *is* the
state. Everything that merely needs to arrive, arrives on entry and runs on its
own clock. That is the split Apple uses: the hero object is scrubbed, the
feature lists and spec rows are not.

**The claims pass it and always did.** `flow` act, `data-sc-in` to trigger, CSS
`--d` delays per `:nth-child`. 0.87 viewports, nothing held.

**The spin passes it.** Frame 43 of 87 *means* half-turned; the reader's scroll
is the rotation. That is a real scrub and it stays.

**The reprint failed it.** Twenty-nine impressions appearing one after another
is not a continuous state — it is a staggered list reveal, structurally the
same thing as the four claims, with 29 items instead of 4. It was paying **2.05
viewports of held frame** for a pattern a flow section does for free, and it was
the largest single block of stationary scroll on the page.

It also carried a defect the engine names in its own source. Because the count
was recomputed from progress every frame, **the stack un-printed when the
reader scrolled back up.** The comment on `data-sc-in` says exactly why that
mechanism exists: *"content that re-hides on scroll-up is a defect, not an
effect."* The page's peak had it. The claims never did.

### What it is now

`data-sc-in data-sc-stagger="55"` on the stack, and that is the whole
mechanism. The impressions are still built by `buildStack()` before mount —
they have to be, because both the fit guard and the engine measure this spread
and an empty stack is not the spread. The engine writes one
`transition-delay: i × 55ms` per impression when the stack comes into view,
fires once, and unobserves.

Measured at 1000×780, sampling every 200ms from the trigger: **3, 7, 10, 14,
17, 21, 25, 28, 29** — linear, ~17 impressions a second, last one landing at
1800ms (29 × 55ms + 260ms). Comfortably inside the time the section is on
screen at any ordinary reading pace, and because it fires once, a reader who
scrolls back finds it built rather than half-built. Verified: 29 still lit
after scrolling to the top of the document and returning.

Three collisions with the engine's default flow reveal, all resolved in the
direction of keeping what the peak already looked like:

- **The stepped offset.** Each impression is pushed `i × 0.9ch` across the
  sheet so the stack cascades instead of aligning into a column — *that* is what
  makes it read as a print run rather than a list. The engine's reveal sets
  `transform: translate3d(0,14px,0)` and then `none`, which would have wiped
  it. It survives because page.js writes the transform **inline**, and inline
  beats a stylesheet: the impressions keep their offset and gain no vertical
  travel.
- **The container.** `data-sc-in` is only the observer's handle here, but the
  engine's rule would also fade and lift the stack as one object *on top of* its
  children doing it individually — two animations of the same thing at two
  speeds. `.press__stack[data-sc-in]` neutralises it.
- **Duration.** The engine's default is 620ms. An impression is a proof coming
  off a press: it has been printed or it has not. Back to the 260ms the
  scrubbed version used, with the delay left alone because that is the part
  `data-sc-stagger` writes.

And the inline `opacity: '0'` had to come out of `buildStack()`. Inline beats a
stylesheet in the other direction too — left in, it would have held all 29
impressions invisible for ever.

Under `prefers-reduced-motion` the queue collapses: `transition-delay: 0ms`, so
they print together. It is the one `!important` in that block, and it is there
because `data-sc-stagger` writes the delay inline. A 1.8-second sequence is
exactly what that mode is asking us not to make people wait through, and
nothing is lost — the peak's argument is the repetition on the sheet, not the
order it landed in.

### What it cost, and what it bought

| | Before | After |
|---|---|---|
| Chapter three (the peak) | 3.05vh, **2.05 held** | 1.14vh, **0 held** |
| Whole page | 12.3vh | **9.84vh** |
| Held scroll | 5.1vh — **41%** | 2.5vh — **25%** |
| Sections that pin | 2 | **1** |
| Reveals that re-hide on scroll-up | 1 | **0** |
| Things running per frame | reprint + spin | spin |

`printFrame()` is gone, and with it `lastShown` and the `START`/`END` window.
`MUTABLE` and `PHONE_FLOW` are both down to `['ch2']` — a section authored
`flow` is not a decision anything makes at runtime, so chapter three came off
both lists.

Chapter two is now the only pinned section on the page, and of its 2.5
viewports of hold a full 1.0 is the lift, which travels at scroll speed and
does not read as held at all.

**The peak is still the peak.** Longest read, widest spread, the only place one
line is printed thirty times. What it is no longer is the place the page stops
moving.

**Verified** at 1000×780 and 375×812: the cascade fires and completes on both,
all 29 impressions survive a scroll to the top of the document and back, the
stepped offset and per-impression size and ink are intact, section padding
returns correctly now the pin is gone, no console errors. Not checked: the run
at a deliberately slow reading pace on a real device. The arithmetic says 1.8s
cannot outpace a reader when the section is on screen far longer than that, but
it wants an eye.


## Feedback round three (preview 3)

Seven notes. What changed, and the one thing still open.

**1 + 2. The asks are buttons, and there are two of them, twice.** The single
ask top right was an apricot dot and a line of plain type, and it did not read
as something to press. It is a pill now (`.btn`): *Start with a sample box*
filled, *Get in touch* outlined. The pair stands top right at a compact size
and again, full size, under the lede. Top right comes off under 700px, where
the full-size pair is on the same screen. The filled one goes to `#sample`, the
form at the foot of the page.

**3. "So, where did it all begin?"** heads the story. *"It was summertime in the
Swiss Alps."* is back at the head of the paragraph it opens.

**4. "So we redesigned them." lights a word at a time** on its way up the
screen, the same reading the mission gets (`data-words`, page.js THE LIT
LINES). It used to fade in whole once the pin engaged, 0.08 of the act before
the sheet began to leave, so it appeared suddenly and was already travelling
off the top by the time it had been read. Measured at 1440x900: first word at
300px before the pin, all four lit as the stage comes to rest.

**5. The slipper is behind the sheet, not after it.** The name and the plate
were timed to fade in at 0.59 of the act, after the sheet had cleared the frame,
so the reader scrolled a full viewport of growing white before the product
showed. They are untimed now and the sheet uncovers them as it leaves. The lede
and prose follow as the sheet's trailing edge passes them (0.36 of the act, was
0.69) and the spin starts at 0.50 (was 0.58).

**6. The mission statement is static.** It was sticky, so it slid down the page
with the reader - and, stuck, it stopped moving up the screen, which is the one
thing its lighting measured. That was the "design" delay: the window ended on
the statement's BOTTOM edge reaching 45% of the screen, which a statement stuck
at 18vh never did, so the last two words stayed dark until the column let go.
The window is measured on the top edge only now.

**7. The colophon is the sample box form.** Proposition left, form right,
masthead under both. *"Still paying for thousands of disposable slippers every
year?"* is out of the page for now; it is the natural heading for the savings
calculator if that goes ahead.

### The savings calculator

The top half of the colophon (`#save`), above the ask row (`#sample`), on the
same olive sheet. It was a section of its own on hemp for one round, with its
own display heading and its own button, and competed with the form under it;
now the question is the section's h2, the sample box is an h3 a step smaller,
and the only button is the form's submit.

Two inputs - pairs a year or a month, and price per pair - against the
studio's GBP 0.25 per stay (`OURS_PER_STAY` in page.js, quoted in the
footnote with "our conservative assumptions"). The 10 washes at 60C is what
has been TESTED so far, not the lifespan the GBP 0.25 rests on, so it is a
separate sentence in the footnote and not part of the cost claim. The markup
carries the worked example for the page's own hotel, 70,000 pairs at GBP 1.
Someone already paying under GBP 0.25 is told they would pay more, not shown a
negative saving.

### The calculator is one number and two sliders

Third shape. It was fields beside a table, then the same fields with the
answer shut behind a button; both were forms. Now: a very large apricot figure
that counts up when it comes into view, two sliders that move it live (pairs a
year on a logarithmic track, 1,000 to 500,000, two significant figures; price
a pair, 30p to GBP 3), three supporting figures on a rule, and the assumptions
behind "How we work this out", shut by default. No button, nothing to fill in.
The cost slider stops at 30p, above the studio's 25p, so the saving is never
negative. The year/month switch went: one fewer decision, and a year is the
figure the page has used since its first screen.

The FORM still opens on request: one button in its column, opened by that
button, by either title-page "Start with a sample box" link on the way down,
or by a `#sample` address.

### The form's backend

`/functions/api/sample-request.js`, a Cloudflare Pages Function at the REPO
ROOT (Pages only looks for `/functions` there, so it cannot live inside
`preview-3/`). It emails each request through Resend with the visitor as
`reply_to`. It needs `RESEND_API_KEY` (as a secret) and `SAMPLE_FROM` (a sender
on a domain verified in Resend) set on the Pages project; `SAMPLE_TO` is
optional.

**Switched off for now.** The studio chose to keep the email-app handoff rather
than set up a sending service, so `SAMPLE_ENDPOINT` in page.js is empty and the
page never calls the function. Deployed unconfigured, the function answers 503
and sends nothing. To switch on: set the variables, set `SAMPLE_ENDPOINT` to
`/api/sample-request`.

---

## Open items

Everything still open on preview 1 applies here, because the copy and the
assets are the same:

1. The **120,000,000 figure ships uncited**, on an explicit decision, for this
   preview only. Marked in the markup with a visible note.
2. The **treaded-sole claim has no visual evidence** (no sequence B).
3. ~~Contact is `hi@studiorowan.com`; the holding page uses
   `info@studiorowan.co.uk`.~~ **Resolved** — both previews now use
   `info@studiorowan.co.uk`, matching the live holding page. The guidelines and
   the prototypes still carry the old address.
4. Raptor V2 Premium unlicensed; Outfit Light stands in behind `--display`.
5. No Instagram handle supplied.

A third item specific to this build: **the couplet is the only copy on the
page that is pure run-up.** "We thought there had to be a better way. / So we
redesigned them." now exists to be taken off the screen by the cut. It works,
but the shortest version of this section drops the first sentence and lets the
second carry the turn alone. That is a copy call, and the build takes it
without a timing change if it is ever made.

One item specific to this build: the folio is gone, and with it the naming of
what each chapter does in the argument ("The problem", "The solution"). The
`data-ch` attributes that carried it have been removed too, so the labels now
survive only in these notes — see *Nothing is fixed to the viewport any more*.
If a running label is ever wanted back it has to return as a book folio:
scroll-craft bans an `01 / 06` x-of-y progress readout outright.

A second item specific to this build: only **one** ask persists past the title
page. If both should, the standing pill is the place to grow — a pair, or a
two-item cluster that picks up its ink from the ground, never a full-width bar,
which this grammar bans. Note that at 375px a second pill will not fit beside
the first at the foot, so that change is a stack, not a row.
