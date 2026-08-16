import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const revalidate = 86400;

/**
 * Immagine social generata al volo: /api/og?title=…&kicker=…&meta=…
 * Stessa carta, stesso inchiostro e stesso accento del sito, così la
 * condivisione su LinkedIn o WhatsApp resta riconoscibile.
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
          background: "#f5f5f3",
          padding: "60px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 27, color: "#161514", letterSpacing: "-0.02em", fontWeight: 600 }}>
            Studio Aumentato
          </div>
          {kicker ? (
            <div style={{ display: "flex", fontSize: 21, color: "#7b1e2e" }}>{kicker}</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 75 ? 56 : 68,
            lineHeight: 1.08,
            color: "#161514",
            letterSpacing: "-0.032em",
            fontWeight: 600,
            maxWidth: 950,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #c9c7c1",
            paddingTop: 22,
            fontSize: 21,
            color: "#55534e",
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
