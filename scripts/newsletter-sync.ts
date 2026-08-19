/**
 * Allinea la lista di spedizione.
 *
 *   npm run newsletter:sync
 *
 * Fa due cose, in quest'ordine:
 *   1. iscrive alla newsletter gli account già esistenti (chi si è disiscritto
 *      resta fuori: se ne occupa la funzione SQL);
 *   2. ricopia dentro Resend tutti gli iscritti del database, attivi come
 *      disiscritti, così le due liste dicono la stessa cosa.
 *
 * Richiede NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e RESEND_API_KEY
 * nel file .env.local. È idempotente: rilanciarlo non duplica e non risuscita
 * nessuno, quindi si può usare ogni volta che i due lati sembrano divergere.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { disiscriviContatto, sincronizzaContatto } from "../lib/resend-contacts";

// Carica .env.local senza dipendenze aggiuntive.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // il file può non esistere
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}
if (!process.env.RESEND_API_KEY) {
  console.error("Manca RESEND_API_KEY in .env.local: senza, i contatti non arrivano a Resend.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

/** Resend limita le richieste al secondo: si procede con calma. */
const pausa = () => new Promise((r) => setTimeout(r, 150));

async function main() {
  // --- 1. Gli account entrano in newsletter -------------------------------
  const { data: profili, error: erroreProfili } = await supabase
    .from("profiles")
    .select("email, full_name, studio");

  if (erroreProfili) {
    console.error("Lettura degli account fallita:", erroreProfili.message);
    process.exit(1);
  }

  let iscritti = 0;
  let rispettati = 0;

  for (const profilo of profili ?? []) {
    if (!profilo.email) continue;
    const { data, error } = await supabase.rpc("subscribe_account_holder", { p_email: profilo.email });
    if (error) {
      console.error(`  ! ${profilo.email}: ${error.message}`);
      continue;
    }
    const riga = Array.isArray(data) ? data[0] : data;
    if (riga?.status === "confirmed") iscritti += 1;
    else rispettati += 1;
  }

  console.log(`Account: ${iscritti} in lista, ${rispettati} lasciati fuori perché disiscritti.`);

  // --- 2. Il database si riversa in Resend --------------------------------
  const anagrafica = new Map(
    (profili ?? []).map((p) => [p.email, { nome: p.full_name, studio: p.studio }]),
  );

  const { data: iscrizioni, error: erroreIscrizioni } = await supabase
    .from("newsletter_subscribers")
    .select("email, status, source")
    .order("created_at", { ascending: true });

  if (erroreIscrizioni) {
    console.error("Lettura degli iscritti fallita:", erroreIscrizioni.message);
    process.exit(1);
  }

  let attivi = 0;
  let esclusi = 0;
  let inAttesa = 0;
  let falliti = 0;

  for (const iscrizione of iscrizioni ?? []) {
    // 'pending' non ha ancora confermato: in Resend non ci deve entrare.
    if (iscrizione.status === "pending") {
      inAttesa += 1;
      continue;
    }

    const dati = anagrafica.get(iscrizione.email);
    const esito =
      iscrizione.status === "unsubscribed"
        ? await disiscriviContatto(iscrizione.email)
        : await sincronizzaContatto({
            email: iscrizione.email,
            nome: dati?.nome,
            studio: dati?.studio,
            origine: iscrizione.source ?? "sito",
          });

    if (!esito.ok) {
      console.error(`  ! ${iscrizione.email}: ${esito.motivo}`);
      falliti += 1;
    } else if (iscrizione.status === "unsubscribed") {
      esclusi += 1;
    } else {
      attivi += 1;
    }

    await pausa();
  }

  console.log(
    `Resend: ${attivi} contatti attivi, ${esclusi} marcati disiscritti, ` +
      `${inAttesa} in attesa di conferma (non inviati), ${falliti} falliti.`,
  );

  if (falliti > 0) process.exit(1);
}

main().catch((errore) => {
  console.error(errore);
  process.exit(1);
});
