import "server-only";
import { siteConfig } from "@/lib/site";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? `${siteConfig.name} <redazione@lescritture.com>`;

type SendResult = { sent: boolean; reason?: string };

/**
 * Invio email. Se RESEND_API_KEY non è configurata il messaggio non parte:
 * viene scritto nei log del server, così il flusso resta verificabile in
 * sviluppo e l'admin può confermare l'iscritto a mano dal pannello.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  headers,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}): Promise<SendResult> {
  if (!RESEND_API_KEY) {
    console.info(`[email non inviata: manca RESEND_API_KEY]\nA: ${to}\nOggetto: ${subject}\n${text}`);
    return { sent: false, reason: "provider-non-configurato" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text, headers }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`[email] invio fallito (${response.status}): ${detail}`);
      return { sent: false, reason: "invio-fallito" };
    }
    return { sent: true };
  } catch (error) {
    console.error("[email] errore di rete", error);
    return { sent: false, reason: "errore-di-rete" };
  }
}

/* ------------------------------------------------------------------
   Impaginazione delle email.

   Vincoli veri, non stilistici: i client di posta non caricano webfont,
   ignorano i CSS custom property e Outlook impagina con le tabelle. Quindi
   Georgia al posto di Literata (è il serif presente ovunque e il più vicino
   di spirito), stili in linea, niente variabili, larghezza fissa.
   ------------------------------------------------------------------ */

const PAPER = "#f5f5f3";
const SURFACE = "#ffffff";
const RULE = "#e2e1dd";
const INK = "#161514";
const INK_2 = "#55534e";
const INK_3 = "#6e6b65";
const ACCENT = "#7b1e2e";

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const UI = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

/** Il testo che i client mostrano in anteprima accanto all'oggetto. */
function preheader(testo: string) {
  return `<div style="display:none;font-size:1px;color:${PAPER};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${testo}</div>`;
}

/** Pulsante a tabella: l'unico che regge anche su Outlook. */
function bottone(href: string, etichetta: string) {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
<td bgcolor="${ACCENT}" style="border-radius:3px">
<a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${UI};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:3px">${etichetta}</a>
</td></tr></table>`;
}

function shell({ corpo, anteprima, piede }: { corpo: string; anteprima: string; piede: string }) {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${siteConfig.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};-webkit-font-smoothing:antialiased">
${preheader(anteprima)}
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${PAPER}">
<tr><td align="center" style="padding:32px 16px">

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:${SURFACE};border:1px solid ${RULE}">

<tr><td style="padding:26px 32px 0 32px">
<div style="font-family:${SERIF};font-size:20px;font-weight:bold;letter-spacing:-0.3px;color:${INK}">${siteConfig.name}</div>
</td></tr>
<tr><td style="padding:18px 32px 0 32px"><div style="height:1px;background-color:${RULE};line-height:1px;font-size:0">&nbsp;</div></td></tr>

<tr><td style="padding:26px 32px 30px 32px;font-family:${SERIF};font-size:16px;line-height:1.65;color:${INK}">
${corpo}
</td></tr>

<tr><td style="padding:0 32px"><div style="height:1px;background-color:${RULE};line-height:1px;font-size:0">&nbsp;</div></td></tr>
<tr><td style="padding:18px 32px 26px 32px;font-family:${UI};font-size:12px;line-height:1.6;color:${INK_3}">
${piede}
</td></tr>

</table>

<div style="font-family:${UI};font-size:11px;color:${INK_3};padding-top:16px">${siteConfig.url.replace(/^https?:\/\//, "")}</div>

</td></tr>
</table>
</body>
</html>`;
}

function linkDiRiserva(href: string) {
  return `<p style="margin:22px 0 0 0;font-family:${UI};font-size:12px;line-height:1.6;color:${INK_3};word-break:break-all">
Se il pulsante non funziona, copia questo indirizzo nel browser:<br>
<a href="${href}" style="color:${ACCENT}">${href}</a>
</p>`;
}

export function newsletterConfirmationEmail(confirmUrl: string) {
  const corpo = `
<p style="margin:0 0 16px 0">Manca un passaggio solo.</p>
<p style="margin:0 0 24px 0;color:${INK_2}">Conferma il tuo indirizzo e comincerai a ricevere le guide operative sull'intelligenza artificiale per lo studio: una email quando esce qualcosa che vale il tuo tempo, mai più di una a settimana.</p>
${bottone(confirmUrl, "Confermo l'iscrizione")}
${linkDiRiserva(confirmUrl)}`;

  return {
    subject: `Conferma l'iscrizione a ${siteConfig.name}`,
    text: `Manca un passaggio: conferma il tuo indirizzo aprendo questo link.\n\n${confirmUrl}\n\nSe non hai richiesto l'iscrizione puoi ignorare questa email: senza conferma non riceverai altro.`,
    html: shell({
      corpo,
      anteprima: "Conferma il tuo indirizzo per ricevere le guide.",
      piede: `Hai ricevuto questa email perché il tuo indirizzo è stato inserito su ${siteConfig.url.replace(/^https?:\/\//, "")}. Se non sei stato tu, ignora il messaggio: senza conferma non riceverai altro.`,
    }),
  };
}

export function welcomeEmail(resourcesUrl: string, unsubscribeUrl?: string) {
  const corpo = `
<p style="margin:0 0 16px 0">Iscrizione confermata.</p>
<p style="margin:0 0 24px 0;color:${INK_2}">Da ora ricevi le guide appena escono. Intanto, il materiale operativo è già disponibile: prompt divisi per attività, modelli di documento e checklist da usare in studio.</p>
${bottone(resourcesUrl, "Vai alle risorse")}`;

  const piede = unsubscribeUrl
    ? `Ricevi questa email perché ti sei iscritto su ${siteConfig.url.replace(/^https?:\/\//, "")}. Puoi <a href="${unsubscribeUrl}" style="color:${INK_3}">disiscriverti con un clic</a> in qualsiasi momento.`
    : `Ricevi questa email perché ti sei iscritto su ${siteConfig.url.replace(/^https?:\/\//, "")}.`;

  return {
    subject: `Iscrizione confermata — ${siteConfig.name}`,
    text: `Iscrizione confermata. Il materiale operativo è qui: ${resourcesUrl}${unsubscribeUrl ? `\n\nPer disiscriverti: ${unsubscribeUrl}` : ""}`,
    html: shell({ corpo, anteprima: "Iscrizione confermata: ecco dove trovare il materiale.", piede }),
    headers: unsubscribeUrl
      ? { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
      : undefined,
  };
}
