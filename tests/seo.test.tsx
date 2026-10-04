import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('search metadata exposes every static case study under the configured origin', async () => {
  assert.ok(existsSync('src/app/sitemap.ts'), 'Search discovery is missing');
  const { default: sitemap } = await import('../src/app/sitemap');
  const { default: robots } = await import('../src/app/robots');
  const { siteOrigin, pageMetadata } = await import('../src/content/seo');
  const { generateStaticParams, generateMetadata } = await import('../src/app/work/[slug]/page');
  const urls = sitemap().map(item => item.url);
  assert.equal(urls.length, 4);
  assert.ok(urls.every(url => url.startsWith(siteOrigin)));
  assert.equal(robots().sitemap, `${siteOrigin}/sitemap.xml`);
  assert.equal(pageMetadata('Test case', 'A description', '/work/test/').alternates?.canonical, '/work/test/');
  for (const params of generateStaticParams()) {
    const metadata = await generateMetadata({ params: Promise.resolve(params) });
    assert.ok(metadata.title);
    assert.ok(metadata.description);
    assert.ok(urls.includes(`${siteOrigin}/work/${params.slug}/`));
  }
  assert.ok(existsSync('public/icon.svg'));
  assert.ok(existsSync('public/og.svg'));
});
