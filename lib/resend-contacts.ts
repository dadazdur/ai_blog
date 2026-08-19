/**
 * Contatti Resend: la lista di spedizione della newsletter.
 *
 * Il database resta la verità sul consenso — ha il doppio opt-in, i token e le
 * date che il pannello admin mostra. Resend è la copia operativa da cui partono
 * le newsletter, e va tenuta allineata.
 *
 * Nessuna funzione qui solleva eccezioni: se Resend è irraggiungibile, una
 * registrazione o una disiscrizione devono comunque andare a buon fine. Il
 * disallineamento si recupera con `npm run newsletter:sync`.
 *
 * Volutamente senza `server-only`: lo stesso codice lo usa lo script di
 * allineamento, che gira in Node fuori da Next. La chiave non è esposta lo
 * stesso, perché senza prefisso NEXT_PUBLIC_ non entra in nessun bundle.
 */

const CONTATTI = "https://api.resend.com/contacts";

// Lette a ogni chiamata, non al caricamento del modulo: lo script di
// allineamento popola process.env dopo che gli import sono già stati risolti,
// e una costante presa qui sopra resterebbe vuota per sempre.
const chiave = () => process.env.RESEND_API_KEY ?? "";
const segmento = () => (process.env.RESEND_SEGMENT_ID ?? "").trim();

export type EsitoContatto = { ok: boolean; motivo?: string };

export type DatiContatto = {
  email: string;
  nome?: string | null;
  studio?: string | null;
  origine?: string | null;
  /** true marca il contatto come disiscritto da tutte le newsletter. */
  disiscritto?: boolean;
};

/** "Andrea Durante" → primo e resto. Un nome solo resta tutto nel primo campo. */
function separaNome(nome?: string | null) {
  const pulito = (nome ?? "").trim().replace(/\s+/g, " ");
  if (!pulito) return {};
  const [primo, ...resto] = pulito.split(" ");
  return { first_name: primo, last_name: resto.join(" ") || undefined };
}

function invia(url: string, metodo: "POST" | "PATCH", corpo: unknown) {
  return fetch(url, {
    method: metodo,
    headers: { Authorization: `Bearer ${chiave()}`, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

/**
 * Crea il contatto o, se c'è già, lo aggiorna. Resend non ha un upsert: si tenta
 * la creazione (il caso normale) e si ripiega sull'aggiornamento per email.
 */
export async function sincronizzaContatto(dati: DatiContatto): Promise<EsitoContatto> {
  if (!chiave()) return { ok: false, motivo: "provider-non-configurato" };

  const email = dati.email.trim().toLowerCase();
  const nome = separaNome(dati.nome);
  const unsubscribed = dati.disiscritto ?? false;

  // Le proprietà servono a segmentare dentro Resend senza rientrare nel database.
  const proprieta: Record<string, string> = {};
  if (dati.origine) proprieta.origine = dati.origine;
  if (dati.studio) proprieta.studio = dati.studio;
  const properties = Object.keys(proprieta).length ? proprieta : undefined;

  try {
    const creazione = await invia(CONTATTI, "POST", {
      email,
      ...nome,
      unsubscribed,
      // L'API vuole oggetti, non stringhe: un array di id fa fallire tutto con un 422.
      ...(segmento() ? { segments: [{ id: segmento() }] } : {}),
      ...(properties ? { properties } : {}),
    });
    if (creazione.ok) return { ok: true };

    // Va conservato: se anche il ripiego fallisce, il suo errore da solo sarebbe
    // fuorviante — un «contatto inesistente» che nasconde il vero motivo per cui
    // non è stato creato.
    const erroreCreazione = `${creazione.status} ${await creazione.text()}`;

    // Esiste già: PATCH accetta l'email come chiave. I campi assenti non vengono
    // toccati, quindi una disiscrizione non cancella il nome raccolto prima.
    const aggiornamento = await invia(`${CONTATTI}/${encodeURIComponent(email)}`, "PATCH", {
      ...nome,
      unsubscribed,
      ...(properties ? { properties } : {}),
    });
    if (aggiornamento.ok) return { ok: true };

    console.error(
      `[resend] contatto non sincronizzato — creazione: ${erroreCreazione} · ` +
        `aggiornamento: ${aggiornamento.status} ${await aggiornamento.text()}`,
    );
    return { ok: false, motivo: "richiesta-rifiutata" };
  } catch (errore) {
    console.error("[resend] errore di rete sul contatto", errore);
    return { ok: false, motivo: "errore-di-rete" };
  }
}

/** Marca il contatto come disiscritto. Se non esiste, lo crea già disiscritto. */
export function disiscriviContatto(email: string): Promise<EsitoContatto> {
  return sincronizzaContatto({ email, disiscritto: true });
}
