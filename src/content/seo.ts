import type { Metadata } from "next";
import { sitePath } from "./urls";
const configuredOrigin = process.env.SITE_URL || "http://localhost:3000";
const parsed = new URL(configuredOrigin);
if (
  !["http:", "https:"].includes(parsed.protocol) ||
  parsed.pathname !== "/" ||
  parsed.search ||
  parsed.hash
)
  throw new Error(
    "SITE_URL must be an absolute http(s) origin without a path, query or fragment",
  );
export const siteOrigin = parsed.origin;
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: sitePath(path) },
    openGraph: {
      title,
      description,
      url: sitePath(path),
      siteName: "Sasiru Vishmika · Engineering",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: sitePath("/og.png"),
          width: 1200,
          height: 630,
          alt: "Sasiru Vishmika — Software, Cloud & Infrastructure",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [sitePath("/og.png")],
    },
  };
}
