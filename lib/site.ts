/**
 * Configurazione centrale del sito.
 *
 * L'URL non è mai un segnaposto in produzione: se `NEXT_PUBLIC_SITE_URL` non è
 * impostata, si ricade sul dominio che Vercel espone da sé. Un canonical che
 * punta a un dominio inesistente dice ai motori di non indicizzare la pagina
 * che stanno leggendo, quindi il segnaposto è la peggiore delle ipotesi.
 */

function readSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Fornite automaticamente da Vercel, senza doverle configurare a mano.
  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL;

  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

/** `production` solo sul dominio di produzione: le anteprime restano fuori dall'indice. */
export const deployEnv = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? "development";
export const isProductionDeploy = deployEnv === "production";

export const siteConfig = {
  name: "Le Scritture",
  tagline: "L'intelligenza artificiale al servizio del tuo studio",
  description:
    "Guide pratiche, prompt testati e strumenti operativi per consulenti fiscali e d'impresa che vogliono usare l'intelligenza artificiale nel lavoro di ogni giorno, senza perdere il controllo.",
  url: readSiteUrl(),
  locale: "it_IT",
  lang: "it",
  email: "redazione@lescritture.com",
  linkedin: "https://www.linkedin.com/company/le-scritture",
  nav: [
    { label: "Articoli", href: "/blog" },
    { label: "Risorse", href: "/risorse" },
    { label: "Chi siamo", href: "/chi-siamo" },
  ],
  postsPerPage: 9,
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
