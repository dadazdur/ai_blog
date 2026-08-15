import Link from "next/link";
import type { Metadata } from "next";
import { Container, Eyebrow, ButtonLink, Card } from "@/components/ui";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { JsonLd } from "@/components/json-ld";
import { getCategories, getPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const HERO_PROMPT = `RUOLO: sei il commercialista di un cliente artigiano
senza formazione contabile.

COMPITO: riscrivi la comunicazione qui sotto in un'email
di massimo 150 parole.

FORMATO: cosa è arrivato → cosa significa → cosa deve fare
il cliente ed entro quando → cosa faccio io.

VINCOLI: niente sigle non spiegate. Se non c'è una scadenza
certa, scrivi [DA VERIFICARE] invece di ipotizzarla.`;

const percorso = [
  {
    titolo: "Scegli una sola attività",
    testo:
      "Quella che si ripete ogni settimana, produce un testo o una tabella e che tu sai giudicare in dieci secondi. Non serve altro per iniziare.",
  },
  {
    titolo: "Costruisci lo schema",
    testo:
      "Ruolo, materiale, formato, vincoli. Quando l'output è quello giusto hai in mano una procedura, non una conversazione fortunata.",
  },
  {
    titolo: "Mettilo in libreria",
    testo:
      "Lo schema salvato diventa metodo di studio: chiunque entri produce risultati coerenti con quelli di tutti gli altri.",
  },
];

export default async function HomePage() {
  const [{ posts }, categories] = await Promise.all([getPosts({ perPage: 4 }), getCategories()]);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="border-b border-rule">
        <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Per commercialisti, revisori e consulenti del lavoro</Eyebrow>

            <h1 className="t-display mt-5">
              L&apos;intelligenza artificiale in studio,{" "}
              <em className="text-accent">spiegata da chi ci lavora dentro</em>.
            </h1>

            <p className="t-lead mt-6 max-w-xl">
              Niente convegni, niente promesse. Guide operative, prompt già testati e regole chiare sui dati dei
              clienti: quello che serve per far entrare l&apos;AI nel lavoro di ogni giorno senza perdere il
              controllo di quello che esce dallo studio.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/blog">Leggi le guide</ButtonLink>
              <ButtonLink href="/risorse" variant="outline">
                Risorse scaricabili
              </ButtonLink>
            </div>

            <p className="t-meta mt-6">
              Aggiornato di continuo · Contenuti firmati da professionisti iscritti all&apos;Ordine
            </p>
          </div>

          {/* La tesi della pagina: il materiale vero con cui si lavora. */}
          <Card className="overflow-hidden shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-rule bg-surface-sunken px-4 py-2.5">
              <p className="t-label">Prompt · comunicazione al cliente</p>
              <span className="t-meta">01</span>
            </div>
            <pre className="overflow-x-auto px-4 py-5 font-mono text-[0.78rem] leading-[1.75] text-ink-soft">
              {HERO_PROMPT}
            </pre>
            <div className="border-t border-rule px-4 py-3">
              <p className="text-[0.85rem] text-ink-soft">
                Uno dei trenta schemi della libreria.{" "}
                <Link href="/risorse" className="link-underline text-accent">
                  Scaricali tutti
                </Link>
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Percorso */}
      <section className="border-b border-rule bg-surface">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Il metodo</Eyebrow>
            <h2 className="t-h2 mt-4">Tre passaggi, in quest&apos;ordine</h2>
            <p className="t-lead mt-4">
              Gli studi che si bloccano hanno quasi sempre saltato il primo. Quelli che smettono dopo un mese
              hanno saltato il terzo.
            </p>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
            {percorso.map((passo, index) => (
              <li key={passo.titolo} className="bg-surface p-6 sm:p-7">
                <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">
                  0{index + 1}
                </span>
                <h3 className="t-h3 mt-3">{passo.titolo}</h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">{passo.testo}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Articoli */}
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Dal blog</Eyebrow>
              <h2 className="t-h2 mt-4">Le guide più recenti</h2>
            </div>
            <Link href="/blog" className="link-underline text-[0.92rem] text-accent">
              Tutti gli articoli →
            </Link>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index === 0} />
            ))}
          </div>

          {categories.length ? (
            <nav aria-label="Categorie" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/categoria/${category.slug}`}
                  className="text-[0.9rem] text-ink-soft transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          ) : null}
        </Container>
      </section>

      {/* ------------------------------------------------------- Area riservata */}
      <section className="border-b border-rule bg-surface">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Area riservata</Eyebrow>
            <h2 className="t-h2 mt-4">Gli strumenti, non solo le spiegazioni</h2>
            <p className="t-lead mt-4">
              Con un account gratuito scarichi il materiale che uso davvero in studio. Nessun costo, nessuna
              versione ridotta: serve solo un indirizzo email per tenere traccia degli aggiornamenti.
            </p>
            <ButtonLink href="/registrati" className="mt-7">
              Crea un account gratuito
            </ButtonLink>
          </div>

          <ul className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
            {[
              { titolo: "Libreria prompt", nota: "30 schemi divisi per attività di studio" },
              { titolo: "Policy interna", nota: "Modello da adattare e far firmare" },
              { titolo: "Checklist conformità", nota: "Le verifiche prima di autorizzare uno strumento" },
              { titolo: "Fogli di lavoro", nota: "Estrazione dati con controlli già impostati" },
            ].map((item) => (
              <li key={item.titolo} className="bg-surface p-5">
                <p className="font-display text-[1.1rem] text-ink">{item.titolo}</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-soft">{item.nota}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ----------------------------------------------------------- Newsletter */}
      <section id="newsletter">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>Newsletter</Eyebrow>
            <h2 className="t-h2 mt-4">Una email quando c&apos;è qualcosa che vale il tuo tempo</h2>
            <p className="t-lead mt-4">
              Le guide nuove, gli strumenti che hanno superato la prova dello studio e quelli che non l&apos;hanno
              superata. Mai più di una volta a settimana.
            </p>
          </div>
          <div className="lg:pt-2">
            <NewsletterForm source="home" />
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${siteConfig.name} — ${siteConfig.tagline}`,
          description: siteConfig.description,
          url: siteConfig.url,
          inLanguage: "it-IT",
        }}
      />
    </>
  );
}
