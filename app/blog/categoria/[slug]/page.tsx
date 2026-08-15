import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PostRow } from "@/components/post-card";
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

  const defaults = categoryMetadataDefaults(category);
  return buildMetadata({ ...defaults, path: `/blog/categoria/${category.slug}` });
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
      <section className="border-b border-rule">
        <Container className="py-14 sm:py-16">
          <nav aria-label="Percorso" className="t-meta flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </nav>

          <h1 className="t-h1 mt-5 max-w-3xl">{category.name}</h1>
          {category.description ? <p className="t-lead mt-5 max-w-2xl">{category.description}</p> : null}
          <p className="t-meta mt-6">
            {posts.length} {posts.length === 1 ? "articolo" : "articoli"}
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="border-t border-rule">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
          {!posts.length ? (
            <p className="py-10 text-ink-soft">Non ci sono ancora articoli in questa categoria.</p>
          ) : null}
        </div>

        <nav aria-label="Altre categorie" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-6">
          <span className="t-label">Altre categorie</span>
          {categories
            .filter((item) => item.slug !== category.slug)
            .map((item) => (
              <Link
                key={item.id}
                href={`/blog/categoria/${item.slug}`}
                className="text-[0.9rem] text-ink-soft transition-colors hover:text-accent"
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
            { name: "Blog", path: "/blog" },
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
