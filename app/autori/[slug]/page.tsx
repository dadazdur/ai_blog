import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ArticleRow } from "@/components/post-card";
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
    title: author.name,
    description:
      author.bio?.slice(0, 155) ??
      `Articoli sull'intelligenza artificiale per commercialisti firmati da ${author.name}.`,
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
      <Container className="border-b border-rule py-10 sm:py-12">
        <nav aria-label="Percorso" className="meta-sm">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{author.name}</span>
        </nav>

        <h1 className="t-h1 mt-4">{author.name}</h1>
        {author.role_title ? <p className="t-deck mt-3">{author.role_title}</p> : null}

        {author.bio ? (
          <p className="mt-6 max-w-[62ch] text-[1.05rem] leading-relaxed text-ink-2">{author.bio}</p>
        ) : null}

        <div className="ui mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.875rem] text-ink-2">
          <span className="num">
            {posts.length} {posts.length === 1 ? "articolo" : "articoli"}
          </span>
          {author.credentials ? <span>{author.credentials}</span> : null}
          {author.linkedin_url ? (
            <a href={author.linkedin_url} target="_blank" rel="noopener" className="link">
              LinkedIn
            </a>
          ) : null}
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="t-h2">Articoli firmati</h2>
        <div className="mt-7 max-w-[52rem] [&>article:first-child]:border-t-0 [&>article:first-child]:pt-0">
          {posts.map((post) => (
            <ArticleRow key={post.id} post={post} />
          ))}
          {!posts.length ? <p className="text-[1rem] text-ink-2">Nessun articolo pubblicato per ora.</p> : null}
        </div>
        <Link href="/blog" className="ui link mt-10 inline-block text-[0.9rem]">
          ← Tutti gli articoli
        </Link>
      </Container>

      <JsonLd
        data={[
          personSchema(author),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: author.name, path: `/autori/${author.slug}` },
          ]),
        ]}
      />
    </>
  );
}
