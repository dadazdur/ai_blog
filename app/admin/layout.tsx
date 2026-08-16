import Link from "next/link";
import { redirect } from "next/navigation";
import { Column, Container } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [
  { label: "Riepilogo", href: "/admin" as const },
  { label: "Articoli", href: "/admin/articoli" as const },
  { label: "Risorse", href: "/admin/risorse" as const },
  { label: "Iscritti", href: "/admin/iscritti" as const },
  { label: "Autori e categorie", href: "/admin/autori" as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <Column className="py-20">
        <h1 className="t-h2">Pannello non disponibile</h1>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
          Configura le variabili Supabase nel file <code className="font-mono text-[0.85em]">.env.local</code> e
          riavvia il server per usare l&apos;amministrazione.
        </p>
      </Column>
    );
  }

  const profile = await requireAdmin();
  if (!profile) redirect("/area-riservata");

  return (
    <div>
      <div className="border-b border-rule bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
          <nav aria-label="Amministrazione" className="ui flex flex-wrap items-center gap-x-1 gap-y-1">
            <span className="mr-2 text-[0.8rem] font-semibold text-accent">Admin</span>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[3px] px-2 py-1 text-[0.85rem] text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ui flex items-center gap-4 text-[0.82rem]">
            <Link href="/" className="text-ink-2 transition-colors hover:text-ink">
              Vedi il sito
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-ink-2 transition-colors hover:text-ink">
                Esci
              </button>
            </form>
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
