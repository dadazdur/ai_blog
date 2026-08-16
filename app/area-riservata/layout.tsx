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
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
          <nav aria-label="Area riservata" className="ui flex items-center gap-x-1">
            <Link
              href="/area-riservata"
              className="rounded-[3px] px-2 py-1 text-[0.85rem] text-ink transition-colors hover:bg-sunken"
            >
              Risorse
            </Link>
            <Link
              href="/area-riservata/profilo"
              className="rounded-[3px] px-2 py-1 text-[0.85rem] text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
            >
              Profilo
            </Link>
            {profile?.role === "admin" ? (
              <Link
                href="/admin"
                className="rounded-[3px] px-2 py-1 text-[0.85rem] text-accent transition-colors hover:bg-sunken"
              >
                Amministrazione
              </Link>
            ) : null}
          </nav>

          <div className="ui flex items-center gap-4 text-[0.82rem]">
            {profile ? <span className="text-ink-3">{profile.email}</span> : null}
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
