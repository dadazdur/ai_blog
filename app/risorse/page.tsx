import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow, Pill } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { getResourceTeasers } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { resourceTypeLabels } from "@/lib/types";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Risorse per lo studio: prompt, modelli e checklist",
  description:
    "Prompt testati, modello di policy interna sull'AI, checklist di conformità e fogli di lavoro per commercialisti. Accesso gratuito con registrazione.",
  path: "/risorse",
});

export default async function RisorsePage() {
  const resources = await getResourceTeasers();

  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 sm:py-16">
          <Eyebrow>Area riservata · accesso gratuito</Eyebrow>
          <h1 className="t-h1 mt-5 max-w-3xl">Il materiale operativo, pronto da usare in studio</h1>
          <p className="t-lead mt-5 max-w-2xl">
            Gli articoli spiegano il metodo. Qui c&apos;è quello che si apre, si compila e si porta in riunione:
            schemi di prompt, modelli di documento, checklist. Serve solo un account gratuito.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/registrati">Crea un account gratuito</ButtonLink>
            <ButtonLink href="/accedi" variant="outline">
              Ho già un account
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="t-h2">Cosa trovi dentro</h2>

        <ul className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
          {resources.map((resource) => (
            <li key={resource.id} className="flex flex-col gap-3 bg-surface p-6">
              <Pill>{resourceTypeLabels[resource.type]}</Pill>
              <h3 className="font-display text-[1.2rem] leading-snug text-ink">{resource.title}</h3>
              {resource.description ? (
                <p className="text-[0.9rem] leading-relaxed text-ink-soft">{resource.description}</p>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-14 max-w-2xl border-t border-rule pt-8">
          <h2 className="t-h3">Perché serve la registrazione</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            Perché questi file cambiano: quando esce una versione aggiornata della policy o un prompt smette di
            funzionare su un modello nuovo, chi è registrato lo viene a sapere. Nessun costo, nessun contatto
            commerciale, disiscrizione con un clic.
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
