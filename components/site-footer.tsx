import Link from "next/link";
import { Container } from "@/components/ui";
import { CookiePreferences } from "@/components/consent";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Contenuti",
    links: [
      { label: "Tutti gli articoli", href: "/blog" },
      { label: "Risorse", href: "/risorse" },
      { label: "Feed RSS", href: "/feed.xml" },
    ],
  },
  {
    title: "Progetto",
    links: [
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Area riservata", href: "/area-riservata" },
      { label: "Iscriviti", href: "/registrati" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie policy", href: "/cookie-policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <Container className="grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <p className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">{siteConfig.name}</p>
          <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-2">
            Guide pratiche sull&apos;intelligenza artificiale per chi lavora in uno studio. Niente hype: quello che
            funziona, e dove il modello sbaglia.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="ui text-[0.82rem] font-semibold text-ink">{column.title}</p>
            <ul className="ui mt-3 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.88rem] text-ink-2 transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              {column.title === "Legale" ? (
                <li>
                  <CookiePreferences />
                </li>
              ) : null}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-rule">
        <Container className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="meta-sm">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="meta-sm">
            I contenuti hanno finalità informativa e non sostituiscono la consulenza professionale.
          </p>
        </Container>
      </div>
    </footer>
  );
}
