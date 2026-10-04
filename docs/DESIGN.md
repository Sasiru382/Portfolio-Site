# Design decisions

Graphite canvas with off-white copy, periwinkle accents and raised panels. Tokens live at the top of `src/app/globals.css`; mobile-first rules expand at 600px and 900px. Visual vocabulary draws on restrained developer tooling, not a copied template.

- Large three-line identity puts software, cloud and infrastructure in the first screen. A concise description adds DevOps, networking and security without promising a job history.
- A conceptual three-layer system diagram makes the cross-disciplinary direction tangible; it is explicitly not a claim of deployed architecture.
- The first project connects source to Azure delivery. Two source-backed foundations follow, with separate complete routes and honest security limitations.
- Six domain panels tell the capability story; grouped stack tags disclose technologies without misleading scores.
- About explains progression; background communicates verified project practice and degree without invented dates/employers.
- Native wrapping navigation works without client state, a hamburger, or hidden menus. Static anchors are intentional; server components still include the Next framework runtime, but there are no authored client components or animation libraries.
- System sans-serif and monospace fonts avoid third-party requests and font-flash shifts. Responsive typography, fine borders and a single subtle gradient create hierarchy without noisy effects.
- Semantic architecture lists replace heavy images. Only icon/social assets are rasterized from first-party SVG sources; OG PNG is generated for broad crawler compatibility.
- Focus outlines, skip link, minimum 44px interactive height, readable secondary text and reduced-motion rules are explicit. Native page/anchor navigation avoids prefetch downloads and keeps paths portable.
- Source verification badge means inspected source, not production readiness. The scopes beneath cards and full notes distinguish configured workflows, coursework and proven outcomes.

## Dependency decisions
Next 16.3.8, React 19.3.0 and Tailwind 4.3.3 were queried from the registry rather than guessed. Removed Bootstrap, jQuery, Gulp/native Sass, icon fonts, stock images and all unused template files. Original remains in main/history; DevCRUD MIT license retained.

ESLint 10 + current typescript-eslint/JS recommended rules replace eslint-config-next: the Next preset pulled vulnerable braces through fast-glob and React/import/a11y plugins incompatible with ESLint 10. Removing that optional preset eliminated all npm audit findings without downgrading supported ESLint or forcing a vulnerable transitive override. Accessibility is checked against rendered production pages with axe; TypeScript and SSR/browser tests cover the actual server-only implementation.
