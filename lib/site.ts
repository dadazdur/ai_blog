/**
 * Configurazione centrale del sito.
 * Cambia NEXT_PUBLIC_SITE_URL nel .env quando registri il dominio definitivo:
 * canonical, sitemap, RSS, JSON-LD e Open Graph si allineano da soli.
 */

const fallbackUrl = "https://www.studioaumentato.it";

export const siteConfig = {
  name: "Studio Aumentato",
  tagline: "L'intelligenza artificiale al servizio del tuo studio",
  description:
    "Guide pratiche, prompt testati e strumenti operativi per commercialisti che vogliono usare l'intelligenza artificiale nel lavoro di ogni giorno, senza perdere il controllo.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/$/, ""),
  locale: "it_IT",
  lang: "it",
  email: "redazione@studioaumentato.it",
  linkedin: "https://www.linkedin.com/company/studio-aumentato",
  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Risorse", href: "/risorse" },
    { label: "Chi siamo", href: "/chi-siamo" },
  ],
  postsPerPage: 9,
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
