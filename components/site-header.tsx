import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      Studio <em className="text-accent">Aumentato</em>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-ground/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[1.35rem] leading-none tracking-[-0.02em] text-ink"
          aria-label={`${siteConfig.name} — home`}
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigazione principale">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.92rem] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/area-riservata" size="sm" variant="outline" className="hidden sm:inline-flex">
            Area riservata
          </ButtonLink>
          <MobileNav isAuthed={false} isAdmin={false} />
        </div>
      </Container>
    </header>
  );
}
