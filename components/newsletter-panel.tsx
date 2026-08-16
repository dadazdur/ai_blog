import { NewsletterForm } from "@/components/newsletter-form";

/**
 * La colonna di iscrizione è la regione che l'accento possiede: fondo pieno,
 * nessun angolo arrotondato, nessun bordo su quattro lati.
 *
 * Il colore del fondo cambia con il tema perché a cambiare deve essere la
 * relazione con la pagina, non la tinta: su carta chiara serve un blocco scuro
 * per restare quieto, su fondo scuro serve il vino saturo per staccarsi.
 */
export function NewsletterPanel({
  source,
  title = "Ricevi le guide",
  children,
}: {
  source: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-panel-bg px-5 py-6 text-panel-ink">
      <h2 className="text-[1.1rem] font-semibold tracking-[-0.015em] text-panel-ink">{title}</h2>
      <div className="mt-2 text-[0.92rem] leading-relaxed text-panel-ink-2">
        {children ?? <p>Una email quando esce qualcosa che vale il tuo tempo. Mai più di una a settimana.</p>}
      </div>
      <div className="mt-4">
        <NewsletterForm source={source} stacked onPanel />
      </div>
    </section>
  );
}
