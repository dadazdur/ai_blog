import Link from "next/link";
import { Container } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { getProfile } from "@/lib/supabase/server";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AreaRiservataLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <div>
      <div className="border-b border-rule bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-3">
          <nav aria-label="Area riservata" className="flex items-center gap-6">
            <Link href="/area-riservata" className="t-label text-ink">
              Risorse
            </Link>
            <Link href="/area-riservata/profilo" className="t-label hover:text-ink">
              Profilo
            </Link>
            {profile?.role === "admin" ? (
              <Link href="/admin" className="t-label text-accent">
                Amministrazione
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-4">
            {profile ? <span className="t-meta">{profile.email}</span> : null}
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
