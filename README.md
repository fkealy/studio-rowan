# Studio Rowan — Leave Less Behind

The Studio Rowan site: a scroll-driven single page for the Reusable Slider, a
reusable, waterproof, recycled EVA hotel slider, ending in a sign-up form for
the pilot.

## Built with

- Vanilla HTML / CSS / JS, no build step
- `engine/` — the scrollcraft scroll engine (source build in `scrollcraft/`)
- **Outfit** + **Inter**, self-hosted in `fonts/`
- Nothing external is loaded at runtime; the CSP in `_headers` enforces it

## Run locally

It's a static site — serve the folder with anything:

```bash
python3 -m http.server 4175
# then open http://localhost:4175
```

To test with the production Content-Security-Policy applied, run
`node scrollcraft/builds/studio-rowan/csp-server.mjs` and open
http://localhost:4176.

## Structure

- `index.html` — markup and the inline head script (its hash is pinned in `_headers`)
- `styles.css` — layout, type, responsive + reduced-motion handling
- `page.js` — the spin, the dot field, the figures and the pilot form
- `spin/` — the turning-slider frame sequence
- `media/` — photographs
- `functions/api/sample-request.js` — Cloudflare Pages Function that would email
  the pilot form; switched off until `SAMPLE_ENDPOINT` is set in `page.js`
- `_headers` — Cloudflare Pages security and cache headers
- `BUILD-NOTES.md` — design and build decisions, in the order they were made
