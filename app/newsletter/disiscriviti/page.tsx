import type { Metadata } from "next";
import { ButtonLink, Column } from "@/components/ui";
import { unsubscribe } from "@/app/actions/newsletter";

export const metadata: Metadata = {
  title: "Disiscrizione",
  robots: { index: false, follow: false },
};

export default async function DisiscrivitiPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await unsubscribe(token) : { ok: false as const, email: null };

  return (
    <Column className="flex min-h-[58vh] flex-col justify-center py-16">
      <h1 className="t-h1">{result.ok ? "Disiscrizione completata" : "Link non valido"}</h1>
      <p className="t-deck mt-4 max-w-[48ch]">
        {result.ok
          ? `Non riceverai più email a ${result.email}. Gli articoli restano aperti e gratuiti, senza bisogno di iscrizione.`
          : "Questo link non è più valido. Se continui a ricevere email, scrivici e sistemiamo a mano."}
      </p>
      <ButtonLink href="/blog" variant="outline" className="mt-8 self-start">
        Vai agli articoli
      </ButtonLink>
    </Column>
  );
}
