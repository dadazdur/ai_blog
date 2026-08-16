import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionDeploy, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Anteprime e sviluppo restano fuori dall'indice: un'anteprima indicizzata
  // compete con la produzione sulle stesse parole e si porta via le posizioni.
  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

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
