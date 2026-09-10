# Studio Rowan — BRIEF.md

**Provenance.** Partly interviewed, partly authored. Grammar and peak were
chosen by the user directly. Topics marked *(authored)* were derived from the
brand guidelines, the approved website copy in `prototypes/06-hotel/`, and the
product reference photograph, then recorded here rather than asked again. They
are open to correction.

Companion document: `docs/build-prompt.md` at the project root, which carries
the full technical spec. This file carries the intent.

---

## The eight topics

**1. Vibe, three to five words, plus references.** *(authored)*
Quiet, exact, unadorned, expensive. References: an Aesop counter display; the
ivory-and-cream product photography of a Japanese bathhouse brochure; a
letterpress specimen sheet where the paper is doing as much work as the ink.
No website references, deliberately.

**2. The scroll journey, section by section.** *(from the approved copy)*
Leave less behind → the hotel slipper and the 70,000 → the Never-Ending
Slipper → why it holds up → our mission → and again, and again, and again →
work with us.

**3. The energy curve.** *(authored)*
Low and level to begin with, because the argument is a quiet one. A single
weight at the 70,000. Flat and almost silent through the mission. Then the
only loud passage on the page at the repetitions, and a firm, unhurried
landing.

**4. Feeling, stage by stage, and the one moment.** *(peak chosen by the user)*

| Act | Feeling | Caused by |
|---|---|---|
| 1 Recognition | Orientation, slight unease | Two worlds side by side, both true, one obviously worse |
| 2 Tension | Weight | 70,000 arriving as a real counted figure |
| 3 Turn | Curiosity | The object appears and turns under the reader's hand |
| 4 Substance | Reassurance | Four claims, each evidenced at the angle that shows it |
| 5 Mission | Stillness | Almost nothing on screen |
| 6 **Peak** | **Release** | **"And again." The wash line advances; the left column depletes** |
| 7 Collapse | Resolution | The divider reaches the edge; one world remains |

**The peak is act 6.** As a visitor would say it to a friend: *"There's a line
down the middle of the page, and every time they wash the slipper it shoves
the bad half further off the screen."*

**5. One thing no other site does.** *(authored, and it became the signature move)*
The page's navigation is also its argument. The divider between the two
columns is a wash line: it moves, it counts down a real figure, and by the end
it has pushed one whole side of the page away.

**6. How far from premium-minimal.** *(authored)*
Premium-minimal, and not straining against it. The restraint is the brand
position, not a default.

**7. One unbroken world, or distinct scenes?** *(user)*
Neither. **Split stage** — two grounds held in tension for the whole page and
resolved by a collapse. Chosen over the other seven grammars; the reasoning
table is in `docs/build-prompt.md` §5.

**8. Assets already held.**
- Product reference photograph (side profile, the real slide).
- `media/slide-loop.mp4` — a 3.61s seamless ambient loop, cut from Higgsfield
  output at its measured optimal loop points.
- Brand guidelines PDF: palette, wordmark, eight icons, Raptor V2 Premium
  specified but not yet licensed.
- Self-hosted Inter; wordmark and icons already extracted to SVG.
- **Not yet held:** the 360° frame sequence for act 3. Render from CAD if one
  exists, otherwise a turntable shoot. See `docs/build-prompt.md` §9.

No `KIE_AI_API_KEY` needed; this is a build from owned assets.

---

## The tell-someone sentence

> It's the site where the slipper keeps winning back the screen.

---

## Authored silence

**Act 5, the mission, is deliberately near-empty.** Almost nothing on screen,
no device doing work, the quietest passage on the page. It exists to make act 6
land. The Step 5 verification pass will see low visual change across that span
and must not report it as dead scroll.

---

## Hard constraints inherited from the brand

- **No invented numbers.** 70,000 is real and sourced. The US landfill figure
  is currently a `0` placeholder and cannot ship in a counter until it is
  sourced and citable. If it cannot be, act 2 runs on 70,000 alone.
- **The product is near-white and the page is near-white.** Separation comes
  from raking light and a contact shadow, never an outline.
- **The strap ribbing is the only thing identifying the product** — there is no
  branding on it. Every asset decision protects the ribbing first.
