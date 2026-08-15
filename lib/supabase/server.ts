import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL, hasServiceRole, isSupabaseConfigured } from "./config";
import type { Profile } from "@/lib/types";

/** Client legato ai cookie della richiesta: rispetta le policy RLS dell'utente. */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chiamato da un Server Component: il refresh dei cookie lo gestisce il middleware.
        }
      },
    },
  });
}

/** Client con service role: scavalca RLS. Solo lato server, mai esposto al browser. */
export function createAdminClient() {
  if (!hasServiceRole()) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data) {
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? null,
      studio: null,
      role: "user",
      created_at: user.created_at,
    };
  }
  return data as Profile;
}

export async function requireAdmin() {
  const profile = await getProfile();
  return profile?.role === "admin" ? profile : null;
}
