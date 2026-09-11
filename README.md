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

## Previewing remotely

The site deploys through Cloudflare Pages, so a preview is normally reviewed at
its own path once it lands. To put one in front of someone before that — or to
iterate on it from a remote session with a link that updates in seconds — mirror
it to a Claude artifact:

```bash
python3 tools/artifact-bundle.py preview-2 /tmp/bundle --title "Studio Rowan Preview 2"
```

That writes a bundle plus a `files.json` publish map. The repo stays the source
of truth; the bundle is derived every time and never edited by hand. The script
applies three adaptations and nothing else, all of them properties of the
artifact host rather than of the design — the document wrapper comes from the
host, `/fonts/*.woff2` becomes relative because nothing is served from `/`, and
the spin ships one tier in one format because of the cap on files per publish.
See the docstring for why each is needed.

## Prototypes

Five full-site design directions built from the brand guidelines and the
website copy live under [`prototypes/`](prototypes/). Open
`http://localhost:4175/prototypes/` for the index, which also lists the
working assumptions (display-font stand-in, contact address, copy variant).
Each prototype is a self-contained `index.html`; shared tokens and the
extracted wordmark/icon SVGs are in `prototypes/shared/`.
