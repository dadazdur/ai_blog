"use server";

import { createClient } from "@/lib/supabase/server";
import { RESOURCES_BUCKET } from "@/lib/supabase/config";

export type DownloadResult = { url: string } | { error: string };

/**
 * Genera un URL firmato valido 60 secondi e registra il download.
 * Il bucket resta privato: nessun file è raggiungibile senza sessione attiva.
 */
export async function getDownloadUrl(resourceId: string): Promise<DownloadResult> {
  const supabase = await createClient();
  if (!supabase) return { error: "Archivio non configurato." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Devi accedere per scaricare questo file." };

  const { data: resource } = await supabase
    .from("resources")
    .select("id, file_path, external_url")
    .eq("id", resourceId)
    .maybeSingle();

  if (!resource) return { error: "Risorsa non trovata." };

  if (resource.external_url && !resource.file_path) {
    await supabase.rpc("register_download", { p_resource: resource.id });
    return { url: resource.external_url as string };
  }

  if (!resource.file_path) return { error: "Per questa risorsa non c'è ancora un file allegato." };

  const { data, error } = await supabase.storage
    .from(RESOURCES_BUCKET)
    .createSignedUrl(resource.file_path as string, 60, { download: true });

  if (error || !data?.signedUrl) return { error: "Il file non è al momento disponibile. Riprova tra poco." };

  await supabase.rpc("register_download", { p_resource: resource.id });
  return { url: data.signedUrl };
}
