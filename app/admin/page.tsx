import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const [postsPublished, postsDraft, subscribers, pending, users, resources, latest] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }).eq("published", true),
    supabase
      .from("posts")
      .select("id, title, status, updated_at, slug")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const stats = [
    { label: "Articoli pubblicati", value: postsPublished.count ?? 0, href: "/admin/articoli" as const },
    { label: "Bozze", value: postsDraft.count ?? 0, href: "/admin/articoli" as const },
    { label: "Iscritti confermati", value: subscribers.count ?? 0, href: "/admin/iscritti" as const },
    { label: "In attesa di conferma", value: pending.count ?? 0, href: "/admin/iscritti" as const },
    { label: "Account registrati", value: users.count ?? 0, href: "/admin/iscritti" as const },
    { label: "Risorse pubblicate", value: resources.count ?? 0, href: "/admin/risorse" as const },
  ];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h2 mt-2">Riepilogo</h1>
        </div>
        <ButtonLink href="/admin/articoli/nuovo" size="sm">
          Nuovo articolo
        </ButtonLink>
      </div>

      <dl className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-surface p-5 transition-colors hover:bg-sunken">
            <dt className="ui text-[0.82rem] font-medium text-ink">{stat.label}</dt>
            <dd className="mt-2 text-4xl leading-none text-ink num">{stat.value}</dd>
          </Link>
        ))}
      </dl>

      <section className="mt-12">
        <h2 className="t-h3 border-b border-rule pb-3">Modificati di recente</h2>
        <ul>
          {(latest.data ?? []).map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-4 border-b border-rule py-3">
              <Link href={`/admin/articoli/${post.id}`} className="text-[0.95rem] text-ink hover:text-accent">
                {post.title}
              </Link>
              <span className="flex shrink-0 items-center gap-3">
                <span className="meta">{formatShortDate(post.updated_at)}</span>
                <span
                  className={`col-head ${post.status === "published" ? "text-accent" : "text-ink-3"}`}
                >
                  {post.status === "published" ? "Pubblicato" : "Bozza"}
                </span>
              </span>
            </li>
          ))}
          {!latest.data?.length ? (
            <li className="py-6 text-[0.95rem] text-ink-2">
              Nessun articolo ancora.{" "}
              <Link href="/admin/articoli/nuovo" className="link text-accent">
                Scrivi il primo
              </Link>
              .
            </li>
          ) : null}
        </ul>
      </section>
    </Container>
  );
}
