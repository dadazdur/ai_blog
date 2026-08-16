import Link from "next/link";
import { Container, Notice } from "@/components/ui";
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
    <Container className="py-12 sm:py-14">
      <h1 className="t-h1">{nome ? `Ciao ${nome}` : "Le tue risorse"}</h1>
      <p className="t-deck mt-4 max-w-[54ch]">
        Tutto il materiale è scaricabile senza limiti. Quando aggiorno un file lo trovi qui con la data nuova.
      </p>

      {!isSupabaseConfigured() ? (
        <div className="mt-8 max-w-[54ch]">
          <Notice tone="warning" title="Stai vedendo contenuti dimostrativi">
            Le variabili Supabase non sono configurate: i download non sono attivi. Segui il README per collegare
            il database e caricare i file veri.
          </Notice>
        </div>
      ) : null}

      {gruppi.length ? (
        <div className="mt-12 flex flex-col gap-14">
          {gruppi.map((gruppo) => (
            <section key={gruppo.type}>
              <h2 className="t-h3">{resourceTypeLabels[gruppo.type]}</h2>
              <ul className="mt-5 grid gap-x-14 sm:grid-cols-2">
                {gruppo.items.map((resource) => (
                  <li key={resource.id} className="flex flex-col border-t border-rule py-5">
                    <h3 className="text-[1.08rem] font-semibold leading-snug tracking-[-0.015em]">
                      <Link href={`/area-riservata/${resource.slug}`} className="link">
                        {resource.title}
                      </Link>
                    </h3>

                    {resource.description ? (
                      <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{resource.description}</p>
                    ) : null}

                    {resource.file_size ? <p className="meta-sm mt-2">{formatBytes(resource.file_size)}</p> : null}

                    <div className="mt-4 pt-1">
                      {resource.type === "prompt" && !resource.file_path ? (
                        <Link href={`/area-riservata/${resource.slug}`} className="ui link text-[0.88rem]">
                          Apri il prompt
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
        </div>
      ) : (
        <div className="mt-12 max-w-[54ch] border-t border-rule pt-8">
          <h2 className="t-h3">Il primo materiale sta arrivando</h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-2">
            Qui troverai gli schemi di prompt divisi per attività, i modelli di documento da adattare e le
            checklist di conformità. Pubblichiamo solo materiale che abbiamo usato davvero, quindi arriva un pezzo
            alla volta — e tu ricevi un&apos;email ogni volta che ne esce uno.
          </p>
        </div>
      )}
    </Container>
  );
}
