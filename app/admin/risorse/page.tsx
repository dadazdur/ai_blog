import Link from "next/link";
import { ButtonLink, Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { resourceTypeLabels, type Resource } from "@/lib/types";
import { formatBytes, formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRisorsePage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("resources")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  const resources = (data as Resource[]) ?? [];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h2 mt-2">Risorse</h1>
          <p className="mt-2 max-w-xl text-[0.92rem] text-ink-2">
            I file caricati qui finiscono in uno spazio privato: si scaricano solo da un account attivo, tramite un
            collegamento che scade dopo un minuto.
          </p>
        </div>
        <ButtonLink href="/admin/risorse/nuova" size="sm">
          Nuova risorsa
        </ButtonLink>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule">
              {["Titolo", "Tipo", "File", "Stato", "Download", "Creata"].map((heading) => (
                <th key={heading} className="col-head py-3 pr-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b border-rule align-top">
                <td className="py-3 pr-4">
                  <Link href={`/admin/risorse/${resource.id}`} className="text-[0.95rem] text-ink hover:text-accent">
                    {resource.title}
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <span className="meta-sm text-accent">{resourceTypeLabels[resource.type]}</span>
                </td>
                <td className="py-3 pr-4 text-[0.85rem] text-ink-2">
                  {resource.file_name ? (
                    <>
                      {resource.file_name}
                      <span className="meta block">{formatBytes(resource.file_size)}</span>
                    </>
                  ) : resource.external_url ? (
                    "link esterno"
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span className={`col-head ${resource.published ? "text-accent" : "text-ink-3"}`}>
                    {resource.published ? "Visibile" : "Nascosta"}
                  </span>
                </td>
                <td className="py-3 pr-4 meta">{resource.downloads}</td>
                <td className="py-3 pr-4 meta">{formatShortDate(resource.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!resources.length ? (
        <p className="py-10 text-[0.95rem] text-ink-2">
          Nessuna risorsa.{" "}
          <Link href="/admin/risorse/nuova" className="link text-accent">
            Caricane una
          </Link>
          .
        </p>
      ) : null}
    </Container>
  );
}
