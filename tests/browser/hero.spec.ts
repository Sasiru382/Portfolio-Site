import { test, expect } from '@playwright/test';
import { heroGeometry } from '../../scripts/hero-geometry.mjs';

const widths = [320, 390, 600, 768, 899, 900, 980, 1024, 1099, 1100, 1200, 1279, 1280, 1440];
for (const width of widths) {
  test(`hero diagram and heading content fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(heroGeometry);
    expect(geometry.issues, JSON.stringify(geometry)).toEqual([]);
    expect(await page.locator('.map-layer').count()).toBe(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('mobile Chrome desktop-layout viewport keeps all diagram text visible', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 980, height: 1800 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  const geometry = await page.evaluate(heroGeometry);
  expect(geometry.issues, JSON.stringify(geometry)).toEqual([]);
  await context.close();
});
