export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Il sito funziona anche senza credenziali: in quel caso mostra i contenuti
 * dimostrativi e disattiva le aree che richiedono un account.
 */
export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function hasServiceRole() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

export const RESOURCES_BUCKET = "risorse";
