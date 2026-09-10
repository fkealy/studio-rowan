# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| Studio Rowan, the Never-Ending Slipper | Split stage | No bar; the divider IS the chrome, carrying both side labels and a depleting readout | `pin` holding a 50/50 split, both headlines readable at once | 8 acts, ~16.8vh, four pinned and four flowing, single peak at act 6 with the largest span and a near-silent act 5 before it | Collapse: divider travels to the edge, one column takes the screen, CTA plate anchored asymmetrically over full-bleed media | **The wash line**: the divider steps left once per wash, 14 discrete steps, counting a real 70,000 down as it goes | Near-white product on two paper grounds (Clay / Ivory), no photography | Mobile rotates the move: bands rather than columns, boundary rises |
| Studio Rowan, preview 2 (chaptered editorial) | Chaptered editorial | No bar; a folio in the margin naming the current chapter, updating as chapters pass | Title page: type on the paper ground, no media above the fold | 12 sections, ~23.3vh, four chapters each opened by a full-stop intertitle that pins and holds its line for ~0.7 viewports; the peak sits inside chapter three so the product argument runs unbroken, and the mission follows it | Colophon and masthead; the ask set as a line of running text, no button island, no magnet | **The reprint**: the peak chapter prints itself 30 times, each impression smaller and stepped, until the smallest read as texture | Paper grounds hard-cutting per chapter (Ivory, Clay, White, Hemp, Olive); media always in a captioned column | Chapters 3 and 5 flow rather than pin on a phone; the scrub stays pinned |

**Gate.** Preview 2 was checked against row 1 and differs on all six dimensions
(grammar, nav, hero device, act shape, close, signature move), so it clears the
four-of-six requirement with margin. The two share a palette, a copy deck and
the spin sequence; they share no structure.

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Split stage** as a grammar, with its two-ground treatment (one ground per
  side, both holding, `drift` unused).
- **A moving divider as the entire nav treatment.** Any later build that wants
  chrome-as-content needs a different mechanism, not a re-tuned divider.
- **The collapse close**: divider to the edge, one column takes the screen, CTA
  in the winning column. A later build closing this way is repeating it.
- **The wash line** itself, including the discrete-step readout depleting a real
  sourced figure.
- **7 acts at ~14.8vh.** Clear of the recorded 13.6-13.8vh band, but now itself
  occupied.
- **Chaptered editorial**, with the intertitle-then-spread cadence and hard
  ground cuts per chapter.
- **The folio as nav.** A later build wanting margin chrome needs a different
  device, not a retitled folio.
- **The colophon close**, with the CTA as running text rather than a button.
- **The reprint**, including the shrink-and-step cascade that ends in texture.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
