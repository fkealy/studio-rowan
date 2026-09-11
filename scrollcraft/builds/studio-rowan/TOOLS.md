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
| `pace.mjs` | per section: words carried, scroll it is on screen for, and how much of that it is **held still** for | a page can pass every other check and still spend all its stillness on its emptiest screens. This is the ratio that catches it |
| `coresident.mjs` | frames where two chapters' copy are readable at once | a chaptered grammar says one thing at a time; any join that shows two is a missing full stop |
| `clip-audit.mjs` | content that is **revealed and outside** a stuck stage, walked across the whole pin (`SIZES=1440x900,1366x768,...`) | `overflow: clip` hides the failure completely. Two naive versions of this check both produced false positives — see BUILD-NOTES — so it walks ancestors for effective opacity and samples the whole act |
| `measure.mjs` | total page length in viewport-heights, and act count | the fingerprint dimension |
| `csp-server.mjs` | serves the repo with the `_headers` CSP applied | the policy cannot be tested against a plain static server |

The scroll-craft harness itself (`scripts/shoot.mjs` in the skill) writes its
strips to `lab/` and `lab-p2/`, which are gitignored: ~50 full-page screenshots
per strip per build, 193MB for the two.
