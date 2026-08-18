"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { newsletterConfirmationEmail, sendEmail, welcomeEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { NewsletterState } from "@/lib/form-state";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: i bot compilano ogni campo, le persone non vedono questo.
  if (formData.get("azienda")) {
    return { status: "success", message: "Controlla la tua casella: ti abbiamo scritto." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "sito");
  const consent = formData.get("consenso");

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Controlla l'indirizzo email: manca qualcosa." };
  }
  if (!consent) {
    return { status: "error", message: "Serve la spunta sul trattamento dei dati per procedere." };
  }
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Newsletter non ancora collegata: configura le variabili Supabase nel file .env.local.",
    };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Manca SUPABASE_SERVICE_ROLE_KEY: senza quella chiave l'iscrizione non può essere registrata.",
    };
  }

  const { data, error } = await supabase.rpc("subscribe_newsletter", { p_email: email, p_source: source });

  if (error) {
    console.error("[newsletter] iscrizione fallita", error);
    return { status: "error", message: "Non siamo riusciti a registrare l'iscrizione. Riprova tra poco." };
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (row?.status === "confirmed") {
    return { status: "already", message: "Sei già iscritto con questo indirizzo. Non serve altro." };
  }

  if (row?.token) {
    const { subject, html, text } = newsletterConfirmationEmail(
      absoluteUrl(`/newsletter/conferma?token=${row.token}`),
    );
    await sendEmail({ to: email, subject, html, text });
  }

  return {
    status: "success",
    message: "Ci siamo quasi: apri l'email di conferma che ti abbiamo appena inviato.",
  };
}

export async function confirmSubscription(token: string) {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false as const, email: null };

  const { data, error } = await supabase.rpc("confirm_newsletter", { p_token: token });
  if (error || !data) return { ok: false as const, email: null };

  // Il token serve al link di disiscrizione e all'intestazione List-Unsubscribe,
  // che è ciò che tiene le email fuori dalla posta indesiderata.
  const unsubscribeUrl = absoluteUrl(`/newsletter/disiscriviti?token=${token}`);
  const { subject, html, text, headers } = welcomeEmail(absoluteUrl("/risorse"), unsubscribeUrl);
  await sendEmail({ to: data as string, subject, html, text, headers });

  return { ok: true as const, email: data as string };
}

export async function unsubscribe(token: string) {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false as const, email: null };

  const { data, error } = await supabase.rpc("unsubscribe_newsletter", { p_token: token });
  if (error || !data) return { ok: false as const, email: null };
  return { ok: true as const, email: data as string };
}
