import type { Metadata } from "next";
import { Column, Notice } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description: `Informativa sul trattamento dei dati personali degli utenti di ${siteConfig.name}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Column className="py-12 sm:py-16">
      <h1 className="t-h1">Privacy policy</h1>
      <p className="meta mt-3">Ultimo aggiornamento: agosto 2026</p>

      <div className="mt-8">
        <Notice tone="warning" title="Da completare prima della pubblicazione">
          Sostituisci i campi tra parentesi quadre con i dati reali del titolare e fai validare il testo dal tuo
          consulente privacy. Questo modello copre i trattamenti effettivamente presenti nel sito, ma non
          sostituisce una valutazione professionale.
        </Notice>
      </div>

      <div className="prose mt-10">
        <h2>Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento è [nome e cognome / denominazione], con sede in [indirizzo], codice fiscale
          / partita IVA [numero], contattabile all&apos;indirizzo <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>

        <h2>Quali dati raccogliamo</h2>
        <p>Il sito tratta i dati che ci fornisci tu, in quattro situazioni distinte.</p>
        <ul>
          <li>
            <strong>Iscrizione alla newsletter</strong>: indirizzo email, data di iscrizione, data di conferma e
            pagina da cui è arrivata la richiesta.
          </li>
          <li>
            <strong>Registrazione all&apos;area riservata</strong>: nome e cognome, indirizzo email, nome dello
            studio (facoltativo), password conservata in forma cifrata dal fornitore del servizio di
            autenticazione.
          </li>
          <li>
            <strong>Utilizzo dell&apos;area riservata</strong>: registro dei file scaricati, per capire quale
            materiale è utile e mantenerlo aggiornato.
          </li>
          <li>
            <strong>Misurazione dell&apos;uso del sito</strong>, solo se hai acconsentito: pagine viste,
            provenienza, tipo di dispositivo e registrazione aggregata dell&apos;interazione con la pagina
            (scorrimento, clic, punto in cui la lettura si interrompe), tramite Microsoft Clarity. L&apos;area
            riservata e il pannello di amministrazione sono esclusi dalla misurazione.
          </li>
        </ul>
        <p>
          Non usiamo strumenti di profilazione pubblicitaria e non arricchiamo i tuoi dati con informazioni
          provenienti da fonti esterne. Senza il tuo consenso nessuno script di misurazione viene caricato.
        </p>

        <h2>Perché li trattiamo e su quale base</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Finalità</th>
                <th>Base giuridica</th>
                <th>Conservazione</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Invio della newsletter</td>
                <td>Consenso (art. 6.1.a GDPR)</td>
                <td>Fino alla disiscrizione</td>
              </tr>
              <tr>
                <td>Gestione dell&apos;account e accesso alle risorse</td>
                <td>Esecuzione del rapporto (art. 6.1.b GDPR)</td>
                <td>Fino alla cancellazione dell&apos;account</td>
              </tr>
              <tr>
                <td>Misurazione dell&apos;uso del sito (Microsoft Clarity)</td>
                <td>Consenso (art. 6.1.a GDPR)</td>
                <td>Fino a 12 mesi, o fino alla revoca</td>
              </tr>
              <tr>
                <td>Sicurezza e prevenzione degli abusi</td>
                <td>Legittimo interesse (art. 6.1.f GDPR)</td>
                <td>12 mesi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>A chi comunichiamo i dati</h2>
        <p>
          I dati sono trattati da fornitori nominati responsabili del trattamento ai sensi dell&apos;art. 28 GDPR:
        </p>
        <ul>
          <li>[fornitore dell&apos;infrastruttura di hosting] — erogazione del sito</li>
          <li>[fornitore del database e dell&apos;autenticazione] — conservazione degli account e dei file</li>
          <li>[fornitore del servizio di invio email] — recapito delle email di conferma e della newsletter</li>
          <li>Microsoft (Microsoft Clarity) — misurazione dell&apos;uso del sito, solo previo consenso</li>
        </ul>
        <p>
          Non cediamo né vendiamo i dati a terzi. Se un fornitore tratta dati fuori dallo Spazio economico
          europeo, il trasferimento avviene sulla base delle clausole contrattuali standard adottate dalla
          Commissione europea.
        </p>

        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere in qualsiasi momento accesso, rettifica, cancellazione, limitazione e portabilità dei dati,
          e opporti al trattamento fondato sul legittimo interesse. Per la newsletter, la revoca del consenso è
          immediata dal link presente in fondo a ogni email; per la misurazione, dal pulsante «Preferenze cookie»
          presente in fondo a ogni pagina e nella <a href="/cookie-policy">cookie policy</a>.
        </p>
        <p>
          Le richieste vanno inviate a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Se ritieni che
          il trattamento violi la normativa puoi proporre reclamo al Garante per la protezione dei dati personali.
        </p>

        <h2>Sicurezza</h2>
        <p>
          Le connessioni sono cifrate, i file dell&apos;area riservata sono conservati in uno spazio privato
          accessibile solo tramite collegamenti temporanei generati al momento del download, e l&apos;accesso ai
          dati amministrativi è limitato ai soli account autorizzati.
        </p>
      </div>
    </Column>
  );
}
