/* global document, innerWidth */
import { URL } from 'node:url';
import { setTimeout } from 'node:timers';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync, mkdtempSync, symlinkSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const live = process.env.VERIFY_URL;
const prefix = '/Portfolio-Site';
const origin = 'https://sasiru382.github.io';
const url = live || `http://127.0.0.1:4174${prefix}/`;
const output = process.env.VERIFY_OUTPUT || 'docs/validation/pages-local.json';
let server, directory;
if (!live) {
  directory = mkdtempSync(`${process.env.TMPDIR}/portfolio-pages-`);
  symlinkSync(resolve('out'), `${directory}${prefix}`, 'dir');
  server = spawn('python3', ['-m', 'http.server', '4174', '--bind', '127.0.0.1', '--directory', directory], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(url)).ok) break; } catch { /* wait for listener */ }
    await new Promise(r => setTimeout(r, 100));
  }
}
let browser;
const report = { url, routes: [], assets: [], errors: [], screenshots: [] };
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  const routes = ['', 'work/api-delivery-workflow/', 'work/student-data-system/', 'work/consultation-management/'];
  const assets = new Set();
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(new URL(route, url).href);
      assert.equal(response.status(), 200);
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
      assert.deepEqual(violations, []);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${origin}${prefix}/${route}`);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `${origin}${prefix}/og.png`);
      const locals = await page.locator('a[href^="/"]').evaluateAll(es => es.map(e => e.getAttribute('href')));
      for (const href of locals) assert.ok(href.startsWith(`${prefix}/`), `unprefixed link: ${href}`);
      const paths = await page.locator('script[src],link[href]').evaluateAll(es => es.map(e => e.getAttribute('src') || e.getAttribute('href')).filter(p => p.startsWith('/')));
      paths.forEach(p => assets.add(p));
      report.routes.push({ route, width, status: response.status(), axeViolations: 0 });
    }
  }
  for (const asset of [...assets, `${prefix}/robots.txt`, `${prefix}/sitemap.xml`, `${prefix}/og.png`, `${prefix}/apple-touch-icon.png`]) {
    const result = await page.request.get(new URL(asset, url).href);
    assert.equal(result.status(), 200, asset);
    report.assets.push({ path: asset, status: result.status() });
  }
  const sitemap = await (await page.request.get(new URL(`${prefix}/sitemap.xml`, url).href)).text();
  for (const route of routes) assert.ok(sitemap.includes(`${origin}${prefix}/${route}`));
  const robots = await (await page.request.get(new URL(`${prefix}/robots.txt`, url).href)).text();
  assert.ok(robots.includes(`${origin}${prefix}/sitemap.xml`));
  assert.equal((await page.request.get(new URL('nonexistent-route/', url).href)).status(), 404);
  report.notFoundStatus = 404;
  await page.goto(url);
  await page.getByRole('link', { name: 'Read case study' }).first().click();
  assert.ok(page.url().includes(`${prefix}/work/api-delivery-workflow/`));
  await page.getByRole('link', { name: 'All engineering work' }).click();
  assert.ok(page.url().endsWith(`${prefix}/#work`));
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto(url);
  await staticPage.getByRole('link', { name: 'Read case study' }).first().click();
  assert.ok(await staticPage.getByRole('heading', { name: 'Security & networking', exact: true }).isVisible());
  await nojs.close();
  mkdirSync('docs/validation/screenshots', { recursive: true });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    const path = `docs/validation/screenshots/${live ? 'live' : 'pages'}-${width}.png`;
    await page.screenshot({ path, fullPage: true });
    report.screenshots.push(path);
  }
  assert.deepEqual(report.errors, []);
  writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ url, viewportRouteChecks: report.routes.length, assets: report.assets.length, errors: report.errors, notFoundStatus: report.notFoundStatus, screenshots: report.screenshots }));
} finally {
  await browser?.close();
  server?.kill();
  if (directory) rmSync(directory, { recursive: true, force: true });
}
