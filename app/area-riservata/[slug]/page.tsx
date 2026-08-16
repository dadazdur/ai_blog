import Link from "next/link";
import { notFound } from "next/navigation";
import { Column } from "@/components/ui";
import { CopyPromptButton, DownloadButton } from "@/components/download-button";
import { getResourceBySlug } from "@/lib/data";
import { resourceTypeLabels } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RisorsaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <Column className="py-12 sm:py-16">
      <nav aria-label="Percorso" className="meta">
        <Link href="/area-riservata" className="hover:text-ink">
          Risorse
        </Link>{" "}
        / {resource.title}
      </nav>

      <h1 className="t-h1 mt-5">{resource.title}</h1>
      {resource.description ? <p className="t-deck mt-4">{resource.description}</p> : null}

      <div className="ui mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-rule py-3 text-[0.85rem]">
        <span className="font-medium text-ink">{resourceTypeLabels[resource.type]}</span>
        <span className="text-ink-2 num">Aggiornata il {formatDate(resource.created_at)}</span>
        {resource.file_size ? <span className="text-ink-3 num">{formatBytes(resource.file_size)}</span> : null}
      </div>

      {resource.prompt_text ? (
        <section className="mt-10">
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-sunken px-4 py-4 font-mono text-[0.82rem] leading-[1.7] text-ink">
            {resource.prompt_text}
          </pre>
          <div className="mt-4">
            <CopyPromptButton text={resource.prompt_text} />
          </div>
        </section>
      ) : null}

      {resource.file_path || resource.external_url ? (
        <section className="mt-10 rounded-lg border border-rule bg-surface p-6">
          <p className="ui text-[0.82rem] font-medium text-ink">{resource.external_url && !resource.file_path ? "Guarda" : "Scarica"}</p>
          <p className="mt-2 text-[0.92rem] text-ink-2">
            {resource.file_name ?? "Contenuto riservato agli iscritti"}
          </p>
          <div className="mt-4">
            <DownloadButton
              resourceId={resource.id}
              label={resource.external_url && !resource.file_path ? "Apri il video" : "Scarica il file"}
            />
          </div>
        </section>
      ) : null}

      <Link href="/area-riservata" className="link mt-12 inline-block text-[0.9rem] text-accent">
        ← Tutte le risorse
      </Link>
    </Column>
  );
}
