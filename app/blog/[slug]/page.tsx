import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ArticleRow } from "@/components/post-card";
import { AuthorBox } from "@/components/author-box";
import { Toc } from "@/components/toc";
import { Share } from "@/components/share";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { JsonLd } from "@/components/json-ld";
import { getAllPublishedPosts, getPostBySlug, getRelatedPosts } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { articleSchema, breadcrumbSchema, buildMetadata, faqSchema, ogImageUrl } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Articolo non trovato" };

  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || "",
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.cover_url ?? ogImageUrl({ title: post.title, kicker: post.category?.name, meta: post.author?.name }),
    publishedTime: post.published_at ?? undefined,
    modifiedTime: post.updated_at ?? undefined,
    authors: post.author ? [post.author.name] : undefined,
    noindex: post.noindex,
    canonical: post.canonical_url,
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { html, toc } = renderMarkdown(post.content_md);
  const related = await getRelatedPosts(post, 3);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const wordCount = post.content_md.split(/\s+/).filter(Boolean).length;
  const updated =
    post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10)
      ? post.updated_at
      : null;

  return (
    <>
      <div className="read-progress" aria-hidden="true" />

      <article>
        <Container className="pt-8 sm:pt-10">
          <nav aria-label="Percorso" className="meta-sm">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blog" className="transition-colors hover:text-ink">
              Blog
            </Link>
            {post.category ? (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/blog/categoria/${post.category.slug}`} className="transition-colors hover:text-ink">
                  {post.category.name}
                </Link>
              </>
            ) : null}
          </nav>

          {/* Il limite di misura sta sul titolo: `ch` si risolve sulla sua dimensione, non su quella del corpo. */}
          <header className="lede mt-6">
            <h1 className="t-h1 max-w-[24ch]">{post.title}</h1>
          </header>

          {post.excerpt ? <p className="t-deck mt-5 max-w-[58ch]">{post.excerpt}</p> : null}

          <div className="ui mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-rule py-3 text-[0.875rem]">
            {post.author ? (
              <Link href={`/autori/${post.author.slug}`} className="font-medium text-ink transition-colors hover:text-accent">
                {post.author.name}
              </Link>
            ) : null}
            <time className="text-ink-2 num" dateTime={post.published_at ?? post.created_at}>
              {formatDate(post.published_at ?? post.created_at)}
            </time>
            <span className="text-ink-3">{post.reading_minutes} min di lettura</span>
            {updated ? <span className="text-ink-3">aggiornato il {formatDate(updated)}</span> : null}
          </div>
        </Container>

        <Container className="grid gap-x-16 gap-y-12 pt-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="min-w-0">
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faq?.length ? (
              <section className="mt-16 max-w-[var(--measure)]" aria-labelledby="domande-frequenti">
                <h2 id="domande-frequenti" className="t-h2">
                  Domande frequenti
                </h2>
                <div className="mt-5">
                  {post.faq.map((item) => (
                    <details key={item.question} className="group border-t border-rule py-4 last:border-b">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.02rem] font-semibold leading-snug tracking-[-0.015em] text-ink marker:content-none">
                        {item.question}
                        <span
                          aria-hidden="true"
                          className="ui mt-0.5 shrink-0 text-lg leading-none text-accent transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-12 max-w-[var(--measure)] border-t border-rule pt-5">
              <Share url={url} title={post.title} />
            </div>

            {post.author ? (
              <div className="mt-10 max-w-[var(--measure)]">
                <AuthorBox author={post.author} />
              </div>
            ) : null}

            <div className="mt-10 max-w-[var(--measure)]">
              <NewsletterPanel source={`articolo:${post.slug}`} title="La prossima guida arriva nella tua casella">
                <p>Una email a settimana al massimo, con quello che ha superato la prova dello studio.</p>
              </NewsletterPanel>
            </div>
          </div>

          <Toc items={toc} />
        </Container>
      </article>

      {related.length ? (
        <Container className="mt-20 border-t border-rule pt-10">
          <h2 className="t-h2">Continua a leggere</h2>
          <div className="mt-7 grid gap-x-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleRow key={item.id} post={item} compact />
            ))}
          </div>
        </Container>
      ) : null}

      <JsonLd
        data={[
          articleSchema(post, wordCount),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            ...(post.category ? [{ name: post.category.name, path: `/blog/categoria/${post.category.slug}` }] : []),
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(post.faq?.length ? [faqSchema(post.faq)] : []),
        ]}
      />
    </>
  );
}
