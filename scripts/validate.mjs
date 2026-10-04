import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
mkdirSync("docs/validation", { recursive: true });
const commands = [
  ["unit-tests", "npm", ["test"]],
  ["lint", "npm", ["run", "lint"]],
  ["typecheck", "npm", ["run", "typecheck"]],
  ["production-build", "npm", ["run", "build"]],
  ["dependency-audit", "npm", ["audit", "--json"]],
];
const checks = [];
for (const [name, command, args] of commands) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: 180000,
  });
  writeFileSync(`docs/validation/${name}.log`, result.stdout + result.stderr);
  checks.push({ name, exitCode: result.status });
  console.log(name, result.status, result.stdout, result.stderr);
  if (result.status !== 0) process.exit(result.status || 1);
}
const e2e = JSON.parse(readFileSync("docs/validation/e2e.json", "utf8"));
const links = JSON.parse(
  readFileSync("docs/validation/external-links.json", "utf8"),
);
const screenshots = readdirSync("docs/validation/screenshots").filter(
  (name) => name.endsWith(".png") && !name.includes("before"),
);
const summary = {
  checks,
  browser: e2e.stats,
  links: {
    total: links.length,
    reachable: links.filter((link) => link.classification === "reachable")
      .length,
    blocked: links.filter((link) => link.classification === "blocked").length,
    broken: links.filter((link) => link.classification === "broken").length,
  },
  screenshots: screenshots.length,
  homepageHtmlBytes: statSync("out/index.html").size,
  staticCssBytes: readdirSync("out/_next/static/chunks")
    .filter((name) => name.endsWith(".css"))
    .reduce(
      (total, name) => total + statSync(`out/_next/static/chunks/${name}`).size,
      0,
    ),
  staticJsBytes: readdirSync("out/_next/static/chunks")
    .filter((name) => name.endsWith(".js"))
    .reduce(
      (total, name) => total + statSync(`out/_next/static/chunks/${name}`).size,
      0,
    ),
};
writeFileSync("docs/validation/summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
