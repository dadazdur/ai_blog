/**
 * Stato del consenso ai cookie di misurazione.
 *
 * La scelta vive in localStorage e non in un cookie: memorizzare la preferenza
 * è un'operazione necessaria, ma non c'è motivo di scrivere un cookie in più
 * per farlo.
 *
 * Il record è versionato: se un domani cambiano le finalità o i fornitori,
 * basta alzare `CONSENT_VERSION` e a tutti viene richiesto di nuovo.
 */

export const CONSENT_KEY = "ls-consenso-cookie";
export const CONSENT_VERSION = 1;

export type ConsentChoice = "accettato" | "rifiutato";
export type ConsentRecord = { versione: number; scelta: ConsentChoice; data: string };

const EVENT = "ls:consenso";

let rawCache: string | null = null;
let parsedCache: ConsentRecord | null = null;

/** Legge la scelta salvata. Restituisce null se manca o se è di una versione superata. */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null; // navigazione privata o storage negato
  }

  // useSyncExternalStore confronta per identità: senza cache tornerebbe
  // un oggetto nuovo a ogni render e il componente girerebbe all'infinito.
  if (raw === rawCache) return parsedCache;
  rawCache = raw;

  if (!raw) {
    parsedCache = null;
    return null;
  }

  try {
    const record = JSON.parse(raw) as ConsentRecord;
    parsedCache = record?.versione === CONSENT_VERSION ? record : null;
  } catch {
    parsedCache = null;
  }
  return parsedCache;
}

export function writeConsent(scelta: ConsentChoice) {
  const record: ConsentRecord = { versione: CONSENT_VERSION, scelta, data: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // senza storage la scelta vale per questa sola sessione
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Riapre la scelta: usato dal link "Preferenze cookie" nel piè di pagina. */
export function resetConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // niente da rimuovere
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // scelta fatta in un'altra scheda
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
