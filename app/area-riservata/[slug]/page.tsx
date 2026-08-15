import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Pill } from "@/components/ui";
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
    <Container className="max-w-3xl py-12 sm:py-16">
      <nav aria-label="Percorso" className="t-meta">
        <Link href="/area-riservata" className="hover:text-ink">
          Risorse
        </Link>{" "}
        / {resource.title}
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Pill>{resourceTypeLabels[resource.type]}</Pill>
        <span className="t-meta">Aggiornata il {formatDate(resource.created_at)}</span>
        {resource.file_size ? <span className="t-meta">{formatBytes(resource.file_size)}</span> : null}
      </div>

      <h1 className="t-h1 mt-4">{resource.title}</h1>
      {resource.description ? <p className="t-lead mt-4">{resource.description}</p> : null}

      {resource.prompt_text ? (
        <section className="mt-10">
          <Eyebrow>Il testo del prompt</Eyebrow>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-rule bg-surface-sunken px-4 py-4 font-mono text-[0.82rem] leading-[1.7] text-ink">
            {resource.prompt_text}
          </pre>
          <div className="mt-4">
            <CopyPromptButton text={resource.prompt_text} />
          </div>
        </section>
      ) : null}

      {resource.file_path || resource.external_url ? (
        <section className="mt-10 rounded-lg border border-rule bg-surface p-6">
          <p className="t-label">{resource.external_url && !resource.file_path ? "Guarda" : "Scarica"}</p>
          <p className="mt-2 text-[0.92rem] text-ink-soft">
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

      <Link href="/area-riservata" className="link-underline mt-12 inline-block text-[0.9rem] text-accent">
        ← Tutte le risorse
      </Link>
    </Container>
  );
}
