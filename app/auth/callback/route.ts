import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { iscriviTitolareAccount } from "@/lib/newsletter-sync";

/**
 * Punto di atterraggio dei link inviati via email da Supabase
 * (conferma registrazione e reimpostazione password).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/area-riservata";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // L'indirizzo è appena stato dimostrato: è il momento giusto per
        // metterlo in newsletter. Non blocca l'atterraggio se Resend è giù.
        const utente = data?.user;
        if (utente?.email) {
          await iscriviTitolareAccount({
            email: utente.email,
            nome: utente.user_metadata?.full_name ?? null,
            studio: utente.user_metadata?.studio ?? null,
          });
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/accedi?errore=link-non-valido`);
}
