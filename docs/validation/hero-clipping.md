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

See `pages-local.json`, `e2e.json`, and screenshots `pages-980.png`, `pages-mobile-desktop-980.png`, and `pages-1440.png`.

## Publication and live verification

- Source fix: `27cccac`; production export: `385a2d6fb8ffa10bddbcd36ffb01993d5b0b9b7a`, fast-forwarded to main and published through the existing main/root Pages source without changing Pages settings or workflows.
- GitHub Pages deployment [37201461820](https://github.com/Sasiru382/Portfolio-Site/actions/runs/37201461820): completed successfully for that export SHA.
- Public URL: **https://sasiru382.github.io/Portfolio-Site/**.
- Live `verify-pages.mjs`: 44 route/viewport checks, 13 assets, zero console/network errors, zero axe violations, correct HTTP 404 and all twelve hero geometry checks (eleven widths plus mobile desktop-layout) passed. At 980px, the diagram is now 530px wide instead of 66px, with every label visible; at 1440px the side-by-side diagram is 404.438px wide.
- A live every-pixel sweep from 900 through 1280px passed **381** viewport checks with zero internal clipping, heading overflow or document overflow (`hero-live-sweep.json`).
- All **43** public export files matched the tested local artifact byte-for-byte (`hero-artifact-integrity.json`), including the new `2ktbk8-oruz7w.css` bundle.
- Live report: `hero-pages-live.json`. Screenshots: `live-980.png`, `live-mobile-desktop-980.png`, and `live-1440.png`; the mobile-desktop screenshot was visually inspected and shows all three complete rows and both foundation labels.
