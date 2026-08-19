import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sincronizzaContatto } from "@/lib/resend-contacts";

/**
 * Iscrive alla newsletter chi ha un account.
 *
 * Non sta in un file "use server" di proposito: là ogni export diventa un
 * endpoint raggiungibile dall'esterno, e questa funzione iscrive un indirizzo
 * senza chiedere conferma. Va chiamata solo da codice server che ha già
 * verificato di chi è la casella — l'atterraggio del link di conferma, o una
 * registrazione appena conclusa.
 *
 * È idempotente e rispetta le disiscrizioni: se la persona si è tolta dalla
 * lista, la funzione SQL non la riporta dentro e qui non si tocca Resend.
 */
export async function iscriviTitolareAccount({
  email,
  nome,
  studio,
}: {
  email: string;
  nome?: string | null;
  studio?: string | null;
}): Promise<{ ok: boolean; motivo?: string }> {
  const indirizzo = email.trim().toLowerCase();
  if (!indirizzo) return { ok: false, motivo: "email-mancante" };

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("[newsletter] manca SUPABASE_SERVICE_ROLE_KEY: account non iscritto");
    return { ok: false, motivo: "service-role-mancante" };
  }

  const { data, error } = await supabase.rpc("subscribe_account_holder", { p_email: indirizzo });
  if (error) {
    console.error("[newsletter] iscrizione dell'account fallita", error);
    return { ok: false, motivo: "scrittura-fallita" };
  }

  const riga = Array.isArray(data) ? data[0] : data;

  // Chi si è disiscritto resta fuori: la funzione SQL lo lascia 'unsubscribed'
  // e qui ci si ferma, senza rimetterlo tra i contatti attivi di Resend.
  if (riga?.status !== "confirmed") return { ok: true, motivo: "disiscrizione-rispettata" };

  await sincronizzaContatto({ email: indirizzo, nome, studio, origine: "account" });
  return { ok: true };
}
