# Deployment (not performed)

This branch must be reviewed before merging. Do not point production deployment at redesign/portfolio-v2 without explicit owner approval. No main merge or live deployment was performed.

## Local production preview
Use a supported Node.js version meeting Next's requirement (>=20.9; Node 24 LTS recommended). This implementation was exercised on installed Node 26.7.0 / npm 11.19.0.

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` serves the actual static `out/` artifact at http://localhost:3000. `next start` is deliberately not used for static export. The browser suite starts a separate production-export server on port 4173:

```sh
npx playwright install chromium
npm run test:e2e
```

## Canonical origin
Set `SITE_URL` at **build time** to the actual origin, with no subpath/query/fragment. The build validates its format. Without it, local metadata uses http://localhost:3000. Never publish that development canonical.

```sh
SITE_URL=https://YOUR-APPROVED-HOST npm run build
```

Replace the example value; it is not a proposed domain. Metadata, sitemap, robots and share image URLs are generated from this origin. Rebuild whenever the hosting origin changes. GitHub Pages project subpaths are not supported by the current root-path configuration; use root hosting or deliberately add/test basePath first.

## Vercel
After approval, import the repository and choose the branch you intend to deploy. Framework: Next.js; install `npm ci`; build `npm run build`; output `out` for this static-export configuration (override output if the hosting UI does not infer it). Choose supported Node LTS, set SITE_URL to the assigned/approved origin, then rebuild. Do not silently make this redesign the production branch. Preview origins require their own build-time SITE_URL or may retain the configured production canonical by deliberate policy.

## Other static hosting
Upload the **contents** of `out/` to an HTTPS host with directory-index support, including `_next/`, icons, OG PNG, sitemap.xml and robots.txt. Map missing paths to `404.html` with HTTP 404; do not use an SPA rewrite that returns 200 for everything. Root and each `/work/.../` directory contain real static HTML. No Node server, database, keys or runtime GitHub API is needed on the host.

Recommended headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Apply HSTS only after validating your HTTPS/domain policy. Cache hashed `_next/static/` assets immutably; keep HTML/robots/sitemap revalidatable. A strict CSP must account for Next inline bootstrap scripts with computed hashes; do not copy an unsafe generic policy.

## Publication checklist
Confirm resume/education/experience gaps; set correct SITE_URL; run all quality gates; inspect canonical/OG/sitemap/robots on the final host; test every source and contact link; confirm actual HTTP 404 and HTTPS. Local Lighthouse is lab evidence, not a guarantee of production network or field Core Web Vitals.
