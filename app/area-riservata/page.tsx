import Link from "next/link";
import { Container, Eyebrow, Notice, Pill } from "@/components/ui";
import { DownloadButton } from "@/components/download-button";
import { getResources } from "@/lib/data";
import { getProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resourceTypeLabels, type ResourceType } from "@/lib/types";
import { formatBytes } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ordine: ResourceType[] = ["prompt", "template", "guida", "video"];

export default async function AreaRiservataPage() {
  const [resources, profile] = await Promise.all([getResources(), getProfile()]);
  const nome = profile?.full_name?.split(" ")[0];

  const gruppi = ordine
    .map((type) => ({ type, items: resources.filter((resource) => resource.type === type) }))
    .filter((gruppo) => gruppo.items.length > 0);

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Area riservata</Eyebrow>
      <h1 className="t-h1 mt-4">{nome ? `Ciao ${nome}` : "Le tue risorse"}</h1>
      <p className="t-lead mt-4 max-w-2xl">
        Tutto il materiale è scaricabile senza limiti. Quando aggiorno un file lo trovi qui con la data nuova.
      </p>

      {!isSupabaseConfigured() ? (
        <div className="mt-8 max-w-2xl">
          <Notice tone="warning" title="Stai vedendo contenuti dimostrativi">
            Le variabili Supabase non sono configurate: i download non sono attivi. Segui il README per collegare
            il database e caricare i file veri.
          </Notice>
        </div>
      ) : null}

      <div className="mt-12 flex flex-col gap-14">
        {gruppi.map((gruppo) => (
          <section key={gruppo.type}>
            <h2 className="t-h3 border-b border-rule pb-3">{resourceTypeLabels[gruppo.type]}</h2>
            <ul className="grid gap-px overflow-hidden border-x border-b border-rule bg-rule sm:grid-cols-2">
              {gruppo.items.map((resource) => (
                <li key={resource.id} className="flex flex-col gap-3 bg-surface p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Pill>{resourceTypeLabels[resource.type]}</Pill>
                    {resource.file_size ? (
                      <span className="t-meta">{formatBytes(resource.file_size)}</span>
                    ) : null}
                  </div>

                  <h3 className="font-display text-[1.18rem] leading-snug text-ink">
                    <Link href={`/area-riservata/${resource.slug}`} className="link-underline">
                      {resource.title}
                    </Link>
                  </h3>

                  {resource.description ? (
                    <p className="text-[0.9rem] leading-relaxed text-ink-soft">{resource.description}</p>
                  ) : null}

                  <div className="mt-auto pt-2">
                    {resource.type === "prompt" && !resource.file_path ? (
                      <Link href={`/area-riservata/${resource.slug}`} className="link-underline text-[0.88rem] text-accent">
                        Apri il prompt →
                      </Link>
                    ) : (
                      <DownloadButton resourceId={resource.id} variant="outline" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {!gruppi.length ? (
          <Notice tone="info">Non ci sono ancora risorse pubblicate. Torna tra qualche giorno.</Notice>
        ) : null}
      </div>
    </Container>
  );
}
