import type { Metadata, Viewport } from "next";
import { Archivo, Chivo_Mono, Literata } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { isProductionDeploy, siteConfig } from "@/lib/site";
import "./globals.css";

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-literata",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-archivo",
});

const chivoMono = Chivo_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-chivo-mono",
});

const DIRECTION_CONTRACT = `<!--
THESIS: la pubblicazione professionale della categoria, eseguita meglio di chiunque la spedisca; rifiuta l'hero con griglia di card che ogni blog di settore monta per default.
OWN-WORLD: carta neutra fredda, inchiostro quasi nero, un solo accento oxblood che possiede intere regioni. Literata per titoli e testo, Archivo per i controlli, Chivo Mono solo dove c'e' testo-macchina. Filetti da 1px, nessuna card, nessuna ombra decorativa, nessun occhiello sopra i titoli.
STORY: capisce in tre secondi di cosa si parla e per chi, legge un pezzo vero fino in fondo, si iscrive.
FIRST VIEWPORT: testata sottile su un filetto; sotto, l'ultimo articolo a piena larghezza come testo (titolo Literata grande, sommario, riga di firma, prime righe reali) e la colonna di iscrizione a destra. Nessun blocco promozionale sopra il contenuto.
FORM: standard di categoria, la porta di uscita, scelta dall'utente dopo due tiri; metro di finitura Il Post / Stratechery / Every; seed 45ef1edb.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "intelligenza artificiale commercialisti",
    "AI per commercialisti",
    "AI per consulenti fiscali",
    "AI studio professionale",
    "prompt commercialisti",
    "consulenti fiscali e d'impresa",
    "automazione studio contabile",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${siteConfig.name} — Articoli` }] },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/api/og"],
  },
  // Solo il dominio di produzione entra nell'indice: le anteprime di Vercel
  // servono lo stesso contenuto e, indicizzate, competerebbero col sito vero.
  robots: isProductionDeploy
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#131211" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("sa-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Le variabili dei font vanno su <html>: `--stack-*` è dichiarata su :root e le
  // referenzia, e una var() non risolta lì invalida la dichiarazione per tutti.
  return (
    <html
      lang={siteConfig.lang}
      className={`${literata.variable} ${archivo.variable} ${chivoMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <a
          href="#contenuto"
          className="ui sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
        >
          Vai al contenuto
        </a>
        <SiteHeader />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
