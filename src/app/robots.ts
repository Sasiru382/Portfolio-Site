import type { MetadataRoute } from "next";
import { siteOrigin } from "../content/seo";
import { sitePath } from "../content/urls";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteOrigin}${sitePath("/sitemap.xml")}`,
  };
}
