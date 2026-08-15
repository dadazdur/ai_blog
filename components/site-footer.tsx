import Link from "next/link";
import { Container } from "@/components/ui";
import { Wordmark } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Contenuti",
    links: [
      { label: "Tutti gli articoli", href: "/blog" },
      { label: "Risorse scaricabili", href: "/risorse" },
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
    <footer className="mt-24 border-t border-rule bg-surface">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <p className="font-display text-[1.35rem] leading-none text-ink">
            <Wordmark />
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
            Formazione pratica sull&apos;intelligenza artificiale per commercialisti, revisori e consulenti del
            lavoro. Niente hype: solo quello che funziona in studio.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="t-label mb-3">{column.title}</p>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.9rem] text-ink-soft transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-rule">
        <Container className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-meta">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="t-meta">
            I contenuti hanno finalità informativa e non sostituiscono la consulenza professionale.
          </p>
        </Container>
      </div>
    </footer>
  );
}
