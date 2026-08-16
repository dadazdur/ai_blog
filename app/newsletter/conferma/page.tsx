import type { Metadata } from "next";
import { ButtonLink, Column } from "@/components/ui";
import { confirmSubscription } from "@/app/actions/newsletter";

export const metadata: Metadata = {
  title: "Conferma iscrizione",
  robots: { index: false, follow: false },
};

export default async function ConfermaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await confirmSubscription(token) : { ok: false as const, email: null };

  return (
    <Column className="flex min-h-[58vh] flex-col justify-center py-16">
      {result.ok ? (
        <>
          <h1 className="t-h1">Iscrizione confermata</h1>
          <p className="t-deck mt-4 max-w-[48ch]">
            Da ora ricevi le guide appena escono su <strong className="font-semibold text-ink">{result.email}</strong>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/blog">Leggi le guide</ButtonLink>
            <ButtonLink href="/risorse" variant="outline">
              Vai alle risorse
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h1 className="t-h1">Link non valido</h1>
          <p className="t-deck mt-4 max-w-[48ch]">
            Questo link di conferma è scaduto o è già stato usato. Riprova l&apos;iscrizione dalla home: se il tuo
            indirizzo era già confermato, te lo diciamo subito.
          </p>
          <ButtonLink href="/" className="mt-8 self-start">
            Torna alla home
          </ButtonLink>
        </>
      )}
    </Column>
  );
}
