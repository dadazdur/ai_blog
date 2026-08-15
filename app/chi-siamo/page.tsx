import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { getAuthors } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, personSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Chi siamo",
  description:
    "Studio Aumentato è un progetto di formazione pratica sull'intelligenza artificiale per commercialisti, curato da professionisti che la usano nel lavoro quotidiano.",
  path: "/chi-siamo",
});

const principi = [
  {
    titolo: "Solo quello che abbiamo provato",
    testo:
      "Ogni tecnica pubblicata è passata da un lavoro reale di studio. Se una cosa non ha funzionato, lo scriviamo: gli errori sono la parte più utile.",
  },
  {
    titolo: "Niente vendita mascherata",
    testo:
      "Quando citiamo uno strumento diciamo quanto costa e cosa non fa. Nessun contenuto è pagato da un fornitore.",
  },
  {
    titolo: "I dati dei clienti prima di tutto",
    testo:
      "Ogni guida operativa dice esplicitamente quali informazioni si possono usare e quali no. Il segreto professionale non è un dettaglio tecnico.",
  },
];

export default async function ChiSiamoPage() {
  const authors = await getAuthors();

  return (
    <>
      <section className="border-b border-rule">
        <Container className="max-w-3xl py-14 sm:py-16">
          <Eyebrow>Il progetto</Eyebrow>
          <h1 className="t-h1 mt-5">Scritto da chi il bilancio lo deposita davvero</h1>
          <p className="t-lead mt-5">
            {siteConfig.name} nasce da una constatazione: quasi tutto quello che si legge sull&apos;AI per i
            professionisti è scritto da chi non ha mai chiuso un bilancio, o è così generico da non servire a
            nessuno. Qui si parte dall&apos;attività di studio e si arriva allo strumento, mai il contrario.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
          {principi.map((principio) => (
            <div key={principio.titolo} className="bg-surface p-6">
              <h2 className="t-h3">{principio.titolo}</h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">{principio.testo}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <Eyebrow>Chi scrive</Eyebrow>
          <h2 className="t-h2 mt-3">Le firme</h2>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
            Ogni articolo è firmato con nome, qualifica e biografia verificabile. Su temi fiscali non esistono
            contenuti anonimi che valga la pena leggere.
          </p>

          <ul className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
            {authors.map((author) => (
              <li key={author.id} className="bg-surface p-6">
                <h3 className="font-display text-[1.25rem] text-ink">
                  <Link href={`/autori/${author.slug}`} className="link-underline">
                    {author.name}
                  </Link>
                </h3>
                {author.role_title ? <p className="t-meta mt-1">{author.role_title}</p> : null}
                {author.bio ? (
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">{author.bio}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-2xl border-t border-rule pt-8">
          <h2 className="t-h3">Scrivici</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            Hai un&apos;attività di studio che vorresti vedere trattata, o un caso in cui l&apos;AI ti ha fatto
            perdere tempo invece di farne guadagnare? Scrivi a{" "}
            <a href={`mailto:${siteConfig.email}`} className="link-underline text-accent">
              {siteConfig.email}
            </a>
            : i casi reali diventano articoli.
          </p>
          <ButtonLink href="/registrati" className="mt-7">
            Crea un account gratuito
          </ButtonLink>
        </section>
      </Container>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Chi siamo", path: "/chi-siamo" },
          ]),
          ...authors.map((author) => personSchema(author)),
        ]}
      />
    </>
  );
}
