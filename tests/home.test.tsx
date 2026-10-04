import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("home gives recruiters an engineering identity and working section navigation without JavaScript", async () => {
  assert.ok(existsSync("src/app/page.tsx"), "Engineering homepage is missing");
  const { default: Home } = await import("../src/app/page");
  const html = renderToStaticMarkup(<Home />);
  assert.match(html, /<h1[^>]*>.*Software.*Cloud.*Infrastructure/s);
  assert.match(html, /Sasiru Vishmika/);
  for (const id of [
    "work",
    "domains",
    "about",
    "background",
    "stack",
    "contact",
  ])
    assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="#work"/);
  assert.match(html, /mailto:sasiruvishmika@gmail.com/);
  assert.match(html, /Computer Science degree/);
  assert.doesNotMatch(html, /progressbar|24\/4|years of experience|certified/i);
});
