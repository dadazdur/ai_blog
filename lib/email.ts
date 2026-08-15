import "server-only";
import { siteConfig } from "@/lib/site";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? `${siteConfig.name} <noreply@studioaumentato.it>`;

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
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
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
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
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

const shell = (body: string) => `<!doctype html><html lang="it"><body style="margin:0;background:#f3f5f1;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#14211c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border:1px solid #dce2d8;border-radius:8px;padding:32px">
<tr><td style="font-size:20px;font-weight:600;padding-bottom:16px">${siteConfig.name}</td></tr>
${body}
<tr><td style="padding-top:28px;border-top:1px solid #dce2d8;color:#56655c;font-size:12px;line-height:1.6">
Hai ricevuto questa email perché il tuo indirizzo è stato inserito su ${siteConfig.url}. Se non sei stato tu, ignora il messaggio: senza conferma non riceverai altro.
</td></tr>
</table></td></tr></table></body></html>`;

export function newsletterConfirmationEmail(confirmUrl: string) {
  return {
    subject: `Conferma l'iscrizione a ${siteConfig.name}`,
    text: `Manca un passaggio: conferma il tuo indirizzo aprendo questo link.\n\n${confirmUrl}\n\nSe non hai richiesto l'iscrizione puoi ignorare questa email.`,
    html: shell(`
<tr><td style="font-size:15px;line-height:1.6;padding-bottom:20px">
Manca un passaggio solo. Conferma il tuo indirizzo e inizierai a ricevere le guide pratiche sull'intelligenza artificiale per lo studio.
</td></tr>
<tr><td style="padding-bottom:20px">
<a href="${confirmUrl}" style="display:inline-block;background:#0a6b4e;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:500">Confermo l'iscrizione</a>
</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#56655c;word-break:break-all;padding-bottom:8px">
Se il pulsante non funziona, copia questo indirizzo nel browser:<br />${confirmUrl}
</td></tr>`),
  };
}

export function welcomeEmail(resourcesUrl: string) {
  return {
    subject: `Iscrizione confermata — ${siteConfig.name}`,
    text: `Iscrizione confermata. Le risorse dello studio sono qui: ${resourcesUrl}`,
    html: shell(`
<tr><td style="font-size:15px;line-height:1.6;padding-bottom:20px">
Iscrizione confermata. Da ora ricevi le guide operative appena escono, senza rumore: una email quando c'è qualcosa che vale il tuo tempo.
</td></tr>
<tr><td style="padding-bottom:20px">
<a href="${resourcesUrl}" style="display:inline-block;background:#0a6b4e;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:500">Vai alle risorse</a>
</td></tr>`),
  };
}
