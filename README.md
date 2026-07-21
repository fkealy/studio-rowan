# Studio Rowan — Leave Less Behind

A coming-soon landing page for Studio Rowan, a design-and-manufacture studio for
products made to last, made responsibly, and made with purpose.

Clean, white, minimalist. A centred wordmark and tagline inside a hairline
frame, with a quiet loader and staggered entrance.

## Built with

- **GSAP** — preloader counter and staggered lockup reveal
- **Fraunces** + **Inter** — editorial serif display paired with a clean grotesque
- Vanilla HTML / CSS / JS — no build step; GSAP and both fonts are vendored
  locally (`/vendor`, `/fonts`), so the page makes no third-party requests

## Run locally

It's a static site — serve the folder with anything:

```bash
python3 -m http.server 4175
# then open http://localhost:4175
```

## Structure

- `index.html` — markup, font + import-map setup
- `styles.css` — layout, type, responsive + reduced-motion handling
- `main.js` — loader and reveal sequencing
- `vendor/` — self-hosted GSAP
- `fonts/` — self-hosted Fraunces + Inter (latin subset, woff2)

## Notes

- Respects `prefers-reduced-motion` and degrades gracefully without JS
  (page content stays visible; the loader is JS-driven).
- Contact is a direct `mailto:info@studiorowan.co.uk` link — no form/backend.
