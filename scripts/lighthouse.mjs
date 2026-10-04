import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import { spawnSync } from "node:child_process";
mkdirSync("docs/validation", { recursive: true });
const health = await fetch("http://127.0.0.1:4173/");
if (!health.ok) throw new Error("Production server unavailable");
for (const mode of ["mobile", "desktop"]) {
  const args = [
    "exec",
    "--yes",
    "--package=lighthouse",
    "--",
    "lighthouse",
    "http://127.0.0.1:4173/",
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--output=json",
    "--output=html",
    `--output-path=docs/validation/lighthouse-${mode}`,
  ];
  if (mode === "desktop") args.push("--preset=desktop");
  const result = spawnSync("npm", args, {
    env: { ...process.env, CHROME_PATH: chromium.executablePath() },
    encoding: "utf8",
    timeout: 180000,
  });
  console.log(mode, result.status, result.stdout, result.stderr);
  if (result.status !== 0) process.exit(result.status || 1);
  const data = JSON.parse(
    readFileSync(`docs/validation/lighthouse-${mode}.report.json`, "utf8"),
  );
  const summary = {
    mode,
    fetchTime: data.fetchTime,
    version: data.lighthouseVersion,
    categories: Object.fromEntries(
      Object.entries(data.categories).map(([key, val]) => [key, val.score]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
      ].map((key) => [key, data.audits[key].displayValue]),
    ),
  };
  writeFileSync(
    `docs/validation/lighthouse-${mode}-summary.json`,
    JSON.stringify(summary, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
}
