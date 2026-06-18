# Studio Rowan — Leave Less Behind

A coming-soon landing page for Studio Rowan, a design-and-manufacture studio for
products made to last, made responsibly, and made with purpose.

Clean, white, minimalist. A quiet topographic field of fine contour lines —
rendered in WebGL — breathes across the page and recedes to a clean horizon.

## Built with

- **three.js** — a custom noise-shader contour landscape (`LineSegments`)
- **GSAP** — preloader counter, masked headline reveal, staggered entrances
- **Fraunces** + **Inter** — editorial serif display paired with a clean grotesque
- Vanilla HTML / CSS / JS — no build step; three.js and GSAP load via CDN

## Run locally

It's a static site — serve the folder with anything:

```bash
python3 -m http.server 4175
# then open http://localhost:4175
```

## Structure

- `index.html` — markup, font + import-map setup
- `styles.css` — layout, type, responsive + reduced-motion handling
- `main.js` — WebGL contour field, loader, reveals, email capture

## Notes

- Respects `prefers-reduced-motion` and degrades gracefully without JS.
- The email capture is front-end only; wire it to a provider before launch.
