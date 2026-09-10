# Studio Rowan — production website build prompt

Paste this whole file as the opening brief for the build. Everything below is
settled unless it appears under **Open questions**.

---

## 1. Role and goal

You are building the next website for **Studio Rowan**.

**It does not replace the holding page.** The existing coming-soon page stays
exactly where it is, at `/`, untouched and still the site anyone visiting
`studiorowan.com` gets. The new build is published alongside it at its own
path and promoted to the root only when it is ready. See §8, *Deployment*.

Studio Rowan is a design-and-manufacture studio. Its first product is the
**Never-Ending Slipper** — a reusable, waterproof, recycled-EVA hotel slider
that replaces the disposable slippers hotels and spas throw away by the
tens of thousands.

The site has one job: make a hospitality buyer believe this is a serious,
premium product, and get them to request samples or start a conversation.

The reference register is **luxury minimal** — Aesop, Loro Piana, On Running,
Apple's product pages. Enormous whitespace, very few elements per viewport,
restrained motion, one idea at a time. Nothing decorative that isn't doing
work. The product is the imagery; there is no stock photography.

Seven design directions already exist under `prototypes/`. **06-hotel** is the
closest to the intended structure and carries the approved copy. Treat it as
the content skeleton, not as the visual answer — the production site is
quieter, whiter and more spacious than any prototype.

---

## 2. The product, as it actually is

Read this before speccing anything visual. Reference photograph supplied
10 September 2026 (side profile, pair, on a kitchen counter — a reference
snap, not an asset).

- An **open-toe slide** in near-white EVA. Chunky rolled midsole, roughly
  30–35mm at the heel, with a fine ripple visible along the bottom edge.
- The **instep strap carries fine horizontal ribbing** — closely spaced
  parallel ridges running across the full width of the strap. There is **no
  visible branding anywhere on the product**, which means the ribbing *is*
  the identity. Every design decision on the site should protect it.
- The **footbed has a dimpled grip texture**, clearly visible at the toe.
- The strap reads **very slightly warmer** than the sole — close to Ivory
  against White. Confirm whether that is a genuine two-tone moulding or just
  the lighting in the reference shot, because it affects how the product
  sits on the page.

Three things follow from this, and they drive §3.

**a. The product is white and the site is white.** In the reference photo the
slide only reads because directional light rakes across the ribbing and drops
a shadow under the sole. Flat-lit on an Ivory page it will disappear
completely. Separation has to come from raking light, a soft contact shadow
and a genuine tonal step between product and ground — not from an outline or
a drop shadow bolted on afterwards.

**b. A horizontal turntable never shows the sole.** The copy makes a
"treaded sole" claim, and a pure 360° Y-axis rotation physically cannot
reveal the underside. The spin needs a second move (§3).

**c. Fine regular ribbing is an aliasing and compression trap.** High-frequency
repeating detail, downscaled to web resolution and rotated, produces
frame-to-frame moiré shimmer — and it is close to the worst case for AVIF and
WebP, which will smear the ridges into mush at ordinary quality settings.
This is the single most likely way the hero ends up looking cheap. Budget for
it (§3).

## 3. The 360° spin of the slider (act 3)

The Never-Ending Slipper rotates in 3D, the way a high-end trainer or phone
product page does it. It is the single most important *asset* on the site,
though under the chosen grammar it is **act 3 inside the right column, not the
hero** — see §5 for what that changes.

**Implementation: a pre-rendered frame sequence painted to a `<canvas>` and
scrubbed by scroll position. Not a video file, not a real-time 3D model.**

This is what Apple, Nike and On actually ship for hero product spins, and it
is both the best-looking and the least fragile option. See §10 for why AI-
generated video and live WebGL were both rejected.

### Two sequences, not one

Because the underside has to be shown (§2b), the hero is **two chained
sequences** sharing one canvas and one scroll timeline:

- **A — turntable.** 72 frames, one every 5°, a full 360° about the vertical
  axis, closing seamlessly (frame 72 identical in position to frame 0). This
  is the main spin.
- **B — sole reveal.** 24 frames tipping the slide from its resting profile up
  to roughly 75° so the treaded sole faces the viewer, then holding. Plays
  only when the "treaded sole" feature enters view, and reverses out.

B is loaded lazily, after A has fully decoded. If B never arrives, the sole
callout falls back to a static underside still — the page must not wait on it.

### Frame spec

- Source resolution **3000px on the long edge**, rendered or shot at 2×
  supersample and downsampled with a good filter. This is the moiré defence
  (§2c) — naive downscaling of the strap ribbing will shimmer.
- Ship three responsive tiers (2400 / 1600 / 1000) chosen by
  `devicePixelRatio` × viewport width.
- Format **AVIF with WebP fallback**, transparent background, subject centred
  with identical padding on every frame so nothing jitters as it turns.
- **Quality settings must be tuned against the ribbing, not against file size.**
  Encode a test frame at several qualities, view the strap at 100%, and pick
  the lowest setting where the ridges stay crisp and distinct. Expect to need
  noticeably higher quality than a typical product image.
- **Budget: ≤ 4 MB** for sequence A at the tier actually loaded — raised from
  the usual 2.5MB precisely because of the ribbing. If you exceed it, cut to
  **48 frames (7.5°) before you cut quality.** 48 frames still scrubs smoothly;
  a mushy strap is unrecoverable.
- Store under `/spin/a/{tier}/frame-000.avif` and `/spin/b/{tier}/…`, cached
  `immutable` in `_headers` alongside `/vendor` and `/fonts`.

### Lighting and staging

- A **raking key light** across the strap so the ribbing reads as ridges
  rather than a flat grey panel. This is the whole shot — if the ribbing goes
  flat, the product looks like a blank white blob.
- A **soft contact shadow** under the sole, which does most of the work
  separating a white product from a white page (§2a).
- Ground tone must be a genuine step away from the product: if the slide is
  White, the page area behind it sits on **Ivory** or **Clay**, never White.
- **A single slide, not the pair.** The pair belongs in a static editorial
  shot elsewhere on the page; the spin needs one clean silhouette.
- No visible branding exists on the product, so there is no logo angle to
  favour. Choose the hero angle on silhouette alone — the reference photo's
  side profile, very slightly rotated toward three-quarter, reads best.

### Behaviour

- Load frame 0 as a normal `<img>` first so the LCP element is a real image
  that paints immediately. Swap to canvas only once decoding is underway.
- Decode frames with `createImageBitmap`, sequentially, lowest tier first.
  Show a hairline progress rule (Ochre on Ivory) while below ~30% decoded —
  never a spinner, never a percentage counter.
- Bind rotation to scroll with GSAP ScrollTrigger, `scrub: 0.6`, pinning the
  hero for roughly 150vh of scroll. One full rotation across that distance.
- Add **drag-to-spin** on the pinned hero: pointer drag maps to rotation and
  releases with light inertia. This is what makes it feel like a product
  page rather than a scroll gimmick. Keyboard: left/right arrows step one
  frame, and the canvas must be focusable with a visible focus ring.
- Never autoplay a rotation. The object is still until the user moves.

### Non-negotiable fallbacks

- `prefers-reduced-motion: reduce` → render a single static hero frame at the
  best three-quarter angle. Do not load the sequence at all.
- No JavaScript → the same static frame, as a plain `<img>`. The page must
  read completely without JS.
- Save-Data header or `connection.saveData` → static frame.
- Decode failure or a frame 404 → static frame, silently. Never a broken hero.

### Feature callouts

Four product features are called out in the copy. Anchor each to a specific
frame so the slide rotates to the angle that evidences the claim as the
reader reaches it:

| Claim | What must be visible | Sequence |
|---|---|---|
| Recycled EVA foam | Midsole sidewall and its material texture | A |
| Waterproof | Full profile, unbroken moulded surface | A |
| Supportive, wider fit | Three-quarter front — strap width and footbed | A |
| Treaded sole | The underside tread | **B** |

Record the chosen frame indices in one config object at the top of the spin
module. Fix them once the sequences exist — do not guess them now.

---

## 4. The ambient product loop

Separate from the hero spin, and not a substitute for it. A short, silent,
autoplaying loop of the slide turning in a studio void — atmosphere rather
than evidence.

### The asset

`media/slide-loop.mp4` — 3.608s, 1440x1440, 24fps, ~1.09 MB, 2.43 Mbps,
**no audio track**. Generated in Higgsfield from the product reference photo,
then trimmed to its optimal loop points.

It loops on a **hard cut, not a crossfade**. The in/out pair (3.667s -> 7.275s
of the source) was chosen by searching every candidate pair for the closest
frame match: the seam measures 1.06 mean absolute difference (0-255
greyscale), against 1.83 for ordinary frame-to-frame motion within the clip.
The discontinuity is smaller than the movement the eye is already tracking, so
the loop point is invisible.

**Do not add a crossfade.** It was tested and measured worse (1.47) — a
dissolve on a rotating object ghosts the sole edge and doubles the strap
ridges. Do not re-trim without re-running that search either; the obvious cut
points are not the good ones.

### Where it goes

Act 6 of the score (see §5) — **"And again. And again. And again."** That
beat is the emotional centre of the page, wants a whole viewport with almost
nothing else in it, and argues for reuse rather than evidencing a product
claim. A slowly turning shoe belongs there.

It may also be used for social and paid media unchanged.

### Implementation

- `muted loop playsinline autoplay preload="metadata"`, self-hosted, no CDN.
- Poster frame is the first frame; ship it as a still so the section is
  composed before the video arrives.
- `prefers-reduced-motion: reduce` or `saveData` -> **poster only, do not
  fetch the video.** Same rule as the spin sequence.
- Cache `immutable` in `_headers` alongside `/vendor`, `/fonts` and `/spin`.
- Square (1:1). Suits a centred block; it will not go full-bleed landscape
  without reframing.

### Outstanding work on this asset

1. **Grade the backdrop.** It is warm beige; the site is Ivory `#F6F5F2`. It
   will fight the page untouched.
2. **Ship a WebM/VP9 alongside the MP4.**
3. Leave the scale drift alone. The slide subtly changes apparent size as it
   turns — a generation artefact, not a dolly. The trimmed range already
   excludes the two worst frames (the edge-on views at 1.99s and 5.97s in the
   source), and what remains reads as float rather than error.

### What this asset must not be used for

Not the hero, and not scroll-scrubbed. **Motion hides drift; scrubbing exposes
it.** At playback speed the scale drift and the inconsistent sole tread are
invisible; give the viewer a scrub position and they will park on a frame and
stare at it. The rotation is also not constant-rate, so scroll position would
not map linearly to angle — and there is no underside anywhere in the turn.

---

## 5. Scroll-craft: grammar, score and signature move

The build runs on the **`scroll-craft` skill**. Read its `SKILL.md` and the
references it points at before starting. What follows are decisions already
taken, so the skill's Step 0 interview and Step 2 gate do not get re-run from
scratch. The build's `BRIEF.md` lives at
`scrollcraft/builds/studio-rowan/BRIEF.md`.

Copy `engine/scrollcraft.js` and `engine/scrollcraft.css` into the build folder
and **never edit the engine per-project**. Bespoke behaviour is written in the
page, driven off `--sc-p` and your own `data-sc-*` attributes.

### Grammar: Split stage (uniqueness.md §2.7)

Two columns held in tension for the whole page, resolved by scroll.

**Left is the world as it is:** disposable slippers, 70,000 a year, worn for
minutes. **Right is the Never-Ending Slipper.** Both columns carry real content
the whole way down; neither is decorative. The page is going somewhere
specific, which is the moment the right column wins.

Chosen because the argument is inherently two-sided. "What you have" against
"what you would have" *is* the grammar's stated fit, and its ending is the
brand's sentence made structural.

Why the other seven lost, for the report:

| Grammar | Why not |
|---|---|
| Filmic one-shot | The acknowledged default drift; four prior builds landed there and read as a template |
| Chaptered editorial | Bans the full-bleed scrub hero and buries the product in a media column |
| Continuous world | No real geography in this story, and the most fragile thing to build |
| Typographic poster | Bans `scrub` outright; the product has to be seen turning |
| Gallery / catalog | One product, not a range |
| Live surface | Nothing to operate |
| Rhythmic cutlist | The campfire story needs dwell, and hard cuts at speed would flatten it |

**What this grammar forbids, and what it costs us:**

- **No fixed nav bar.** The divider is the chrome. It carries both side labels
  and the progress of the argument.
- **The hero establishes the split at 50/50 on the first screen**, both
  headlines readable at once. The centred wordmark over a full-bleed spin is
  now out; so is the corner-anchored hero.
- **No centred copy anywhere.** Prototypes 01 to 08 all lean centred; none of
  them is the composition now.
- **No full-bleed anything before the resolve.**
- **Banned devices:** `pan`, `spotlight`, `magnet`, `drift`, and more than one
  `scrub`.
- **Asymmetric close required.**

**The two grounds.** `drift` is banned here: two grounds, one per side, and
they hold. Left sits on **Clay `#E0DCD1`**, right on **Ivory `#F6F5F2`**. The
collapse resolves the whole page to Ivory. Olive is reserved for the closing
CTA plate; Apricot is the wash line only.

### The signature move: the wash line

One bespoke interaction, coded in the page, driven off `--sc-p`.

The divider is not a static rule. It is a **wash line**, and it travels left in
discrete steps, one per wash, as the visitor scrolls. Every step it takes gives
the right column more of the screen and takes it from the left. Carried on the
line itself: the label for each side, and the **70,000 counting down** as the
line advances.

It does four jobs at once, which is why it is the signature move rather than a
decoration: it is the chrome the grammar demands, the progress readout of the
argument, the mechanism of the peak, and the setup for the collapse.

**Honesty constraint.** The countdown runs against 70,000, which is a real
sourced figure (one hotel, one year). It must be presented as that figure being
depleted, never as a claim about pairs actually diverted to date. No invented
number goes on the line. See §7 and the open question on the US landfill figure.

### The feeling curve and the peak

Written before the score, per feel.md. One line per act: the emotion, then what
on screen causes it.

| # | Beat | Feeling | Caused by |
|---|---|---|---|
| 1 | Recognition | Orientation, slight unease | Two worlds side by side, both true, one obviously worse |
| 2 | Tension | Weight | 70,000 arriving as a real counted figure |
| 3 | Turn | Curiosity | The object appears and turns under the reader's hand |
| 4 | Substance | Reassurance | Four claims, each evidenced at the angle that shows it |
| 5 | Mission | Stillness | Almost nothing on screen. This is the authored silence |
| 6 | **Peak** | **Release** | **"And again." The wash line advances, the left column depletes** |
| 7 | Collapse | Resolution | The divider hits the edge; one world remains |

**The peak is act 6** and gets the largest span by a visible margin. Act 5 is
deliberately quieter than it — that stillness is authored, not dead scroll, and
the verification pass must not flag it as such.

**Tell-someone sentence:** "It's the site where the slipper keeps winning back
the screen."

### The score

| Beat | Side | Device | Why this one |
|---|---|---|---|
| 1 Recognition | Both | `pin` | The frame holds while the split is established and both headlines land |
| 2 Tension | Left | `count` | A real figure, counted. The one number the page has earned |
| 3 Turn | Right | `scrub` | The single allowed scrub. The 360 spin (§3), under the reader's hand |
| 4 Substance | Right | `reveal` | A wipe per claim is a change of state, which is what each feature is |
| 5 Mission | Full | `flow` + `in` | Deliberately plain. Any device here would fill the silence |
| 6 **Peak** | Both | `kinetic` + the wash line | Repetition assembling, each one moving the line |
| 7 Collapse | Right | `pin` | The page stops travelling and resolves |

Checks: six distinct device families, no family twice in a row, exactly one
`scrub`, peak has the largest span, the act before it is quieter. Keep the
total scroll length **out of the 13.6 to 13.8vh band** across 6 or 7 acts, which
is a recorded fingerprint of four prior builds.

### Consequences for §3 and §4

These override the earlier sections where they disagree.

1. **The spin is no longer the hero.** It is act 3, inside the right column.
   Every frame spec, moiré defence, lighting brief and byte budget in §3 stands
   unchanged; only its placement and framing change.
2. **Sequence B loses its own act.** One `scrub` is the grammar's limit, so the
   sole reveal becomes a `reveal` inside act 4, where the treaded-sole claim
   already lives. It is no longer a chained second scrub.
3. **Drag-to-spin survives.** A pointer device inside an act is not a banned
   family.
4. **The ambient loop (§4) plays in the right column through acts 5 and 6**, and
   **goes full-bleed only at the collapse.** Full-bleed is forbidden *before*
   the resolve, so the moment it fills the screen is the payoff, not a
   violation.

### Verification

Step 5 is not optional. Shoot desktop, mobile (390x844) and reduced-motion
strips, read `sheet.png` rather than trusting a green run, tab through for focus
order, then run the feel check cold and diff it against the curve above. A green
headless run does not cover a real iPhone; test the loop and the scrub on
device before launch.

## 6. Brand system

Tokens already exist in `prototypes/shared/brand.css` — reuse that file as the
basis for the production stylesheet.

**Palette**

| Role | Name | Hex |
|---|---|---|
| Main | White | `#FFFFFF` |
| Main | Ivory | `#F6F5F2` |
| Main | Hemp | `#EBEAD7` |
| Main | Clay | `#E0DCD1` |
| Accent | Apricot | `#FC814A` |
| Accent | Ochre | `#9B8816` |
| Accent | Olive | `#40531B` |
| Accent | Onyx | `#2C302E` |

The production site sits on **White and Ivory**, with Onyx text. Olive is for
one or two full-bleed moments at most (the mission statement, the closing
CTA). Apricot is a highlight only — a single word, a status dot, a rule.
Resist the prototypes' habit of blocking large areas of colour; the luxury
read comes from restraint.

**Type**

- Display: **Raptor V2 Premium** — a licensed face we do not yet hold. The
  prototypes substitute Outfit Light via the `--display` variable. Keep that
  indirection: when the licence lands, self-host the woff2 and change one
  variable name. Do not hardcode the display family anywhere else.
- Text: **Inter**, self-hosted from `/fonts/inter.woff2`.
- Display weight is Light (300) throughout, tight tracking (`-.02em`),
  `text-wrap: balance` on headings.

**Marks and icons**

The wordmark and eight brand icons are already extracted as SVG in
`prototypes/shared/brand/` and injected by `brand.js`. Reuse them. Icons are
used sparingly and large, never as a decorative row of small badges.

---

## 7. Structure and copy

Use the copy from `prototypes/06-hotel/index.html` verbatim — it is approved.
Its *layout* is not: see the two ship-blockers below.

The seven sections map one-to-one onto the acts in §5:

| Act | Section | Column |
|---|---|---|
| 1 | Hero. "Leave less behind." Both sides named, split at 50/50 | Both |
| 2 | The hotel slipper. The Swiss Alps story and the 70,000 | Left |
| 3 | The Never-Ending Slipper. The product, turning | Right |
| 4 | The four feature claims, each evidenced at its angle | Right |
| 5 | Our mission. "Design problems, not a waste problem" | Full |
| 6 | **And again. And again. And again.** The peak | Both |
| 7 | Work with us, then the footer. The collapse | Right |

### Two ship-blockers in the current layout

Prototype 06 breaks two of scroll-craft's hard rules, and both are in the
markup rather than the words:

1. **An eyebrow above every section heading.** There are four `.kicker`
   elements, one per section; the cap is one per three sections. Delete them.
   The headings carry themselves.
2. **Numbered section counters.** Those same kickers render `01` to `04` via
   `data-n`. Section counters are banned outright. Sequence is not information
   on this page.

### Also to fix

- **Em dash in visible copy.** The `<title>` reads
  `Studio Rowan — Leave less behind`. Replace with a colon or a period. The
  rule covers anything the visitor can see, and the browser tab counts.
- **No fixed top bar.** The current header is a fixed three-column bar with a
  wordmark, three anchors and a CTA. Split stage has no bar: the divider is the
  chrome and carries both side labels plus the argument's progress.

## 8. Technical constraints

These carry over from the current build and are not up for negotiation.

- **Static site, no build step.** Vanilla HTML / CSS / JS, deployed to
  Cloudflare Pages.
- **Zero third-party requests at runtime.** Fonts under `/fonts`, the
  scroll-craft engine copied into the build, everything else local. The
  prototypes load GSAP and three.js from cdnjs — the production build must
  not. Add a `Content-Security-Policy` to `_headers` with `default-src 'self'`
  once nothing external remains.
- **The scroll-craft engine is vendored, not edited.** Copy
  `engine/scrollcraft.js` and `engine/scrollcraft.css` into the build and treat
  them as immutable. Bespoke behaviour, the wash line included, is written in
  the page against `--sc-p` and `data-sc-*`.
- **GSAP is probably now redundant.** The engine drives scroll state itself and
  the wash line is `--sc-p` driven, so nothing obviously needs GSAP or
  ScrollTrigger. Drop them unless something concrete turns out to need them;
  that is a payload saving, not a loss. Recorded as an open question.
- **Caching** follows the existing `_headers` pattern: HTML, top-level CSS and
  JS always revalidate; `/vendor`, `/fonts` and `/spin` are `immutable`.
  A stale-cache bug already broke this site's loader once — do not
  reintroduce hashless long-cached app code.
- **Accessibility**: real landmarks and heading order, visible focus rings,
  contrast ≥ 4.5:1 for body text (check Ochre on Ivory — it is marginal and
  may need darkening for small text), the spin canvas keyboard-operable with
  an `aria-label` describing it, and every animation gated behind
  `prefers-reduced-motion`.
- **Performance targets**: LCP < 2.0s on a 4G phone, CLS 0, and the page fully
  legible before the spin sequence has finished decoding.
- **Contact is `mailto:` only.** No form, no backend, no analytics unless
  explicitly added later.

### Deployment: its own path, not the root

The live holding page is the deliverable that currently matters, and a
stale-cache bug already broke its loader once. Nothing in this build may touch
it.

- **Build to `/preview/`.** The new site is `preview/index.html` and its own
  subtree. `/` keeps serving the existing `index.html`, `styles.css` and
  `main.js` unchanged.
- **Use relative asset paths inside `preview/`** (`./spin/...`,
  `./media/...`, `./engine/...`) so the whole folder can be promoted to the
  root later by moving it, not by rewriting every URL. The one deliberate
  exception is `/fonts/`, which is shared with the holding page, already
  cached `immutable` and already sends `Access-Control-Allow-Origin`. Do not
  duplicate the fonts.
- Because paths are relative, the page must be reached **with the trailing
  slash** (`/preview/`). Cloudflare Pages redirects `/preview` to it, but do
  not rely on that in any link you write.
- **Keep it out of search results.** Add the block below to `_headers`. Note
  it deliberately does *not* add a `robots.txt` disallow: disallowing prevents
  crawling, which means the `noindex` is never read, and the disallow line
  itself advertises the path. Allow the crawl, refuse the index.
- `noindex` is not access control. If this needs to be genuinely private
  rather than merely unlisted, put Cloudflare Access in front of `/preview/*`.
  That is a dashboard change, not a repo change. Recorded as an open question.

Append to `_headers`, after the existing rules, since the last matching rule
wins for a given header and these must override the site-wide ones:

```
# The next site, published alongside the holding page and not yet public.
/preview/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: public, max-age=0, must-revalidate

# Its long-lived assets. Declared after the rule above so they take precedence
# for these paths; X-Robots-Tag still applies, because rules are cumulative.
/preview/spin/*
  Cache-Control: public, max-age=31536000, immutable
/preview/media/*
  Cache-Control: public, max-age=31536000, immutable
/preview/engine/*
  Cache-Control: public, max-age=31536000, immutable
```

**Promotion to the root is a separate, later decision** and wants its own
checklist: move the subtree, switch the `_headers` rules, drop the
`X-Robots-Tag`, and confirm the old holding-page assets are either reused or
removed rather than left orphaned.

### Toolchain

`node scripts/doctor.mjs` was run on 10 September 2026. Node 18.20.5 and Chrome
pass; the workspace resolves to `scrollcraft/` at the project root and the
fingerprint registry is empty, so the uniqueness gate passes trivially for this
first build. Two gaps to close before starting:

- **`ffmpeg` is missing, and it is a required check.** `encode.sh` needs a full
  build: it sets a dense GOP so the clip actually seeks, because a normal web
  encode plays fine and scrubs like mud. Install with `brew install ffmpeg`, or
  point `SCROLLCRAFT_FFMPEG` at a full build.
- **`playwright-core` is not installed.** Needed only for the Step 5
  verification pass: `npm i playwright-core` inside the build folder.

No `KIE_AI_API_KEY` is needed. Assets come from the product itself and from the
existing Higgsfield loop, which the skill treats as a first-class route rather
than a fallback.

---

## 9. Assets to be produced before or alongside the build

The spin sequence does not exist yet. Someone has to shoot or render it.
Recommended route, in order of preference:

1. **If a CAD or 3D model of the slider exists** (likely, since Studio Rowan
   manufactures it) — **strongly preferred.** Render both sequences in Blender
   or Keyshot to the lighting brief in §3. A render gives you exact control
   over the raking key light on the ribbing, a clean alpha, and sequence B's
   sole reveal for free — which on a turntable is a separate rig. The asset
   also gets reused for packaging and trade collateral.
2. **Otherwise, shoot it.** Physical slide on a motorised turntable, camera
   locked off, 72 exposures for A, consistent lighting, retouched to a
   transparent background. Sequence B needs a second setup with the slide
   tilted on a jig. Budget more retouching time than a normal product shoot:
   masking a white product cleanly, without eroding the ribbing at the strap
   edges, is the fiddly part.

Whichever route, **produce and review one test frame at final web resolution
before committing to all 72.** Check the strap ribbing at 100% and check that
the product separates from an Ivory background. Those two things decide
whether the hero works.

Also required: one hero still (the best three-quarter angle) for the
reduced-motion, no-JS and slow-connection fallbacks, plus an OG image.

---

## 10. Rejected approaches, and why

Recorded so they don't get relitigated mid-build.

- **AI-generated video for the hero spin.** Rejected — but with a tested
  caveat, because a clip was generated and measured rather than assumed.

  *What the test showed:* the Higgsfield output (§4) came back better than
  expected. The strap ribbing held crisp and consistent through a full turn,
  and the profile frames read convincingly as a studio product render. The
  blanket assumption that generative video would smear fine repeating detail
  did not hold here.

  *Why it is still not the hero:* the defects it does have are the ones
  scrubbing exposes rather than hides — apparent scale drifts through the
  turn, the sole tread fades in and out between frames, rotation is not
  constant-rate so scroll position cannot map linearly to angle, and the
  underside is never visible, which leaves the "treaded sole" claim
  unevidenced. Ambient playback conceals all four; a scrub position does not.
  Product accuracy also still matters more at the hero than anywhere else:
  a buyer who requests samples should receive the object the site showed them.

  So: **AI video is in use on this site, as §4, and welcome for atmosphere,
  social and paid media. The hero stays on frames of the real product.**

- **Live WebGL / three.js GLB model.** Rejected for v1. It buys drag-to-spin
  and colourway swapping, but a pre-rendered sequence gets drag-to-spin
  anyway, looks better for the same effort, and doesn't ship a multi-megabyte
  model plus an IBL to a phone. Revisit only if a configurator is wanted.
- **Large blocks of brand colour.** The prototypes lean on full Olive and
  Apricot fields. The production site is White and Ivory with colour as
  punctuation.

---

## 11. Open questions — resolve before launch

1. **Contact address.** The guidelines and prototypes use
   `hi@studiorowan.com`; the live holding page uses
   `info@studiorowan.co.uk`. Which is correct, and which domain is canonical?
2. **Raptor V2 Premium licence.** Not yet held. Ship with Outfit Light as a
   documented stand-in, or delay launch until the licence is in place?
3. **"Explore the slipper" destination.** Currently a `mailto:`. Does it need
   a dedicated product page, or does it anchor to the spin section?
4. **Does a 3D model or CAD of the slider exist?** This decides §9 entirely.
5. **The US landfill figure** is a `0` placeholder in prototype 06 and needs
   a real, citable number before it goes on a public page.
6. **Instagram handle** for the footer link.
7. **Is the strap genuinely a different tone from the sole,** or is that the
   lighting in the reference photo? Affects staging and the page's ground
   colour behind the spin.
8. **Will the production product carry any branding** — a debossed wordmark on
   the strap or footbed? If so, the hero angle should favour it and the
   decision changes §3's staging note.
9. **Colourways.** Is white the only finish, or are others planned? More than
   one pushes back toward a live 3D model and a configurator, which §10
   currently rejects for v1.
10. **The US landfill figure blocks an entire act.** Scroll-craft bans invented
    statistics in a counter outright: no real number, no counter. Act 2 is a
    `count` act, and prototype 06 has a `0` placeholder next to the real 70,000.
    Either source and cite the figure or cut it and let 70,000 carry act 2
    alone.
11. **Does GSAP stay?** See §8. The recommendation is to drop it.
12. **Does `/preview/` need real access control**, or is unlisted and
    `noindex` enough? Cloudflare Access is the answer if a competitor finding
    it early actually matters.
13. **Which side of the split does the wordmark live on**, given there is no
    nav bar to hold it? It has to be composed into the hero rather than parked
    in a corner.
