import Link from "next/link";
import { Container, Eyebrow, Notice } from "@/components/ui";
import { ProfileForm } from "@/components/auth-forms";
import { getProfile } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfiloPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <Container className="max-w-xl py-16">
        <Notice tone="warning">Sessione non disponibile. Rifai l&apos;accesso.</Notice>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <Eyebrow>Profilo</Eyebrow>
      <h1 className="t-h1 mt-4">I tuoi dati</h1>

      <dl className="mt-8 grid gap-x-10 gap-y-5 border-y border-rule py-6 sm:grid-cols-2">
        <div>
          <dt className="t-label">Email</dt>
          <dd className="mt-1 text-[0.95rem] text-ink">{profile.email}</dd>
        </div>
        <div>
          <dt className="t-label">Iscritto dal</dt>
          <dd className="mt-1 text-[0.95rem] text-ink num">{formatDate(profile.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <h2 className="t-h3">Aggiorna i dati</h2>
        <div className="mt-5">
          <ProfileForm fullName={profile.full_name ?? ""} studio={profile.studio ?? ""} />
        </div>
      </div>

      <div className="mt-12 border-t border-rule pt-8">
        <h2 className="t-h3">Password</h2>
        <p className="mt-2 text-[0.92rem] text-ink-soft">
          Puoi cambiarla quando vuoi dalla{" "}
          <Link href="/area-riservata/password" className="link-underline text-accent">
            pagina dedicata
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
