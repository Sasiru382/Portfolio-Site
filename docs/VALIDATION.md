# Production validation

Executed against the **static production export**, not the development server. Detailed logs, machine-readable results and screenshots are in `docs/validation/`. Reproducible commands are in README and deployment guidance.

## Quality gates

| Check | Actual result |
|---|---|
| Clean dependency install (`npm ci`) | Passed; lockfile reproducible |
| SSR/content tests (`npm test`) | **5 passed**, 0 failed |
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

No unresolved functional/visual/a11y defect was found within this test scope. Remaining publication constraints are content approval and actual SITE_URL; LinkedIn requires manual confirmation. Only Chromium was exercised; no real Safari/iOS, assistive-technology session, live mailbox delivery, remote deployment or field performance verification occurred. Historical project tests/deployments were not executed. Source-backed case studies are not production-readiness certifications. Parent agent is expected to perform an independent final review.
