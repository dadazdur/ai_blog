import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Notice } from "@/components/ui";
import { DeleteResourceForm, ResourceEditor } from "@/components/admin/resource-editor";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminRisorsaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvato?: string }>;
}) {
  const { id } = await params;
  const { salvato } = await searchParams;

  const supabase = await createClient();
  if (!supabase) return null;

  let resource: Resource | null = null;
  if (id !== "nuova") {
    const { data } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    resource = data as Resource;
  }

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>
            <Link href="/admin/risorse" className="hover:text-ink">
              Risorse
            </Link>{" "}
            / {resource ? "modifica" : "nuova"}
          </Eyebrow>
          <h1 className="t-h2 mt-2">{resource ? resource.title : "Nuova risorsa"}</h1>
        </div>
        {resource ? <DeleteResourceForm id={resource.id} filePath={resource.file_path} /> : null}
      </div>

      {salvato ? (
        <div className="mt-6 max-w-3xl">
          <Notice tone="success">Risorsa creata. Puoi continuare a modificarla qui.</Notice>
        </div>
      ) : null}

      <div className="mt-8">
        <ResourceEditor resource={resource} />
      </div>
    </Container>
  );
}
