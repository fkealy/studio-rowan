# Verification tools

Run against a server on :4175 serving the repo root. Each takes
`AUDIT_URL` to point at either build, defaulting to `/preview-2/`.

| script | what it measures | why it exists |
|---|---|---|
| `sticky-audit.mjs` | every pinned act's stage position across its whole span, plus content that overflows a stage | pinned sections with vertical padding do not stick at the ends, and a stage clips what will not fit without any warning |
| `humanscroll.mjs` | whether a pinned stage stays at top 0 for its whole pin, under one continuous scroll | the pass/fail the others feed into |
| `hold.mjs` | how far you can scroll while a heading stays put | a full stop that does not hold is not a full stop |
| `gaps.mjs` | share of the viewport carrying visible content | finds sparse stretches |
| `voids.mjs` | sparse **and moving** stretches | the distinction that matters: sparse and held is a full stop, sparse and moving is a void. `gaps.mjs` cannot tell them apart |
| `measure.mjs` | total page length in viewport-heights, and act count | the fingerprint dimension |
| `csp-server.mjs` | serves the repo with the `_headers` CSP applied | the policy cannot be tested against a plain static server |

The scroll-craft harness itself (`scripts/shoot.mjs` in the skill) writes its
strips to `lab/` and `lab-p2/`, which are gitignored: ~50 full-page screenshots
per strip per build, 193MB for the two.
