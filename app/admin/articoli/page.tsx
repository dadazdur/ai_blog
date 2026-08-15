import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  updated_at: string | null;
  categories: { name: string } | { name: string }[] | null;
  authors: { name: string } | { name: string }[] | null;
};

const first = <T,>(value: T | T[] | null): T | null => (Array.isArray(value) ? (value[0] ?? null) : value);

export default async function AdminArticoliPage({
  searchParams,
}: {
  searchParams: Promise<{ stato?: string }>;
}) {
  const { stato } = await searchParams;
  const supabase = await createClient();
  if (!supabase) return null;

  let query = supabase
    .from("posts")
    .select("id, slug, title, status, published_at, updated_at, categories(name), authors(name)")
    .order("updated_at", { ascending: false });

  if (stato === "draft" || stato === "published") query = query.eq("status", stato);

  const { data } = await query;
  const posts = (data ?? []) as unknown as Row[];

  const filters = [
    { label: "Tutti", value: undefined },
    { label: "Pubblicati", value: "published" },
    { label: "Bozze", value: "draft" },
  ];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Contenuti</Eyebrow>
          <h1 className="t-h2 mt-2">Articoli</h1>
        </div>
        <ButtonLink href="/admin/articoli/nuovo" size="sm">
          Nuovo articolo
        </ButtonLink>
      </div>

      <nav aria-label="Filtra per stato" className="mt-6 flex gap-5 border-b border-rule pb-3">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/articoli?stato=${filter.value}` : "/admin/articoli"}
            className={cn("t-label", stato === filter.value ? "text-accent" : "hover:text-ink")}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule">
              {["Titolo", "Categoria", "Autore", "Stato", "Data"].map((heading) => (
                <th key={heading} className="t-label py-3 pr-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-rule align-top">
                <td className="py-3 pr-4">
                  <Link href={`/admin/articoli/${post.id}`} className="text-[0.95rem] text-ink hover:text-accent">
                    {post.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[0.72rem] text-ink-faint">/blog/{post.slug}</p>
                </td>
                <td className="py-3 pr-4 text-[0.88rem] text-ink-soft">{first(post.categories)?.name ?? "—"}</td>
                <td className="py-3 pr-4 text-[0.88rem] text-ink-soft">{first(post.authors)?.name ?? "—"}</td>
                <td className="py-3 pr-4">
                  <span className={cn("t-label", post.status === "published" ? "text-accent" : "text-ink-faint")}>
                    {post.status === "published" ? "Pubblicato" : "Bozza"}
                  </span>
                </td>
                <td className="py-3 pr-4 t-meta">{formatShortDate(post.published_at ?? post.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!posts.length ? (
        <p className="py-10 text-[0.95rem] text-ink-soft">
          Nessun articolo.{" "}
          <Link href="/admin/articoli/nuovo" className="link-underline text-accent">
            Scrivi il primo
          </Link>
          .
        </p>
      ) : null}
    </Container>
  );
}
