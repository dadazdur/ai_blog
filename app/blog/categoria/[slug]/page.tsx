import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ArticleRow } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, categoryMetadataDefaults, collectionSchema } from "@/lib/seo";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoria non trovata" };

  return buildMetadata({ ...categoryMetadataDefaults(category), path: `/blog/categoria/${category.slug}` });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ posts }, categories] = await Promise.all([
    getPosts({ categorySlug: slug, perPage: 50 }),
    getCategories(),
  ]);

  return (
    <>
      <Container className="border-b border-rule py-10 sm:py-12">
        <nav aria-label="Percorso" className="meta-sm">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/blog" className="transition-colors hover:text-ink">
            Articoli
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{category.name}</span>
        </nav>

        <h1 className="t-h1 mt-4">{category.name}</h1>
        {category.description ? <p className="t-deck mt-4 max-w-[58ch]">{category.description}</p> : null}
        <p className="meta-sm mt-5">
          {posts.length} {posts.length === 1 ? "articolo" : "articoli"}
        </p>
      </Container>

      <Container className="py-12">
        <div className="max-w-[52rem] [&>article:first-child]:border-t-0 [&>article:first-child]:pt-0">
          {posts.map((post) => (
            <ArticleRow key={post.id} post={post} />
          ))}
          {!posts.length ? (
            <p className="text-[1rem] leading-relaxed text-ink-2">
              Non ci sono ancora articoli in questa sezione.
            </p>
          ) : null}
        </div>

        <nav aria-label="Altre categorie" className="ui mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-6">
          <span className="text-[0.82rem] font-semibold text-ink">Altri argomenti</span>
          {categories
            .filter((item) => item.slug !== category.slug)
            .map((item) => (
              <Link
                key={item.id}
                href={`/blog/categoria/${item.slug}`}
                className="text-[0.9rem] text-ink-2 transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </Container>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articoli", path: "/blog" },
            { name: category.name, path: `/blog/categoria/${category.slug}` },
          ]),
          collectionSchema({
            name: category.name,
            description: category.description ?? "",
            path: `/blog/categoria/${category.slug}`,
            posts,
          }),
        ]}
      />
    </>
  );
}
