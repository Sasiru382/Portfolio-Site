# Original portfolio audit

Baseline: `224d6d0`, inspected on redesign/portfolio-v2. Main is preserved. Full tracked inventory inspected; authored HTML, JavaScript, Gulp and Sass composition/layout rules read; vendored Bootstrap/jQuery/icon distributions identified rather than treated as authored work.

## Architecture and code
Static index.html (425 lines), a template component catalogue, compiled Steller stylesheet, 101 Sass files (mostly Bootstrap 4.3.1), jQuery 3.4.1, Bootstrap bundles/affix and Themify icon fonts. Gulp paths point at nonexistent public_html; package start calls gulp without a default task. No lockfile, tests, type checking or useful project documentation. Legacy gulp-sass depends on obsolete native Sass tooling. Smooth scrolling is coupled to jQuery; the scroll listener calls nonexistent document.id and throws. Inline scripts/styles mix presentation and behavior.

## Content and evidence
Preserve name, email, GitHub identity, useful project repository references, Sri Lanka location at country granularity and DevCRUD MIT license. Discard percentage bars, generic service marketing, stale undergraduate wording, template metadata, unsupported availability claims, social redirect wrappers and private street/phone data. The user confirms a Computer Science degree, not institution, dates or classification. No verified employer chronology or certifications exists. NBA repository identifies a team project and names Sasiru as a member; it does not prove individual responsibilities. Kamus is a fork of Soluto/kamus; public master does not evidence Kamus26 modernization. Never credit upstream architecture to Sasiru.

## Accessibility / responsive design
No h1, section headings predominantly h6, repeated home IDs, unlabeled contact inputs, icon-only social/project links, buttons nested in anchors, missing meaningful image alternatives, untitled map iframe and no skip link. Hero bitmap has inline 500×700 dimensions and is hidden on smaller breakpoints. Desktop-first 94vh header/min-height 650px and overlay-only project actions are poor mobile/reduced-motion foundations. Percentage aria values disagree with visuals. These are source-inspection findings, not invented baseline browser measurements.

## Assets / performance
Assets total 12,636,386 bytes on disk, including many unused stock images, complete vendor sources/maps, demo imagery and icon fonts. Above-fold image has fixed dimensions; images lack lazy-loading. Unminified scripts, map embed, Google analytics and external font import add unnecessary requests/privacy surface. All template assets are retired on this branch; original remains in main/history. New visuals are CSS/semantic architecture diagrams and tiny SVG assets; no stock photography or tracking.

## SEO
Generic Steller description/Devcrud author, vague title, no OG/canonical/sitemap/robots/icons/structured data and weak heading hierarchy. Broken historical E-Sports repository name corrected by GitHub inventory. Resume viewer returns HTTP 200 but freshness is unverified; omit download CTA. LinkedIn identity corroborated in GitHub profile README; automated HTTP request is blocked with 999, not evidence of a broken profile.

## Decision
Rebuild instead of adapting template: Next.js App Router, TypeScript, Tailwind 4, static export, server components, no custom client JavaScript. Version choices verified from npm registry. Keep runtime dependencies limited to Next/React; test/audit tooling is development-only. Traceable public source snapshots support case studies; broad infrastructure skills use user-provided scope, not invented deployments or proficiency levels.
