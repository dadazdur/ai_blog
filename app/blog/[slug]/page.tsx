import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow, ButtonLink } from "@/components/ui";
import { PostCard } from "@/components/post-card";
import { AuthorBox } from "@/components/author-box";
import { Toc } from "@/components/toc";
import { Share } from "@/components/share";
import { NewsletterForm } from "@/components/newsletter-form";
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

  return (
    <>
      <article>
        {/* --------------------------------------------------------- Intestazione */}
        <header className="border-b border-rule">
          <Container className="max-w-4xl py-12 sm:py-16">
            <nav aria-label="Percorso" className="t-meta flex flex-wrap items-center gap-1.5">
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="hover:text-ink">
                Blog
              </Link>
              {post.category ? (
                <>
                  <span aria-hidden="true">/</span>
                  <Link href={`/blog/categoria/${post.category.slug}`} className="hover:text-ink">
                    {post.category.name}
                  </Link>
                </>
              ) : null}
            </nav>

            <h1 className="t-h1 mt-6">{post.title}</h1>

            {post.excerpt ? <p className="t-lead mt-5 max-w-2xl">{post.excerpt}</p> : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-5">
              {post.author ? (
                <Link href={`/autori/${post.author.slug}`} className="text-[0.9rem] text-ink link-underline">
                  {post.author.name}
                </Link>
              ) : null}
              <time className="t-meta" dateTime={post.published_at ?? post.created_at}>
                {formatDate(post.published_at ?? post.created_at)}
              </time>
              <span className="t-meta">{post.reading_minutes} minuti di lettura</span>
              {post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10) ? (
                <span className="t-meta">· aggiornato il {formatDate(post.updated_at)}</span>
              ) : null}
            </div>
          </Container>
        </header>

        {/* -------------------------------------------------------------- Corpo */}
        <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_14rem] lg:gap-14">
          <div className="min-w-0">
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faq?.length ? (
              <section className="mt-16 border-t border-rule pt-8" aria-labelledby="domande-frequenti">
                <Eyebrow>Domande frequenti</Eyebrow>
                <h2 id="domande-frequenti" className="t-h2 mt-3">
                  Le domande che ricevo più spesso
                </h2>
                <div className="mt-6 border-t border-rule">
                  {post.faq.map((item) => (
                    <details key={item.question} className="group border-b border-rule py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-[1.08rem] leading-snug text-ink marker:content-none">
                        {item.question}
                        <span
                          aria-hidden="true"
                          className="mt-1 shrink-0 font-mono text-sm text-accent transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-12 border-t border-rule pt-6">
              <Share url={url} title={post.title} />
            </div>

            {post.author ? (
              <div className="mt-10">
                <AuthorBox author={post.author} />
              </div>
            ) : null}

            <section className="mt-10 rounded-lg border border-rule bg-surface p-6 sm:p-8">
              <Eyebrow>Newsletter</Eyebrow>
              <h2 className="t-h3 mt-3">Ti mando la prossima guida appena esce</h2>
              <p className="mt-2 max-w-lg text-[0.92rem] leading-relaxed text-ink-soft">
                Una email a settimana al massimo, con quello che ha superato la prova dello studio.
              </p>
              <div className="mt-5 max-w-md">
                <NewsletterForm source={`articolo:${post.slug}`} />
              </div>
            </section>
          </div>

          <Toc items={toc} />
        </Container>
      </article>

      {/* ---------------------------------------------------------- Correlati */}
      {related.length ? (
        <section className="border-t border-rule bg-surface">
          <Container className="py-14">
            <Eyebrow>Continua</Eyebrow>
            <h2 className="t-h2 mt-3">Altri articoli su questo tema</h2>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
            <ButtonLink href="/blog" variant="outline" className="mt-10">
              Tutti gli articoli
            </ButtonLink>
          </Container>
        </section>
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
