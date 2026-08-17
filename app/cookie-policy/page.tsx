import Link from "next/link";
import type { Metadata } from "next";
import { Column, Notice } from "@/components/ui";
import { CookiePreferences } from "@/components/consent";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Cookie policy",
  description: `Quali cookie usa ${siteConfig.name}, a cosa servono e come cambiare idea in qualsiasi momento.`,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <Column className="py-12 sm:py-16">
      <h1 className="t-h1">Cookie policy</h1>
      <p className="meta mt-3">Ultimo aggiornamento: agosto 2026</p>

      <div className="mt-8">
        <Notice tone="warning" title="Da far validare">
          Il contenuto tecnico di questa pagina descrive gli strumenti effettivamente installati. Nomi e durate
          dei cookie di Microsoft Clarity vanno verificati sulla documentazione ufficiale di Microsoft, che può
          cambiarli, e l&apos;informativa va fatta controllare dal tuo consulente privacy.
        </Notice>
      </div>

      <div className="prose mt-10">
        <h2>In breve</h2>
        <p>
          Questo sito usa due tipi di cookie. Quelli <strong>tecnici</strong> servono a farlo funzionare e non
          richiedono il tuo consenso. Quelli di <strong>misurazione</strong> servono a capire quali articoli
          vengono letti e dove la lettura si interrompe: vengono installati <strong>solo se acconsenti</strong>,
          e finché non lo fai non parte alcuno script di terze parti.
        </p>
        <p>
          Non usiamo cookie pubblicitari, non facciamo profilazione a fini commerciali e non vendiamo dati a
          nessuno.
        </p>

        <h2>Cambiare idea</h2>
        <p>
          Puoi revocare o dare il consenso in qualsiasi momento, con la stessa facilità: il pulsante qui sotto
          riapre la scelta, e lo trovi anche in fondo a ogni pagina.
        </p>
      </div>

      <div className="mt-5 rounded-[4px] border border-rule-strong bg-surface px-5 py-4">
        <CookiePreferences className="text-[0.95rem] font-medium text-ink" />
      </div>

      <div className="prose mt-10">
        <h2>Cookie tecnici e preferenze</h2>
        <p>Nessuno di questi richiede consenso: senza, il sito non funzionerebbe o dimenticherebbe le tue scelte.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>A cosa serve</th>
                <th>Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sb-*-auth-token</td>
                <td>Cookie tecnico</td>
                <td>Mantiene la sessione di chi ha effettuato l&apos;accesso all&apos;area riservata</td>
                <td>Fino alla disconnessione</td>
              </tr>
              <tr>
                <td>sa-theme</td>
                <td>Memoria locale</td>
                <td>Ricorda se preferisci il tema chiaro o scuro. Resta nel browser, non viene inviato al server</td>
                <td>Permanente fino alla cancellazione</td>
              </tr>
              <tr>
                <td>ls-consenso-cookie</td>
                <td>Memoria locale</td>
                <td>Registra la scelta che hai fatto su questa pagina, così non ti viene richiesta a ogni visita</td>
                <td>Permanente fino alla revoca</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Cookie di misurazione: Microsoft Clarity</h2>
        <p>
          Se acconsenti, il sito carica <strong>Microsoft Clarity</strong>, uno strumento che misura le visite e
          registra in forma aggregata come le pagine vengono usate: quanto si scorre, dove si clicca, dove la
          lettura si ferma. Serve a capire quali contenuti funzionano, non a identificare le singole persone.
        </p>
        <p>
          <strong>Le aree private sono escluse.</strong> Lo script non viene caricato nell&apos;area riservata né
          nel pannello di amministrazione: lì passano indirizzi email e documenti che riguardano terze persone, e
          non è materiale da registrare.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Dominio</th>
                <th>A cosa serve</th>
                <th>Durata indicativa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_clck</td>
                <td>questo sito</td>
                <td>Identificativo del browser per Clarity</td>
                <td>1 anno</td>
              </tr>
              <tr>
                <td>_clsk</td>
                <td>questo sito</td>
                <td>Unisce le pagine viste in un&apos;unica sessione</td>
                <td>1 giorno</td>
              </tr>
              <tr>
                <td>CLID</td>
                <td>clarity.ms</td>
                <td>Identifica la prima volta che Clarity ha visto questo browser</td>
                <td>1 anno</td>
              </tr>
              <tr>
                <td>MUID</td>
                <td>Microsoft</td>
                <td>Identificativo utente riconosciuto dai domini Microsoft</td>
                <td>1 anno</td>
              </tr>
              <tr>
                <td>ANONCHK, SM</td>
                <td>Microsoft</td>
                <td>Sincronizzazione e controlli tecnici dell&apos;identificativo</td>
                <td>Da 10 minuti alla sessione</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Dove finiscono questi dati</h2>
        <p>
          Il titolare del trattamento resta chi gestisce questo sito; Microsoft agisce come responsabile.
          I dati possono essere trattati anche negli Stati Uniti: il trasferimento avviene sulla base delle
          garanzie previste dalla normativa europea per i trasferimenti extra-UE. Trovi il dettaglio nella
          documentazione privacy di Microsoft Clarity.
        </p>

        <h2>Come rimuoverli comunque</h2>
        <p>
          Oltre a revocare il consenso da questo sito, puoi cancellare i cookie già presenti dalle impostazioni
          del browser. La cancellazione del cookie di sessione comporta la disconnessione dall&apos;area riservata;
          quella della preferenza di tema riporta il sito a seguire l&apos;impostazione di sistema.
        </p>

        <h2>Altre informazioni</h2>
        <p>
          Il trattamento dei dati raccolti tramite registrazione, newsletter e misurazione è descritto nella{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </Column>
  );
}
