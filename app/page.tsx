import Link from "next/link";
import type { Metadata } from "next";
import { Container, SectionHead } from "@/components/ui";
import { ArticleRow, LeadArticle } from "@/components/post-card";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { JsonLd } from "@/components/json-ld";
import { getCategories, getCategoryCounts, getPosts, getResourceTeasers } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { resourceTypeLabels } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [{ posts }, categories, counts, resources] = await Promise.all([
    getPosts({ perPage: 7 }),
    getCategories(),
    getCategoryCounts(),
    getResourceTeasers(),
  ]);

  const [lead, ...rest] = posts;
  const activeCategories = categories.filter((category) => (counts[category.slug] ?? 0) > 0);

  return (
    <>
      {/* Riga di testata: dice in una riga cos'è questo posto e per chi. */}
      <div className="border-b border-rule bg-surface">
        <Container className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1.5 py-3">
          <p className="ui text-[0.875rem] leading-snug text-ink-2">
            Intelligenza artificiale per commercialisti: guide operative, prompt testati, regole chiare sui dati
            dei clienti.
          </p>
          <Link href="/chi-siamo" className="ui text-[0.8rem] text-ink-3 transition-colors hover:text-accent">
            Chi siamo
          </Link>
        </Container>
      </div>

      <Container className="grid gap-x-14 gap-y-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          {lead ? (
            <LeadArticle post={lead} />
          ) : (
            <div className="lede">
              <h1 className="t-display max-w-[18ch]">
                L&apos;intelligenza artificiale, spiegata a chi lavora in studio.
              </h1>
              <p className="t-deck mt-5 max-w-[46ch]">
                Il primo articolo esce a breve. Lascia la tua email e lo ricevi il giorno in cui viene pubblicato.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:pt-1">
          <NewsletterPanel source="home" />

          {activeCategories.length ? (
            <nav aria-label="Categorie" className="mt-8">
              <h2 className="ui text-[0.82rem] font-semibold text-ink">Argomenti</h2>
              <ul className="ui mt-3 flex flex-col">
                {activeCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/blog/categoria/${category.slug}`}
                      className="block border-b border-rule py-2.5 text-[0.9rem] text-ink-2 transition-colors hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </Container>

      {rest.length ? (
        <Container className="border-t border-rule pt-12">
          <SectionHead
            title="Gli altri articoli"
            action={
              <Link href="/blog" className="ui link text-[0.9rem]">
                Archivio completo
              </Link>
            }
          />
          <div className="mt-8 max-w-[52rem]">
            {rest.map((post) => (
              <ArticleRow key={post.id} post={post} />
            ))}
          </div>
        </Container>
      ) : null}

      {resources.length ? (
        <Container className="mt-20 border-t border-rule pt-12">
          <SectionHead
            title="Il materiale operativo"
            intro="Prompt, modelli e checklist da usare in studio. Servono un account gratuito, e nient'altro."
            action={
              <Link href="/risorse" className="ui link text-[0.9rem]">
                Vedi le risorse
              </Link>
            }
          />
          <ul className="mt-8 grid gap-x-14 gap-y-7 sm:grid-cols-2">
            {resources.slice(0, 4).map((resource) => (
              <li key={resource.id} className="border-t border-rule pt-4">
                <p className="text-[1.02rem] font-semibold leading-snug tracking-[-0.015em]">{resource.title}</p>
                {resource.description ? (
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-2">{resource.description}</p>
                ) : null}
                <p className="meta-sm mt-2 text-accent">{resourceTypeLabels[resource.type]}</p>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

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
