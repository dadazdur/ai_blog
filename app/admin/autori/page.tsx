import { Container, Eyebrow } from "@/components/ui";
import { AuthorForm, CategoryForm } from "@/components/admin/entity-forms";
import { createClient } from "@/lib/supabase/server";
import type { Author, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

function Collapsible({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-rule">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 marker:content-none">
        <span>
          <span className="text-[0.98rem] text-ink">{title}</span>
          {subtitle ? <span className="t-meta ml-3">{subtitle}</span> : null}
        </span>
        <span aria-hidden="true" className="font-mono text-sm text-accent transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-8">{children}</div>
    </details>
  );
}

export default async function AdminAutoriPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const [{ data: authorsData }, { data: categoriesData }] = await Promise.all([
    supabase.from("authors").select("*").order("name"),
    supabase.from("categories").select("*").order("position"),
  ]);

  const authors = (authorsData as Author[]) ?? [];
  const categories = (categoriesData as Category[]) ?? [];

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>Impostazioni contenuti</Eyebrow>
      <h1 className="t-h2 mt-2">Autori e categorie</h1>

      <section className="mt-10">
        <h2 className="t-h3 border-b border-rule pb-3">Autori</h2>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
          Nome, qualifica e biografia finiscono nei dati strutturati di ogni articolo firmato: su temi fiscali è
          il segnale di autorevolezza che pesa di più.
        </p>

        <div className="mt-5 border-t border-rule">
          {authors.map((author) => (
            <Collapsible key={author.id} title={author.name} subtitle={author.role_title ?? undefined}>
              <AuthorForm author={author} />
            </Collapsible>
          ))}
          <Collapsible title="Aggiungi un autore">
            <AuthorForm />
          </Collapsible>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="t-h3 border-b border-rule pb-3">Categorie</h2>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
          Ogni categoria è una pagina indicizzabile: tienile poche e distinte, con una descrizione scritta per chi
          cerca quel tema.
        </p>

        <div className="mt-5 border-t border-rule">
          {categories.map((category) => (
            <Collapsible key={category.id} title={category.name} subtitle={`/${category.slug}`}>
              <CategoryForm category={category} />
            </Collapsible>
          ))}
          <Collapsible title="Aggiungi una categoria">
            <CategoryForm />
          </Collapsible>
        </div>
      </section>
    </Container>
  );
}
