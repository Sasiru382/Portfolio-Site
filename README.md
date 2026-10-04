# Sasiru Vishmika · Engineering portfolio

A source-backed portfolio with a software foundation and a cloud, infrastructure, DevOps, networking and security direction. The owner approved the redesign merge and publication to **https://sasiru382.github.io/Portfolio-Site/**. Source lives on `main`; the production export is published from `gh-pages`.

## Run

```sh
npm ci
npm run dev
```

Production export: `npm run build` → `out/`, then `npm start`.

## Quality gates

```sh
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
npm run audit:links
```

`npm run assets` regenerates the OG/Apple PNGs from SVGs. After a browser run, `npm run validate` captures unit/lint/type/build/audit logs and aggregates the saved results. Optional Lighthouse rerun: serve the export on port 4173, then `node scripts/lighthouse.mjs` (downloads the Lighthouse CLI via npm; uses installed Playwright Chromium).

## Structure

- `src/app/` — App Router pages, layout, static sitemap/robots, responsive styles
- `src/content/` — typed profile, pinned-source case studies and canonical metadata
- `src/components/` — reusable section headings, architecture diagrams and case-study views
- `public/` — first-party icons and OG image
- `tests/` — test-first SSR/content contracts plus production Playwright/axe suite
- `docs/validation/` — real browser screenshots, link checks and measured Lighthouse reports

No authored client components, third-party font requests, analytics, fake counters or proficiency percentages. Case studies name implementation limitations and evidence boundaries rather than inventing production results.

## Maintainer documentation

[Audit](docs/AUDIT.md) · [Architecture](docs/ARCHITECTURE.md) · [Design](docs/DESIGN.md) · [Evidence](docs/EVIDENCE.md) · [Content gaps](docs/CONTENT-GAPS.md) · [Validation](docs/VALIDATION.md) · [Deployment](docs/DEPLOYMENT.md)

Set `SITE_URL` to the actual approved origin and `NEXT_PUBLIC_BASE_PATH` to the hosting project path before a publication build. Pages production uses `https://sasiru382.github.io` and `/Portfolio-Site`. Both default to local root preview behavior when unset. See deployment guidance for project-path and live verification and the workflow-token limitation. Missing employment/education dates and current resume are not fabricated; see content gaps. Preserve pinned commit sources when changing case studies and require evidence for new claims.

Original Steller template was authored by DevCRUD under MIT; its license is retained in `LICENSE.txt`. Retired assets remain in git history.
