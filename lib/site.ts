/**
 * Configurazione centrale del sito.
 *
 * Da questo URL derivano canonical, sitemap, feed, anteprime social e i link
 * dentro le email di conferma. Sbagliarlo non rompe niente a schermo, ma manda
 * i motori e gli iscritti su un indirizzo diverso da quello del progetto.
 */

/** Il dominio pubblico. In produzione vince su qualunque indirizzo tecnico di Vercel. */
export const PRODUCTION_URL = "https://www.lescritture.com";

function readSiteUrl() {
  // 1. Una variabile esplicita batte tutto: serve per staging o cambi di dominio.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // 2. In produzione il dominio del progetto è noto, e non dipende da una
  //    variabile che qualcuno deve ricordarsi di impostare. `VERCEL_PROJECT_PRODUCTION_URL`
  //    resta l'indirizzo *.vercel.app se il dominio è stato collegato dopo la build,
  //    e i link di conferma finirebbero lì.
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
  if (env === "production") return PRODUCTION_URL;

  // 3. Anteprime: l'indirizzo effimero che Vercel assegna al deploy.
  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

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
