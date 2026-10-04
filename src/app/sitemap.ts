import type { MetadataRoute } from "next";
import { projects } from "../content/projects";
import { siteOrigin } from "../content/seo";
import { sitePath } from "../content/urls";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteOrigin}${sitePath("/")}` },
    ...projects.map((project) => ({
      url: `${siteOrigin}${sitePath(`/work/${project.slug}/`)}`,
    })),
  ];
}
