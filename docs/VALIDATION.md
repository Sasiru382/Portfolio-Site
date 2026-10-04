# Production validation

Executed against the **static production export**, not the development server. Detailed logs, machine-readable results and screenshots are in `docs/validation/`. Reproducible commands are in README and deployment guidance.

## Quality gates

| Check | Actual result |
|---|---|
| Clean dependency install (`npm ci`) | Passed; lockfile reproducible |
| SSR/content tests (`npm test`) | **6 passed**, 0 failed, including project-path configuration regression |
| ESLint (`npm run lint`) | Exit 0, no warnings/errors |
| TypeScript (`npm run typecheck`) | Exit 0 |
| Production build (`npm run build`) | Exit 0; home, 3 case studies, not-found, sitemap and robots prerendered |
| Playwright production suite | **23 passed**, 0 skipped/flaky/unexpected; 38.4 seconds |
| axe WCAG 2 A/AA + 2.1 AA | Zero violations across 4 routes × 5 viewports |
| Console / network errors | None on the 20 tested route/viewport combinations |
| Internal links / section IDs | All tested route links HTTP 200; local anchor targets unique and present |
| External links | 14 unique HTTPS links checked: **13 HTTP 200**, 1 LinkedIn automation block (999), **0 confirmed broken** |
| Missing path | Actual HTTP 404; branded 404.html renders |
| Keyboard | Skip link, visible outline, main anchor and case-study return journey passed |
| Reduced motion / JavaScript disabled | Core content and case-study navigation usable; scroll behavior auto |
| Dependency audit (`npm audit`) | **0 vulnerabilities**, including development dependencies |
| Authored source security scan | 14 source/script files scanned; no hardcoded-secret, eval, unsafe HTML or shell=true findings |
| Diff whitespace (`git diff --check`) | Exit 0 |

Viewport matrix: **320×740, 390×844, 768×1024, 1280×800, 1440×1000**. Tested home and all three case-study routes at every width. Captured **20 final full-page screenshots** in `docs/validation/screenshots/`; crops were visually reviewed for desktop/mobile hero and case-study presentation.

## Measured Lighthouse 13.5.0

Executed with installed Playwright Chrome 153 against localhost production export. These are lab measurements, not field Core Web Vitals or a production-host guarantee.

| Mode | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | **98** | **100** | **100** | **100** | 0.8 s | 2.1 s | 130 ms | 0 |
| Desktop | **100** | **100** | **100** | **100** | 0.2 s | 0.5 s | 10 ms | 0 |

Raw JSON and HTML reports: `lighthouse-mobile.report.*`, `lighthouse-desktop.report.*`; concise summaries are adjacent. Homepage HTML is 49,931 bytes; aggregate emitted CSS 16,804 bytes; aggregate emitted framework JavaScript 565,437 bytes uncompressed. Lighthouse observed 149,527 total transferred bytes, including 135,020 script bytes. There are **no authored client components**, but Next still ships framework JavaScript; it is not a zero-JS claim. No external font/analytics/stock-image requests.

## Test-first / regression history

Vertical RED→GREEN slices were run in order:
1. Homepage identity/navigation: test failed with “Engineering homepage is missing”; semantic home implemented and passed.
2. Case studies: test failed with “Source-backed case studies are missing”; pinned content/shared views implemented and passed. HTML entity normalization fixed a test assertion, not project copy.
3. Search discovery: failed with “Search discovery is missing”; sitemap/robots/case metadata implemented and passed.
4. Visual/accessibility contract: failed with “Responsive accessible visual system is missing”; mobile-first CSS implemented and passed.
5. Real browser suite caught 320px home overflow (**scroll width 383 vs viewport 320**). DOM probe traced it to the minimum-size Infrastructure headline expanding the implicit grid. Responsive display font corrected; probe returned **320 / 320 with no overflowing elements**, then all 23 tests passed.
6. Screenshot review found an unavailable full-width decorative plus glyph. A failing SSR regression was added, the glyph replaced with ASCII plus, and the full suite passed.
7. Build review detected Tailwind's automatic source discovery including generated validation HTML. A failing source-scope regression was added, discovery restricted to `src/`, and the production stylesheet reduced to 16,804 bytes with the full browser suite still passing.

## Review findings and remaining limits

Legacy scroll exception, heading/input/icon accessibility problems, template metadata, private address/phone publication, excessive assets and stale resume behavior removed. The optional Next ESLint preset introduced five dev-only high-severity dependency findings and was incompatible with supported ESLint 10; replacing it with current JS/TypeScript recommended rules eliminated the findings. No unsupported transitive override or runtime downgrade was used.

No unresolved functional/visual/a11y defect was found within this test scope. LinkedIn requires manual confirmation. Only Chromium was exercised; no real Safari/iOS, assistive-technology session, live mailbox delivery or field performance verification occurred. Historical project tests/deployments were not executed. Source-backed case studies are not production-readiness certifications. An independent review reran the original quality gates successfully.

## GitHub Pages project-path validation

Owner approved the merge and existing-site deployment. Test-first regression initially failed because canonicals lacked `/Portfolio-Site`; after metadata/discovery support passed, native case-study navigation assertions failed and were corrected with the shared URL helper. Root defaults still pass all 23 browser tests. The project-path production build passed 20 route/viewport checks, zero axe/console/network/overflow findings, 13 asset checks, sitemap/robots, no-JavaScript navigation and HTTP 404. Actual results: `validation/pages-local.json`; mobile/desktop screenshots: `validation/screenshots/pages-*.png`. Deployment uses the existing main/root Pages source with checked-in generated export files because GitHub rejected workflow creation and Pages-settings updates with the available token's permissions. Live results are recorded in `validation/pages-live.json`.

## Verified live publication

PR [#1](https://github.com/Sasiru382/Portfolio-Site/pull/1) was merged at `aff70a8bb4f76162219fc24e9d5c33c502c8e107`. Publication commit `ff4aaf39a56374c4c7d2a11b96c77fccce333e2f` deployed successfully via [Pages run 37200344966](https://github.com/Sasiru382/Portfolio-Site/actions/runs/37200344966). API readback confirms `built`, HTTPS enforced, branded custom 404 and main/root source.

The actual **https://sasiru382.github.io/Portfolio-Site/** passed home plus all three directly loaded case-study routes at 320, 390, 768, 1280 and 1440 pixels: **20 checks**, zero WCAG axe violations, console/page/network errors or horizontal overflow. Canonical/OG metadata, project-prefixed native navigation, no-JavaScript case-study access, scripts/CSS/icons/share image, sitemap/robots and branded HTTP 404 passed. Mobile/desktop live screenshots were inspected and show the new styling without clipping. `validation/pages-live-integrity.json` confirms **all 43 exported files** fetched from the public URL match the tested local export byte-for-byte, including framework manifests and RSC payloads.
