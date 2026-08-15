import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { PostRow } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";
import { getAuthorBySlug, getAuthors, getPosts } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, personSchema } from "@/lib/seo";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Autore non trovato" };

  return buildMetadata({
    title: `${author.name}${author.role_title ? ` — ${author.role_title}` : ""}`,
    description:
      author.bio?.slice(0, 155) ??
      `Articoli e guide sull'intelligenza artificiale per commercialisti firmati da ${author.name}.`,
    path: `/autori/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const { posts } = await getPosts({ authorSlug: slug, perPage: 50 });

  return (
    <>
      <section className="border-b border-rule">
        <Container className="max-w-3xl py-14 sm:py-16">
          <Eyebrow>Autore</Eyebrow>
          <h1 className="t-h1 mt-4">{author.name}</h1>
          {author.role_title ? <p className="t-lead mt-3">{author.role_title}</p> : null}

          {author.bio ? (
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-ink-soft text-pretty">{author.bio}</p>
          ) : null}

          <dl className="mt-8 grid gap-x-10 gap-y-4 border-t border-rule pt-6 sm:grid-cols-2">
            {author.credentials ? (
              <div>
                <dt className="t-label">Qualifica</dt>
                <dd className="mt-1 text-[0.92rem] leading-relaxed text-ink-soft">{author.credentials}</dd>
              </div>
            ) : null}
            <div>
              <dt className="t-label">Articoli pubblicati</dt>
              <dd className="mt-1 text-[0.92rem] text-ink-soft num">{posts.length}</dd>
            </div>
            {author.linkedin_url ? (
              <div>
                <dt className="t-label">Altrove</dt>
                <dd className="mt-1">
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener"
                    className="text-[0.92rem] text-accent link-underline"
                  >
                    LinkedIn
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </Container>
      </section>

      <Container className="py-12">
        <h2 className="t-h2">Articoli firmati</h2>
        <div className="mt-6 border-t border-rule">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
          {!posts.length ? <p className="py-10 text-ink-soft">Nessun articolo pubblicato per ora.</p> : null}
        </div>
        <Link href="/blog" className="link-underline mt-8 inline-block text-[0.92rem] text-accent">
          ← Tutti gli articoli del blog
        </Link>
      </Container>

      <JsonLd
        data={[
          personSchema(author),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Autori", path: "/blog" },
            { name: author.name, path: `/autori/${author.slug}` },
          ]),
        ]}
      />
    </>
  );
}
