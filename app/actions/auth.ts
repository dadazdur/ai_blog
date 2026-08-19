"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { iscriviTitolareAccount } from "@/lib/newsletter-sync";
import type { AuthState } from "@/lib/form-state";

const NOT_CONFIGURED: AuthState = {
  status: "error",
  message: "Accesso non ancora attivo: mancano le variabili Supabase nel file .env.local.",
};

/** Traduce gli errori di Supabase in messaggi che dicono cosa fare. */
function friendlyError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "Email o password non corrispondono.";
  if (normalized.includes("email not confirmed"))
    return "Devi prima confermare l'indirizzo: controlla la mail che ti abbiamo inviato.";
  if (normalized.includes("already registered") || normalized.includes("already been registered"))
    return "Esiste già un account con questa email. Prova ad accedere o a recuperare la password.";
  if (normalized.includes("password should be at least"))
    return "La password deve avere almeno 8 caratteri.";
  if (normalized.includes("rate limit") || normalized.includes("too many"))
    return "Troppi tentativi ravvicinati. Riprova tra qualche minuto.";
  return "Qualcosa non ha funzionato. Riprova tra poco.";
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/area-riservata");

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: friendlyError(error.message) };

  revalidatePath("/", "layout");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/area-riservata");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const studio = String(formData.get("studio") ?? "").trim();

  if (password.length < 8) {
    return { status: "error", message: "Scegli una password di almeno 8 caratteri." };
  }
  if (!formData.get("consenso")) {
    return { status: "error", message: "Serve il consenso al trattamento dei dati per creare l'account." };
  }

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, studio },
      emailRedirectTo: absoluteUrl("/auth/callback?next=/area-riservata"),
    },
  });

  if (error) return { status: "error", message: friendlyError(error.message) };

  // Se la conferma via email è disattivata su Supabase, la sessione è già attiva
  // e il passaggio dal callback non avviene: la newsletter si aggiorna qui.
  if (data.session) {
    await iscriviTitolareAccount({ email, nome: fullName, studio });
    revalidatePath("/", "layout");
    redirect("/area-riservata");
  }

  return {
    status: "success",
    message: "Account creato. Apri l'email di conferma per attivare l'accesso all'area riservata.",
  };
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: absoluteUrl("/auth/callback?next=/area-riservata/password"),
  });

  if (error) return { status: "error", message: friendlyError(error.message) };

  return {
    status: "success",
    message: "Se l'indirizzo è registrato, riceverai il link per reimpostare la password.",
  };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { status: "error", message: "Scegli una password di almeno 8 caratteri." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: friendlyError(error.message) };

  return { status: "success", message: "Password aggiornata." };
}

export async function updateProfile(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Sessione scaduta: rifai l'accesso." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      studio: String(formData.get("studio") ?? "").trim() || null,
    })
    .eq("id", user.id);

  if (error) return { status: "error", message: "Non siamo riusciti a salvare le modifiche." };

  revalidatePath("/area-riservata/profilo");
  return { status: "success", message: "Dati aggiornati." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
