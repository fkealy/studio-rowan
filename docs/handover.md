# Studio Rowan website — handover

Build the next site for **Studio Rowan**. **It does not replace the holding
page.** The coming-soon page stays at `/`, untouched. The new build is
published alongside it at **`/preview/`** and promoted to the root later.

The product is the **Never-Ending Slipper**: a reusable recycled-EVA hotel
slider replacing the disposables hotels bin by the tens of thousands. The
site's job is to make a hospitality buyer request samples.

## Read these first, in order

1. **`docs/build-prompt.md`** — the full spec. Everything is decided there.
2. **`scrollcraft/builds/studio-rowan/BRIEF.md`** — intent, feeling curve, peak.
3. The **`scroll-craft` skill** (`nateherk-design:scroll-craft`) — the build
   methodology. Its Step 0 interview and Step 2 gate are already answered by
   the two files above; do not re-run them from scratch.

## The decisions, so you don't relitigate them

- **Grammar: Split stage.** Left column is the disposable world, right is the
  Never-Ending Slipper. No nav bar, no centred copy, no full-bleed before the
  resolve. Bans `pan`, `spotlight`, `magnet`, `drift`, and more than one `scrub`.
- **Signature move: the wash line.** The divider travels left in steps, one per
  wash, counting 70,000 down. It is the chrome, the progress readout, the peak's
  mechanism and the setup for the collapse.
- **Peak: act 6**, "And again. And again. And again." Largest span. Act 5 is
  deliberately near-silent and is recorded as authored silence, not dead scroll.
- **Score:** 7 acts, 6 device families, no family twice in a row, one `scrub`.
  Table in `build-prompt.md` §5.
- **The 360 spin is act 3, not the hero.** Frame sequence, not video, not a live
  3D model. Reasoning is recorded in §10; it was tested, not assumed.

## State of the assets

- `media/slide-loop.mp4` — ready. 3.61s seamless ambient loop, plays in the
  right column through acts 5 and 6 and goes full-bleed only at the collapse.
  **Do not re-trim or add a crossfade** without reading §4 first.
- The 360 frame sequence for act 3 — **does not exist yet.** Render from CAD if
  one exists, else turntable shoot. Spec in §3, production notes in §9.
- Brand tokens, wordmark and icons: `prototypes/shared/`.

## Deployment

Build to `preview/` as its own subtree. Use **relative** asset paths inside it
so the folder can be promoted by moving it rather than rewriting URLs; the one
exception is `/fonts/`, shared with the holding page and already cached
`immutable` with CORS, so do not duplicate it. Add the `_headers` block in
`build-prompt.md` §8 to keep it out of search results. Nothing you do may touch
`/index.html`, `/styles.css` or `/main.js` -- a stale-cache bug broke that
page's loader once already.

## Environment

Preflight is green: node 18.20.5, ffmpeg 9.0.1, Chrome, workspace at
`scrollcraft/`, registry present and empty so the uniqueness gate passes.
Two gaps: `npm i playwright-core` in the build folder before Step 5, and
ffmpeg has no libwebp encoder, so WebP stills need `cwebp` or sharp.

## Three things that will block you

1. **The US landfill figure is a `0` placeholder.** Act 2 is a `count` act and
   invented statistics are banned outright. Source it or cut it and let 70,000
   carry the act alone.
2. **Prototype 06's layout breaks two ship-blockers** — an eyebrow on every
   section, and those eyebrows numbered `01`-`04`. The copy is approved; the
   layout is not. §7.
3. **Raptor V2 Premium is unlicensed.** Outfit Light stands in behind one CSS
   variable. Decide whether to ship on the stand-in.

Remaining open questions are in §11. Do not start generating until 1 is answered.
