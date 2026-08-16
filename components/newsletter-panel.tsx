import { NewsletterForm } from "@/components/newsletter-form";

/**
 * La colonna di iscrizione è la regione che l'accento possiede: fondo oxblood
 * pieno, nessun angolo arrotondato, nessun bordo su quattro lati. È l'unico
 * blocco colorato della pagina, e per questo si vede.
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
    <section className="bg-accent-solid px-5 py-6 text-accent-solid-ink">
      <h2 className="text-[1.1rem] font-semibold tracking-[-0.015em] text-accent-solid-ink">{title}</h2>
      <div className="mt-2 text-[0.92rem] leading-relaxed text-accent-solid-ink/85">
        {children ?? <p>Una email quando esce qualcosa che vale il tuo tempo. Mai più di una a settimana.</p>}
      </div>
      <div className="mt-4">
        <NewsletterForm source={source} stacked onAccent />
      </div>
    </section>
  );
}
