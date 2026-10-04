# Deployment

The owner approved merging the redesign into `main` and publishing it to the existing GitHub Pages site:

**https://sasiru382.github.io/Portfolio-Site/**

## GitHub Pages

Source code is maintained on `main`; the verified static export is published to the dedicated `gh-pages` branch, with `.nojekyll` so `_next/` assets are served. Pages settings select `gh-pages` and `/`. This preserves the source repository and keeps the existing public URL.

A pinned least-privilege Actions workflow was prepared, but GitHub rejected its push because the available token does not have `workflow` scope. No credentials were expanded and no repository permissions were bypassed. Publication therefore uses the supported branch-source Pages mechanism. **A push to main alone does not republish the site**: build/verify the project-path export and publish its contents to `gh-pages` when updating. A future authorized workflow-capable credential can enable CI deployment.

Production was built with Node 24 LTS and `npm ci`. For a new publication, clone the `gh-pages` branch into a temporary checkout, replace its tracked artifact files with `out/` contents (preserving `.git`), add an empty `.nojekyll`, commit the source main SHA in the message and push normally. Never force-push main or publish the source tree itself. Verify the Pages build and live URL after publication.

Build-time configuration:

```sh
SITE_URL=https://sasiru382.github.io NEXT_PUBLIC_BASE_PATH=/Portfolio-Site npm run build
```

`SITE_URL` must be an absolute HTTP(S) origin without a path, query or fragment. `NEXT_PUBLIC_BASE_PATH` is empty by default, or a slash-prefixed path with no trailing slash. The shared `sitePath` helper prefixes native navigation, icons and social assets exactly once. Next `basePath` prefixes framework bundles. Canonical/OG, sitemap and robots use the same origin plus base path. Upload the **contents** of `out/`; do not nest the export under another `Portfolio-Site` directory in the Pages artifact.

## Local root preview

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

With neither environment variable configured, metadata uses http://localhost:3000 and the export is root-hosted. `npm start` serves `out/` at http://localhost:3000; `next start` is not used for static export.

```sh
npx playwright install chromium
npm run test:e2e
```

The root browser suite starts a separate export server on port 4173. Run it after a root-default build, not after a project-path build.

## Project-path and live verification

```sh
SITE_URL=https://sasiru382.github.io NEXT_PUBLIC_BASE_PATH=/Portfolio-Site npm run build
node scripts/verify-pages.mjs
VERIFY_URL=https://sasiru382.github.io/Portfolio-Site/ VERIFY_OUTPUT=docs/validation/pages-live.json node scripts/verify-pages.mjs
```

The project-path verifier creates a temporary local mount under `$TMPDIR`, starts/stops its own server on 4174, and checks home plus all three direct case-study routes at five viewport widths. It checks axe accessibility, overflow, console/network errors, canonical/OG metadata, all discovered scripts/styles/icons, sitemap/robots, HTTP 404, native navigation and no-JavaScript access. It captures mobile and desktop screenshots. Live verification uses the real Pages URL without starting a server.

## Other static hosts

Build with the actual approved origin and base path for that host. Upload all of `out/`, including `_next/`, icons, OG PNG, sitemap.xml, robots.txt and `404.html`. Use directory indexes and an actual HTTP 404 for unknown routes, not SPA catch-all rewrites. No Node server, database, secrets or runtime GitHub API is required.

GitHub Pages controls its response headers; custom hosts can add nosniff, a strict-origin referrer policy and a restrictive permissions policy. Cache hashed `_next/static/` assets immutably; keep HTML/robots/sitemap revalidatable. Any CSP must accommodate Next bootstrap scripts using computed hashes.

Remaining content gaps (resume, dates and manual LinkedIn confirmation) are documented in CONTENT-GAPS.md; no missing facts or custom domain were invented.
