import type { MetadataRoute } from 'next';
import { projects } from '../content/projects';
import { siteOrigin } from '../content/seo';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteOrigin}/` }, ...projects.map(project => ({ url: `${siteOrigin}/work/${project.slug}/` }))];
}
