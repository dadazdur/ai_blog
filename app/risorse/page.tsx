import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { getResourceTeasers } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { resourceTypeLabels } from "@/lib/types";
import { SoloAnonimi, SoloAutenticati } from "@/components/auth-aware";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Risorse per lo studio: prompt, modelli e checklist",
  description:
    "Prompt testati, modelli di documento e checklist operative per consulenti fiscali e d'impresa. Accesso gratuito con registrazione.",
  path: "/risorse",
});

export default async function RisorsePage() {
  const resources = await getResourceTeasers();

  return (
    <>
      <Container className="border-b border-rule py-10 sm:py-14">
        <h1 className="t-h1 max-w-[20ch]">Il materiale operativo</h1>
        <p className="t-deck mt-5 max-w-[58ch]">
          Gli articoli spiegano il metodo. Qui c&apos;è quello che si apre, si compila e si porta in riunione.
          Serve un account gratuito, e nient&apos;altro: nessun costo, nessuna versione ridotta.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SoloAnonimi>
            <ButtonLink href="/registrati">Crea un account gratuito</ButtonLink>
            <ButtonLink href="/accedi" variant="outline">
              Ho già un account
            </ButtonLink>
          </SoloAnonimi>
          <SoloAutenticati>
            <ButtonLink href="/area-riservata">Vai all&apos;area riservata</ButtonLink>
          </SoloAutenticati>
        </div>
      </Container>

      <Container className="py-12">
        {resources.length ? (
          <>
            <h2 className="t-h2">Cosa trovi dentro</h2>
            <ul className="mt-8 grid gap-x-14 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <li key={resource.id} className="border-t border-rule pt-4">
                  <h3 className="text-[1.08rem] font-semibold leading-snug tracking-[-0.015em]">{resource.title}</h3>
                  {resource.description ? (
                    <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{resource.description}</p>
                  ) : null}
                  <p className="meta-sm mt-2.5 text-accent">{resourceTypeLabels[resource.type]}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="max-w-[58ch]">
            <h2 className="t-h2">Il primo materiale sta arrivando</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-2">
              L&apos;area riservata ospiterà gli schemi di prompt divisi per attività di studio, i modelli di
              documento da adattare e le checklist di conformità. Non pubblichiamo materiale che non abbiamo
              usato davvero, quindi arriva un pezzo alla volta.
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-2">
              Registrandoti ora vieni avvisato quando esce il primo, senza doverci ripassare.
            </p>
          </div>
        )}

        <div className="mt-16 max-w-[58ch] border-t border-rule pt-8">
          <h2 className="t-h3">Perché serve la registrazione</h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
            Perché questi file cambiano: quando esce una versione aggiornata di un modello, o un prompt smette di
            funzionare su un modello nuovo, chi è registrato lo viene a sapere. Nessun contatto commerciale,
            disiscrizione con un clic.
          </p>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Risorse", path: "/risorse" },
        ])}
      />
    </>
  );
}
