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
| Why it holds up — the claims, and the poolside frame | Ivory | `reveal` | 2.6 |
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
builds its 29 impressions with the counter tracking them.

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

One item specific to this build: the folio labels chapters by their job in the
argument ("The problem", "The solution") rather than by position, and it is now
the only place that naming appears. It is not a
counter and should not become one — scroll-craft bans an `01 / 06` x-of-y
progress readout outright. If numerals are ever wanted they have to stay a book
folio.

A second item specific to this build: only **one** ask persists past the title
page. If both should, the standing pill is the place to grow — a pair, or a
two-item cluster that picks up its ink from the ground, never a full-width bar,
which this grammar bans. Note that at 375px a second pill will not fit beside
the first at the foot, so that change is a stack, not a row.
