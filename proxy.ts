import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const PROTECTED = ["/area-riservata", "/admin"];

/** Pagine che hanno senso solo per chi non è entrato: accesso e registrazione. */
const SOLO_ANONIMI = ["/accedi", "/registrati", "/recupera-password"];

/** L'unico host su cui il sito deve essere visto in produzione. */
const HOST_CANONICO = "lescritture.com";

export default async function proxy(request: NextRequest) {
  // Il deploy di produzione risponde anche sull'alias *.vercel.app. Chi ci arriva
  // — perché un link di Supabase ce l'ha mandato, o perché l'indirizzo gira — deve
  // vedere il dominio vero: qui viene spostato, con percorso e query intatti. Le
  // anteprime hanno VERCEL_ENV="preview" e restano raggiungibili dove sono.
  const host = request.headers.get("host") ?? "";
  if (process.env.VERCEL_ENV === "production" && host.endsWith(".vercel.app")) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = HOST_CANONICO;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // Rete di sicurezza per i link delle email. Supabase onora l'indirizzo di ritorno
  // chiesto dal codice solo se compare tra i Redirect URL del pannello: altrimenti
  // ricade sul Site URL e recapita il `code` sulla radice, dove nessuno lo raccoglie
  // e l'iscritto resta in home senza sessione. Qui il codice viene riportato al
  // callback, che lo scambia e atterra nell'area riservata.
  const codiceDiAccesso = request.nextUrl.searchParams.get("code");
  if (codiceDiAccesso && request.nextUrl.pathname !== "/auth/callback") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.search = "";
    url.searchParams.set("code", codiceDiAccesso);
    url.searchParams.set("next", request.nextUrl.searchParams.get("next") ?? "/area-riservata");
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Rinnova la sessione a ogni richiesta: senza questa chiamata i token scadono.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && PROTECTED.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/accedi";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Chi è già entrato non deve vedere accesso e registrazione: non è solo
  // questione di link nascosti, l'indirizzo può arrivare da un preferito o dal
  // tasto indietro. Se la richiesta portava con sé una destinazione, si onora
  // quella — è il caso di chi era stato mandato al login da una pagina protetta.
  if (user && SOLO_ANONIMI.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const richiesta = request.nextUrl.searchParams.get("redirect");
    const url = request.nextUrl.clone();
    url.pathname = richiesta?.startsWith("/") ? richiesta : "/area-riservata";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/area-riservata";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/og|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
};
