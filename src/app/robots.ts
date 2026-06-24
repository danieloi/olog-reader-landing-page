import type { MetadataRoute } from "next";

const SITE_URL = "https://ologreader.com";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all crawlers, including AI answer engines (GPTBot, ClaudeBot,
    // PerplexityBot, Google-Extended, etc.) — we want Olog Reader to be
    // discoverable and citable by answer engines for AEO.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
