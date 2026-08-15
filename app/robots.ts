import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // /api/og resta accessibile: è l'immagine che i social scaricano per le anteprime.
        allow: ["/", "/api/og"],
        disallow: ["/admin", "/area-riservata", "/auth/", "/newsletter/", "/accedi", "/recupera-password"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
