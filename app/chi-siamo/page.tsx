import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { getAuthors } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, personSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Chi siamo",
  description:
    "Le Scritture è un progetto editoriale sull'intelligenza artificiale per consulenti fiscali e d'impresa, scritto da chi lavora in studio.",
  path: "/chi-siamo",
});

const principi = [
  {
    titolo: "Solo quello che abbiamo provato",
    testo:
      "Ogni tecnica pubblicata è passata da un lavoro reale. Se una cosa non ha funzionato lo scriviamo: gli errori sono la parte più utile di un articolo.",
  },
  {
    titolo: "Niente vendita mascherata",
    testo:
      "Quando citiamo uno strumento diciamo quanto costa e cosa non fa. Nessun contenuto è pagato da un fornitore, e non c'è niente in vendita su questo sito.",
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
      <Container className="border-b border-rule py-10 sm:py-14">
        <h1 className="t-h1 max-w-[22ch]">Scritto da chi il bilancio lo deposita</h1>
        <p className="t-deck mt-5 max-w-[60ch]">
          Quasi tutto quello che si legge sull&apos;AI per i professionisti è scritto da chi non ha mai chiuso un
          bilancio, oppure è così generico da non servire a nessuno. Qui si parte dall&apos;attività di studio e
          si arriva allo strumento, mai il contrario.
        </p>
      </Container>

      <Container className="py-12">
        <div className="grid gap-x-14 gap-y-8 sm:grid-cols-3">
          {principi.map((principio) => (
            <section key={principio.titolo} className="border-t border-rule pt-4">
              <h2 className="text-[1.08rem] font-semibold leading-snug tracking-[-0.015em]">{principio.titolo}</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-2">{principio.testo}</p>
            </section>
          ))}
        </div>

        {authors.length ? (
          <section className="mt-16">
            <h2 className="t-h2">Chi scrive</h2>
            <p className="mt-3 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
              Ogni articolo è firmato. Su temi fiscali non esistono contenuti anonimi che valga la pena leggere.
            </p>
            <ul className="mt-8 grid gap-x-14 gap-y-8 sm:grid-cols-2">
              {authors.map((author) => (
                <li key={author.id} className="border-t border-rule pt-4">
                  <h3 className="text-[1.1rem] font-semibold tracking-[-0.015em]">
                    <Link href={`/autori/${author.slug}`} className="link">
                      {author.name}
                    </Link>
                  </h3>
                  {author.role_title ? <p className="meta mt-1">{author.role_title}</p> : null}
                  {author.bio ? (
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-2">{author.bio}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-16 max-w-[58ch] border-t border-rule pt-8">
          <h2 className="t-h3">Scrivici</h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
            Hai un&apos;attività di studio che vorresti vedere trattata, o un caso in cui l&apos;AI ti ha fatto
            perdere tempo invece di farne guadagnare? Scrivi a{" "}
            <a href={`mailto:${siteConfig.email}`} className="link">
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
