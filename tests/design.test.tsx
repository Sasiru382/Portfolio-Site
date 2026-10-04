import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SystemMap } from "../src/components/sections";
import { existsSync, readFileSync } from "node:fs";

test("system diagram avoids unavailable full-width decorative glyphs", () => {
  assert.doesNotMatch(renderToStaticMarkup(<SystemMap />), /＋/);
});

test("visual system supplies mobile-first layouts visible keyboard focus and reduced-motion support", () => {
  assert.ok(
    existsSync("src/app/globals.css"),
    "Responsive accessible visual system is missing",
  );
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /@media\s*\(min-width:/);
  assert.match(css, /scroll-margin-top/);
  assert.doesNotMatch(css, /animation:\s*\w+\s+\d+s\s+infinite/);
});
