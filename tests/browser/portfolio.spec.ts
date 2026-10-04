import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../../src/content/projects";
import { mkdirSync } from "node:fs";

const routes = ["/", ...projects.map((project) => `/work/${project.slug}/`)];
const viewports = [
  { name: "small-mobile", width: 320, height: 740 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 1000 },
];
for (const viewport of viewports)
  for (const route of routes) {
    test(`${viewport.name} ${route}: clean console, no overflow, accessible content and live internal links`, async ({
      page,
      request,
    }) => {
      await page.setViewportSize(viewport);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
      const links = await page
        .locator("a[href]")
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("href")!),
        );
      for (const href of [...new Set(links)]) {
        if (href.startsWith("#")) {
          expect(
            await page.locator(`[id="${href.slice(1)}"]`).count(),
            href,
          ).toBe(1);
        } else if (href.startsWith("/")) {
          const [path, hash] = href.split("#");
          const response = await request.get(path);
          expect(response.status(), href).toBe(200);
          if (hash)
            expect(await response.text(), href).toContain(`id="${hash}"`);
        }
      }
      expect(errors).toEqual([]);
      mkdirSync("docs/validation/screenshots", { recursive: true });
      const filename = route === "/" ? "home" : route.split("/")[2];
      await page.screenshot({
        path: `docs/validation/screenshots/${viewport.name}-${filename}.png`,
        fullPage: true,
      });
    });
  }

test("keyboard skip link, navigation and case-study return journey", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole("link", { name: "View engineering work" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole("link", { name: "Read case study" }).first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    projects[0].title,
  );
  await page.getByRole("link", { name: "All engineering work" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#work$/);
  const focusable = page
    .locator("a")
    .filter({ hasText: "View engineering work" });
  await focusable.focus();
  expect(
    await focusable.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    ),
  ).not.toBe("none");
});

test("reduced motion and no-JavaScript access preserve all content", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toContainText("Infrastructure");
  await page.getByRole("link", { name: "Read case study" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Security & networking", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await context.close();
});

test("SEO files and 404 status survive production export", async ({
  request,
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `http://localhost:3000${route}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "http://localhost:3000/og.png",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{40,}/,
    );
  }
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/icon.svg",
    "/og.png",
    "/apple-touch-icon.png",
  ])
    expect((await request.get(path)).status()).toBe(200);
  expect((await request.get("/nonexistent-route/")).status()).toBe(404);
  await page.goto("/404.html");
  await expect(
    page.getByRole("heading", { name: "This path ends here." }),
  ).toBeVisible();
});
