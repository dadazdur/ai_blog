import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { demoAuthors, demoCategories, demoPosts, demoResources } from "@/lib/demo-content";
import type { Author, Category, Post, Resource } from "@/lib/types";
import { readingMinutes } from "@/lib/utils";

const POST_SELECT = `
  id, slug, title, excerpt, content_md, cover_url, cover_alt, status, published_at, updated_at,
  created_at, seo_title, seo_description, focus_keyword, canonical_url, noindex, faq,
  reading_minutes, views, category_id, author_id,
  category:categories (id, slug, name, description, seo_title, seo_description),
  author:authors (id, slug, name, role_title, bio, credentials, avatar_url, linkedin_url, email)
`;

/**
 * Normalizza la riga di Supabase: le relazioni arrivano come array quando la
 * chiave esterna non è dichiarata come singola.
 */
function normalizePost(row: Record<string, unknown>): Post {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const author = Array.isArray(row.author) ? row.author[0] : row.author;
  const post = {
    ...row,
    category: (category as Category) ?? null,
    author: (author as Author) ?? null,
  } as Post;
  if (!post.reading_minutes) post.reading_minutes = readingMinutes(post.content_md ?? "");
  return post;
}

function sortByDateDesc(a: Post, b: Post) {
  return new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime();
}

const publishedDemoPosts = () => demoPosts.filter((post) => post.status === "published").sort(sortByDateDesc);

// ---------------------------------------------------------------------------
// Articoli
// ---------------------------------------------------------------------------

export async function getPosts({
  page = 1,
  perPage = 9,
  categorySlug,
  authorSlug,
  query,
}: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  authorSlug?: string;
  query?: string;
} = {}): Promise<{ posts: Post[]; total: number }> {
  const supabase = createPublicClient();

  if (!supabase) {
    let posts = publishedDemoPosts();
    if (categorySlug) posts = posts.filter((post) => post.category?.slug === categorySlug);
    if (authorSlug) posts = posts.filter((post) => post.author?.slug === authorSlug);
    if (query) {
      const needle = query.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(needle) || (post.excerpt ?? "").toLowerCase().includes(needle),
      );
    }
    const start = (page - 1) * perPage;
    return { posts: posts.slice(start, start + perPage), total: posts.length };
  }

  let builder = supabase
    .from("posts")
    .select(POST_SELECT, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (categorySlug) builder = builder.eq("categories.slug", categorySlug);
  if (query) builder = builder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);

  const { data, count, error } = await builder.range((page - 1) * perPage, page * perPage - 1);
  if (error || !data) return { posts: [], total: 0 };

  let posts = data.map((row) => normalizePost(row as Record<string, unknown>));
  // Il filtro su relazione annidata va riapplicato lato applicazione.
  if (categorySlug) posts = posts.filter((post) => post.category?.slug === categorySlug);
  if (authorSlug) posts = posts.filter((post) => post.author?.slug === authorSlug);

  return { posts, total: count ?? posts.length };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return publishedDemoPosts().find((post) => post.slug === slug) ?? null;

  const { data } = await supabase.from("posts").select(POST_SELECT).eq("slug", slug).eq("status", "published").maybeSingle();
  if (!data) return null;
  return normalizePost(data as Record<string, unknown>);
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  const supabase = createPublicClient();
  if (!supabase) return publishedDemoPosts();

  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1000);

  if (!data) return [];
  return data.map((row) => normalizePost(row as Record<string, unknown>));
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const { posts } = await getPosts({ perPage: limit + 4, categorySlug: post.category?.slug });
  const sameCategory = posts.filter((item) => item.id !== post.id);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const { posts: latest } = await getPosts({ perPage: limit + 4 });
  const filler = latest.filter((item) => item.id !== post.id && !sameCategory.some((p) => p.id === item.id));
  return [...sameCategory, ...filler].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Categorie e autori
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  if (!supabase) return demoCategories;

  const { data } = await supabase.from("categories").select("*").order("position", { ascending: true });
  return (data as Category[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getAuthors(): Promise<Author[]> {
  const supabase = createPublicClient();
  if (!supabase) return demoAuthors;

  const { data } = await supabase.from("authors").select("*").order("name", { ascending: true });
  return (data as Author[]) ?? [];
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const authors = await getAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
}

/** Numero di articoli pubblicati per categoria, per i contatori dell'indice. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const posts = await getAllPublishedPosts();
  return posts.reduce<Record<string, number>>((acc, post) => {
    const slug = post.category?.slug;
    if (slug) acc[slug] = (acc[slug] ?? 0) + 1;
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Risorse (area riservata: lettura con la sessione dell'utente)
// ---------------------------------------------------------------------------

export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient();
  if (!supabase) return demoResources;

  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  return (data as Resource[]) ?? [];
}

/**
 * Anteprima pubblica delle risorse: solo titolo, tipo e descrizione.
 * Serve alla landing /risorse per mostrare cosa c'è dentro senza aprire l'accesso
 * ai file. Passa dal service role perché le policy negano la lettura agli anonimi.
 */
export async function getResourceTeasers(): Promise<Pick<Resource, "id" | "title" | "description" | "type">[]> {
  const supabase = createAdminClient();
  if (!supabase) {
    return demoResources.map(({ id, title, description, type }) => ({ id, title, description, type }));
  }

  const { data } = await supabase
    .from("resources")
    .select("id, title, description, type")
    .eq("published", true)
    .order("position", { ascending: true });

  return (data as Pick<Resource, "id" | "title" | "description" | "type">[]) ?? [];
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const supabase = await createClient();
  if (!supabase) return demoResources.find((resource) => resource.slug === slug) ?? null;

  const { data } = await supabase.from("resources").select("*").eq("slug", slug).maybeSingle();
  return (data as Resource) ?? null;
}
