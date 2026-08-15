import Link from "next/link";
import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Cookie policy",
  description: `Quali cookie usa ${siteConfig.name} e perché non compare nessun banner di consenso.`,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <Container className="max-w-3xl py-14">
      <Eyebrow>Informativa</Eyebrow>
      <h1 className="t-h1 mt-4">Cookie policy</h1>
      <p className="t-meta mt-3">Ultimo aggiornamento: agosto 2026</p>

      <div className="prose mt-10">
        <h2>Perché non vedi un banner</h2>
        <p>
          Questo sito non usa cookie di profilazione, non ha pixel pubblicitari e non condivide dati di
          navigazione con piattaforme terze. Il banner di consenso è obbligatorio solo per i cookie non tecnici:
          non avendone, non lo mostriamo. Se in futuro introdurremo strumenti di misurazione, questa pagina verrà
          aggiornata e il banner comparirà prima dell&apos;attivazione.
        </p>

        <h2>Cosa viene salvato sul tuo dispositivo</h2>
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
                <td>Tecnico</td>
                <td>Mantiene la sessione di chi ha effettuato l&apos;accesso all&apos;area riservata</td>
                <td>Fino alla disconnessione</td>
              </tr>
              <tr>
                <td>sa-theme</td>
                <td>Preferenza locale</td>
                <td>Ricorda se preferisci il tema chiaro o scuro. Resta nel browser, non viene inviato al server</td>
                <td>Permanente fino alla cancellazione</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Come rimuoverli</h2>
        <p>
          Puoi cancellare questi elementi dalle impostazioni del browser. La cancellazione del cookie di sessione
          comporta la disconnessione dall&apos;area riservata; quella della preferenza di tema riporta il sito a
          seguire l&apos;impostazione di sistema.
        </p>

        <h2>Altre informazioni</h2>
        <p>
          Il trattamento dei dati raccolti tramite registrazione e newsletter è descritto nella{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </Container>
  );
}
