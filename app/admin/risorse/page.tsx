import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Pill } from "@/components/ui";
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
          <Eyebrow>Area riservata</Eyebrow>
          <h1 className="t-h2 mt-2">Risorse</h1>
          <p className="mt-2 max-w-xl text-[0.92rem] text-ink-soft">
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
                <th key={heading} className="t-label py-3 pr-4 font-medium">
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
                  <Pill>{resourceTypeLabels[resource.type]}</Pill>
                </td>
                <td className="py-3 pr-4 text-[0.85rem] text-ink-soft">
                  {resource.file_name ? (
                    <>
                      {resource.file_name}
                      <span className="t-meta block">{formatBytes(resource.file_size)}</span>
                    </>
                  ) : resource.external_url ? (
                    "link esterno"
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span className={`t-label ${resource.published ? "text-accent" : "text-ink-faint"}`}>
                    {resource.published ? "Visibile" : "Nascosta"}
                  </span>
                </td>
                <td className="py-3 pr-4 t-meta">{resource.downloads}</td>
                <td className="py-3 pr-4 t-meta">{formatShortDate(resource.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!resources.length ? (
        <p className="py-10 text-[0.95rem] text-ink-soft">
          Nessuna risorsa.{" "}
          <Link href="/admin/risorse/nuova" className="link-underline text-accent">
            Caricane una
          </Link>
          .
        </p>
      ) : null}
    </Container>
  );
}
