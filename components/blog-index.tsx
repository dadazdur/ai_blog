import Link from "next/link";
import { Container } from "@/components/ui";
import { PostRow } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { JsonLd } from "@/components/json-ld";
import { getCategories, getCategoryCounts, getPosts } from "@/lib/data";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const pageHref = (page: number) => (page <= 1 ? "/blog" : `/blog/pagina/${page}`);

/** Indice del blog, condiviso da /blog e dalle pagine successive. */
export async function BlogIndex({ page }: { page: number }) {
  const [{ posts, total }, categories, counts] = await Promise.all([
    getPosts({ page, perPage: siteConfig.postsPerPage }),
    getCategories(),
    getCategoryCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / siteConfig.postsPerPage));

  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-14 sm:py-16">
          <nav aria-label="Percorso" className="t-meta">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>{" "}
            / Blog{page > 1 ? ` / pagina ${page}` : ""}
          </nav>

          <h1 className="t-h1 mt-5 max-w-3xl">
            Come si usa davvero l&apos;intelligenza artificiale in uno studio
          </h1>
          <p className="t-lead mt-5 max-w-2xl">
            Ogni articolo nasce da un&apos;attività reale di studio: cosa ho provato, cosa ha funzionato, dove il
            modello sbaglia e come me ne accorgo prima che lo faccia il cliente.
          </p>
        </Container>
      </section>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_15rem] lg:gap-16">
        <div>
          {posts.length ? (
            <div className="border-t border-rule">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="border-t border-rule py-10 text-ink-soft">
              Non ci sono ancora articoli pubblicati. Torna tra qualche giorno.
            </p>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Paginazione" className="mt-10 flex items-center justify-between gap-4">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="link-underline text-[0.9rem] text-accent">
                  ← Più recenti
                </Link>
              ) : (
                <span />
              )}
              <span className="t-meta">
                Pagina {page} di {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="link-underline text-[0.9rem] text-accent">
                  Più vecchi →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </div>

        <aside className="flex flex-col gap-10">
          <div>
            <p className="t-label border-b border-rule pb-2">Categorie</p>
            <ul className="mt-3 flex flex-col gap-2">
              {categories.map((category) => (
                <li key={category.id} className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/blog/categoria/${category.slug}`}
                    className="text-[0.9rem] text-ink-soft transition-colors hover:text-accent"
                  >
                    {category.name}
                  </Link>
                  <span className="t-meta">{counts[category.slug] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-rule bg-surface p-5">
            <p className="t-label">Newsletter</p>
            <p className="mt-2 text-[0.87rem] leading-relaxed text-ink-soft">
              Una email quando esce una guida nuova. Mai più di una a settimana.
            </p>
            <div className="mt-4">
              <NewsletterForm source="blog" label="Iscrivimi" compact />
            </div>
          </div>

          <div>
            <p className="t-label border-b border-rule pb-2">Segui</p>
            <a href="/feed.xml" className="mt-3 inline-block text-[0.9rem] text-ink-soft hover:text-accent">
              Feed RSS
            </a>
          </div>
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
