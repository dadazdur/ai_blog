import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Client senza cookie per i contenuti pubblici (articoli, categorie, autori).
 * Non leggendo la sessione, permette a blog e home di restare statici e
 * rigenerarsi con ISR invece di essere ricalcolati a ogni richiesta.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
