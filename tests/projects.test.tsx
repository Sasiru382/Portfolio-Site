import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("selected work opens complete source-traceable case studies with honest security limitations", async () => {
  assert.ok(
    existsSync("src/content/projects.ts"),
    "Source-backed case studies are missing",
  );
  const { projects } = await import("../src/content/projects");
  const { CaseStudy } = await import("../src/components/case-study");
  const { default: Home } = await import("../src/app/page");
  const home = renderToStaticMarkup(<Home />);
  assert.equal(projects.length, 3);
  for (const project of projects) {
    assert.match(home, new RegExp(`href="/work/${project.slug}/"`));
    const html = renderToStaticMarkup(
      <CaseStudy project={project} />,
    ).replaceAll("&amp;", "&");
    for (const label of [
      "Problem",
      "Architecture",
      "What I built",
      "Engineering challenges",
      "Security & networking",
      "Result & learnings",
      "Source evidence",
    ])
      assert.ok(html.includes(label), label);
    assert.ok(
      project.sources.every((s) => /\/blob\/[a-f0-9]{40}\//.test(s.url)),
    );
    assert.ok(project.security.length > 100);
  }
  assert.match(projects[0].security, /authentication|authorization/);
  assert.doesNotMatch(home, /Soluto.*built by me|99\.9%|users served/);
});
