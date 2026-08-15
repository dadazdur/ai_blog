import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
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
    <Container className="flex min-h-[60vh] max-w-xl flex-col justify-center py-20">
      <Eyebrow>Newsletter</Eyebrow>
      {result.ok ? (
        <>
          <h1 className="t-h1 mt-4">Iscrizione confermata</h1>
          <p className="t-lead mt-4">
            Da ora ricevi le guide appena escono su <strong className="text-ink">{result.email}</strong>. Intanto,
            il materiale scaricabile è già disponibile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/risorse">Vai alle risorse</ButtonLink>
            <ButtonLink href="/blog" variant="outline">
              Leggi le guide
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h1 className="t-h1 mt-4">Link non valido</h1>
          <p className="t-lead mt-4">
            Questo link di conferma è scaduto o è già stato usato. Riprova l&apos;iscrizione dalla home: se il tuo
            indirizzo era già confermato, te lo diciamo subito.
          </p>
          <ButtonLink href="/#newsletter" className="mt-8 self-start">
            Torna al modulo
          </ButtonLink>
        </>
      )}
    </Container>
  );
}
