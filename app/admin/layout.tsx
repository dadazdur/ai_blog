import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
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
      <Container className="max-w-xl py-20">
        <h1 className="t-h2">Pannello non disponibile</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          Configura le variabili Supabase nel file <code className="font-mono text-[0.85em]">.env.local</code> e
          riavvia il server per usare l&apos;amministrazione.
        </p>
      </Container>
    );
  }

  const profile = await requireAdmin();
  if (!profile) redirect("/area-riservata");

  return (
    <div>
      <div className="border-b border-rule bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-3">
          <nav aria-label="Amministrazione" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="t-label text-accent">Admin</span>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="t-label hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/" className="t-label hover:text-ink">
              Vedi il sito
            </Link>
            <form action={signOut}>
              <button type="submit" className="t-label hover:text-ink">
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
