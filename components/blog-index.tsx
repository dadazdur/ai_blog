import Link from "next/link";
import { Container } from "@/components/ui";
import { ArticleRow } from "@/components/post-card";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { JsonLd } from "@/components/json-ld";
import { getCategories, getCategoryCounts, getPosts } from "@/lib/data";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const pageHref = (page: number) => (page <= 1 ? "/blog" : `/blog/pagina/${page}`);

/** Indice del blog, condiviso da /blog e dalle pagine successive dell'archivio. */
export async function BlogIndex({ page }: { page: number }) {
  const [{ posts, total }, categories, counts] = await Promise.all([
    getPosts({ page, perPage: siteConfig.postsPerPage }),
    getCategories(),
    getCategoryCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / siteConfig.postsPerPage));
  const activeCategories = categories.filter((category) => (counts[category.slug] ?? 0) > 0);

  return (
    <>
      <Container className="border-b border-rule py-10 sm:py-12">
        <nav aria-label="Percorso" className="meta-sm">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Blog{page > 1 ? ` — pagina ${page}` : ""}</span>
        </nav>

        <h1 className="t-h1 mt-4 max-w-[20ch]">Come si usa l&apos;AI in uno studio</h1>
        <p className="t-deck mt-4 max-w-[58ch]">
          Ogni articolo parte da un&apos;attività reale: cosa ho provato, cosa ha funzionato, dove il modello
          sbaglia e come me ne accorgo prima che lo faccia il cliente.
        </p>
      </Container>

      <Container className="grid gap-x-14 gap-y-12 py-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          {posts.length ? (
            <div className="[&>article:first-child]:border-t-0 [&>article:first-child]:pt-0">
              {posts.map((post) => (
                <ArticleRow key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-[1rem] leading-relaxed text-ink-2">
              Non ci sono ancora articoli pubblicati. Lascia la tua email qui accanto: il primo arriva lì.
            </p>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Paginazione" className="ui mt-12 flex items-center justify-between gap-4 border-t border-rule pt-6">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="link text-[0.9rem]">
                  ← Più recenti
                </Link>
              ) : (
                <span />
              )}
              <span className="meta-sm">
                Pagina {page} di {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="link text-[0.9rem]">
                  Più vecchi →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </div>

        <aside className="flex flex-col gap-8">
          <NewsletterPanel source="blog">
            <p>Una email quando ne esce una nuova. Mai più di una a settimana.</p>
          </NewsletterPanel>

          {activeCategories.length ? (
            <nav aria-label="Categorie">
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

          <a href="/feed.xml" className="ui text-[0.88rem] text-ink-2 transition-colors hover:text-accent">
            Feed RSS
          </a>
        </aside>
      </Container>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          collectionSchema({
            name: "Blog — intelligenza artificiale per commercialisti",
            description: siteConfig.description,
            path: pageHref(page),
            posts,
          }),
        ]}
      />
    </>
  );
}

export async function blogTotalPages() {
  const { total } = await getPosts({ perPage: siteConfig.postsPerPage });
  return Math.max(1, Math.ceil(total / siteConfig.postsPerPage));
}
