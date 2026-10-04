# Hero diagram clipping regression

## Reproduction and root cause

The user screenshot uses a desktop-layout mobile viewport. The published site reproduced the same bug at a 980px CSS viewport: the hero's computed grid columns were `705.625px 66px`, and each diagram row's content overflowed its available width. The long, unbroken **Infrastructure.** heading imposed its min-content width on the first implicit-minimum `fr` track. The two-column layout started at 900px, before the heading and diagram could fit together. The figure's `overflow: hidden` masked that internal overflow. This was not a missing diagram asset.

Changing only the grid to `minmax(0, ...)` stopped diagram starvation but made the heading overflow its own column. Viewport-based heading sizing also failed at 1200px because Tailwind's `.container` max-width caps do not follow viewport width continuously. Both probes were measured before choosing the column-based typography.

## Fix

- Keep the hero stacked below 1100px; preserve the rest of the site's breakpoints.
- Use explicit zero-minimum desktop tracks (`minmax(0, 1.7fr) minmax(0, 1fr)`) to prevent content-based diagram starvation.
- Size desktop heading text against the actual `.hero-copy` inline-size container (`15cqw`), retaining the original 6.8rem cap.
- Preserve all diagram content, styling, and clipping boundary; do not hide text or remove diagram elements.

## Red/green and local verification

The new Playwright regression failed on the original 980px layout with diagram children and text outside the figure and layer bounds. The final fix passes every test:

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: 6 passed.
- Root-default production build: pass.
- `npm run test:e2e`: 38 passed, including 15 hero regressions covering 320, 390, 600, 768, 899, 900, 980, 1024, 1099, 1100, 1200, 1279, 1280, 1440px and a touch/mobile 980px desktop-layout context.
- Project-path production build: pass.
- `node scripts/verify-pages.mjs`: 44 route/viewport checks, 13 assets, zero console/network errors, zero axe violations, correct metadata/navigation/no-JavaScript access and HTTP 404.

`scripts/hero-geometry.mjs` checks every diagram child's rectangle, internal scroll width, actual text ranges inside the figure and each row, and heading text against its column. This catches hidden internal clipping even when the document itself does not overflow. The same assertions run against root, project-path, and live Pages exports.

See `pages-local.json`, `e2e.json`, and screenshots `pages-980.png`, `pages-mobile-desktop-980.png`, and `pages-1440.png`. Live evidence is recorded separately after publication.
