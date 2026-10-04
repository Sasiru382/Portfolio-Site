import { test } from "node:test";
import { execFileSync } from "node:child_process";

test("project-path builds prefix canonical, discovery and share assets", () => {
  execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    import { pageMetadata } from './src/content/seo.ts';
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.url);
    const sitemap = require('./src/app/sitemap.ts').default;
    const robots = require('./src/app/robots.ts').default;
    const metadata = pageMetadata('Test', 'Description', '/work/test/');
    assert.equal(metadata.alternates.canonical, '/Portfolio-Site/work/test/');
    assert.equal(metadata.openGraph.images[0].url, '/Portfolio-Site/og.png');
    assert.equal(sitemap()[0].url, 'https://sasiru382.github.io/Portfolio-Site/');
    assert.equal(robots().sitemap, 'https://sasiru382.github.io/Portfolio-Site/sitemap.xml');
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const { ProjectCard, CaseStudy } = require('./src/components/case-study.tsx');
    const { projects } = require('./src/content/projects.ts');
    const card = renderToStaticMarkup(React.createElement(ProjectCard, { project: projects[0], index: 0 }));
    assert.ok(card.includes('href="/Portfolio-Site/work/' + projects[0].slug + '/"'));
    const study = renderToStaticMarkup(React.createElement(CaseStudy, { project: projects[0] }));
    assert.ok(study.includes('href="/Portfolio-Site/#work"'));
  `], { env: { ...process.env, SITE_URL: "https://sasiru382.github.io", NEXT_PUBLIC_BASE_PATH: "/Portfolio-Site" }, stdio: "pipe" });
});
