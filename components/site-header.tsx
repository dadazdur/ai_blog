import Link from "next/link";
import { Container } from "@/components/ui";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function Wordmark({ className }: { className?: string }) {
  return <span className={className}>Le Scritture</span>;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-md">
      <Container className="flex h-[3.25rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="font-semibold tracking-[-0.02em] text-ink text-[1.0625rem] leading-none"
          aria-label={`${siteConfig.name} — home`}
        >
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1">
          <nav className="ui hidden items-center gap-1 md:flex" aria-label="Navigazione principale">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[3px] px-2.5 py-1.5 text-[0.875rem] text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/area-riservata"
              className="rounded-[3px] px-2.5 py-1.5 text-[0.875rem] text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
            >
              Area riservata
            </Link>
          </nav>

          <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-rule md:block" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
