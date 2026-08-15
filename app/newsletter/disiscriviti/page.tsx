import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
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
    <Container className="flex min-h-[60vh] max-w-xl flex-col justify-center py-20">
      <Eyebrow>Newsletter</Eyebrow>
      <h1 className="t-h1 mt-4">{result.ok ? "Disiscrizione completata" : "Link non valido"}</h1>
      <p className="t-lead mt-4">
        {result.ok
          ? `Non riceverai più email a ${result.email}. Il blog resta aperto e gratuito, senza bisogno di iscrizione.`
          : "Questo link non è più valido. Se continui a ricevere email, scrivici e sistemiamo a mano."}
      </p>
      <ButtonLink href="/blog" variant="outline" className="mt-8 self-start">
        Vai al blog
      </ButtonLink>
    </Container>
  );
}
