#!/usr/bin/env python3
"""Build a Claude artifact bundle from a preview directory.

The site deploys through Cloudflare Pages, where a preview is served from its
own path at the site root. A Claude artifact is a different host with three
constraints the site does not have, so a preview cannot simply be uploaded:

  1. The artifact supplies <!doctype>, <html>, <head> and <body>. The page
     content goes in directly, without them.
  2. Nothing is served from `/`. The previews load `/fonts/*.woff2` by
     root-absolute path, which is correct site-level and unreachable there.
  3. There is a cap on files per publish, and a 87-frame spin sequence in
     three tiers and two formats is 522 of them.

This script applies exactly those three adaptations and nothing else, so the
repo never has to carry a change it does not need and the copy can never drift
by hand. The repo is the source of truth; the artifact is a mirror of it.

    python3 tools/artifact-bundle.py preview-2 /tmp/bundle
    python3 tools/artifact-bundle.py preview-2 /tmp/bundle --tier 720

Prints the publish file map to <out>/files.json.
"""
import argparse, json, re, shutil, sys
from pathlib import Path

# The artifact tool's per-publish cap. Worth failing on rather than finding out
# at publish time.
FILE_CAP = 255


def strip_document_wrapper(html: str) -> str:
    """Return the page content the artifact host expects to be handed.

    Title, meta, the js-class script and the stylesheet links all survive and
    stay where they are: browsers honour every one of them in the body, and
    keeping them means this transform never has to understand the page.
    """
    for tag in ('<!doctype html>', '<html lang="en">', '<head>', '</head>',
                '<body>', '</body>', '</html>'):
        if tag not in html:
            sys.exit(f'expected {tag!r} in the preview markup; the wrapper has changed')
        html = html.replace(tag + '\n', '', 1) if tag + '\n' in html else html.replace(tag, '', 1)

    # charset and viewport come from the host skeleton; ours would be duplicates.
    html = html.replace('<meta charset="utf-8">\n', '', 1)
    html = re.sub(r'<meta name="viewport"[^>]*>\n', '', html, count=1)
    return html.lstrip('\n')


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('preview', help='preview directory, e.g. preview-2')
    ap.add_argument('out', help='bundle output directory (emptied first)')
    ap.add_argument('--tier', default='1024', help='spin tier to ship (default 1024)')
    ap.add_argument('--title', default=None, help='<title> for the artifact gallery')
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    src = (root / args.preview).resolve()
    out = Path(args.out).resolve()
    if not (src / 'index.html').is_file():
        sys.exit(f'no index.html in {src}')

    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)

    # ---- flat files and whole directories that carry over unchanged ---------
    for name in ('og.jpg',):
        if (src / name).is_file():
            shutil.copy2(src / name, out / name)
    for d in ('engine', 'media'):
        if (src / d).is_dir():
            shutil.copytree(src / d, out / d)

    # ---- the spin: one tier, one format ------------------------------------
    spin = src / 'spin'
    if spin.is_dir():
        (out / 'spin').mkdir()
        for still in spin.glob('still.*'):
            shutil.copy2(still, out / 'spin' / still.name)
        tier = spin / args.tier
        if not tier.is_dir():
            sys.exit(f'no spin tier {args.tier} in {spin}')
        (out / 'spin' / args.tier).mkdir()
        frames = sorted(tier.glob('*.webp'))
        if not frames:
            sys.exit(f'no .webp frames in {tier}')
        for f in frames:
            shutil.copy2(f, out / 'spin' / args.tier / f.name)
        # webp only, deliberately. page.js probes for .avif first and falls back
        # on a 404, so dropping the avif halves the file count and costs one
        # failed request; dropping the webp instead would leave no fallback at
        # all. spin/still.avif stays, because <picture> has no fallback when a
        # <source> it has already chosen 404s.

    # ---- CSS and JS, with the two host adaptations -------------------------
    css = (src / 'styles.css').read_text()
    fonts = sorted(set(re.findall(r'/fonts/([\w.-]+\.woff2)', css)))
    css = css.replace('url("/fonts/', 'url("fonts/')
    (out / 'styles.css').write_text(css)

    js = (src / 'page.js').read_text()
    tiers = re.search(r'^(\s*)var TIERS = \[[\d, ]+\];.*$', js, re.M)
    if not tiers:
        sys.exit('could not find the TIERS declaration in page.js')
    js = (js[:tiers.start()]
          + f'{tiers.group(1)}var TIERS = [{args.tier}];'
            f'  /* artifact mirror: one tier ships, see tools/artifact-bundle.py */'
          + js[tiers.end():])
    (out / 'page.js').write_text(js)

    # ---- the fonts the preview actually asks for ---------------------------
    if fonts:
        (out / 'fonts').mkdir()
        for f in fonts:
            wof = root / 'fonts' / f
            if not wof.is_file():
                sys.exit(f'{wof} is referenced by styles.css but not in the repo')
            shutil.copy2(wof, out / 'fonts' / f)

    # ---- the page ----------------------------------------------------------
    html = strip_document_wrapper((src / 'index.html').read_text())
    html = html.replace('href="/fonts/', 'href="fonts/')
    if args.title:
        html = re.sub(r'<title>.*?</title>', f'<title>{args.title}</title>', html, count=1, flags=re.S)
    if '/fonts/' in html:
        sys.exit('a root-absolute /fonts/ path survived the rewrite')
    (out / 'index.html').write_text(html)

    # ---- the publish map ---------------------------------------------------
    paths = sorted(str(p.relative_to(out)) for p in out.rglob('*')
                   if p.is_file() and p.name != 'index.html')
    if len(paths) > FILE_CAP:
        sys.exit(f'{len(paths)} supporting files, over the {FILE_CAP} cap')
    (out / 'files.json').write_text(json.dumps({p: p for p in paths}, indent=0))

    total = sum(p.stat().st_size for p in out.rglob('*') if p.is_file())
    print(f'{out}')
    print(f'  {len(paths)} supporting files + index.html, {total / 1e6:.1f} MB')
    print(f'  publish with root={out} and the map in files.json')


if __name__ == '__main__':
    main()
