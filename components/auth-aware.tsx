"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/browser";

/**
 * Dice se c'è una sessione attiva, guardandola dal browser.
 *
 * Volutamente non lato server: la testata e il piede stanno nel layout comune,
 * e leggere lì i cookie renderebbe dinamica ogni pagina del sito, perdendo la
 * generazione statica su cui si regge il posizionamento.
 *
 * Finché la risposta non c'è vale `null`, e chi la consuma tratta l'incertezza
 * come «anonimo»: è il caso di gran lunga più frequente, e così l'invito a
 * iscriversi non compare in ritardo proprio a chi deve ancora farlo.
 */
function useAutenticato(): boolean | null {
  const [autenticato, setAutenticato] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (vivo) setAutenticato(Boolean(data.session));
    });

    // Entrare o uscire aggiorna la pagina senza bisogno di ricaricarla.
    const { data } = supabase.auth.onAuthStateChange((_evento, sessione) => {
      if (vivo) setAutenticato(Boolean(sessione));
    });

    return () => {
      vivo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return autenticato;
}

/** Mostra il contenuto solo a chi non è ancora entrato. */
export function SoloAnonimi({ children }: { children: ReactNode }) {
  return useAutenticato() === true ? null : <>{children}</>;
}

/** Mostra il contenuto solo a chi è entrato. */
export function SoloAutenticati({ children }: { children: ReactNode }) {
  return useAutenticato() === true ? <>{children}</> : null;
}
