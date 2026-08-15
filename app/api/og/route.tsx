import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const revalidate = 86400;

/**
 * Immagine social generata al volo: /api/og?title=…&kicker=…&meta=…
 * Nessuna immagine da produrre a mano per ogni articolo, e la card resta
 * coerente con l'identità del sito su LinkedIn, WhatsApp e X.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? siteConfig.tagline).slice(0, 120);
  const kicker = searchParams.get("kicker");
  const meta = searchParams.get("meta");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f5f1",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          borderTop: "14px solid #0a6b4e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#14211c", letterSpacing: "-0.02em" }}>
            <span style={{ fontWeight: 600 }}>Studio</span>
            <span style={{ color: "#0a6b4e", fontStyle: "italic", marginLeft: 10 }}>Aumentato</span>
          </div>
          {kicker ? (
            <div
              style={{
                display: "flex",
                fontSize: 18,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#56655c",
              }}
            >
              {kicker}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 58 : 70,
            lineHeight: 1.1,
            color: "#14211c",
            letterSpacing: "-0.03em",
            maxWidth: 960,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #c3ccbe",
            paddingTop: 24,
            fontSize: 22,
            color: "#56655c",
          }}
        >
          <span>{meta ?? "Intelligenza artificiale per commercialisti"}</span>
          <span>studioaumentato.it</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
