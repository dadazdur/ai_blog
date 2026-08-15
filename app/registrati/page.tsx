import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { SignUpForm } from "@/components/auth-forms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Crea un account gratuito",
  description:
    "Registrati gratuitamente per scaricare prompt testati, modelli di policy interna e checklist di conformità per l'uso dell'AI nello studio.",
  path: "/registrati",
});

const inclusi = [
  "Libreria di prompt divisa per attività di studio",
  "Modello di policy interna sull'uso dell'AI",
  "Checklist di conformità su dati e privacy",
  "Fogli di lavoro con i controlli già impostati",
];

export default function RegistratiPage() {
  return (
    <Container className="grid gap-14 py-16 lg:grid-cols-2 lg:gap-20">
      <div className="max-w-md">
        <Eyebrow>Accesso gratuito</Eyebrow>
        <h1 className="t-h1 mt-4">Tutto il materiale, senza costi</h1>
        <p className="t-lead mt-4">
          Un account serve solo a tenere traccia degli aggiornamenti e a farti ritrovare le risorse quando cambiano.
          Nessun piano a pagamento, nessuna versione ridotta.
        </p>

        <ul className="mt-8 flex flex-col gap-3 border-t border-rule pt-6">
          {inclusi.map((voce) => (
            <li key={voce} className="flex items-start gap-3 text-[0.93rem] leading-relaxed text-ink-soft">
              <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
              {voce}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-rule bg-surface p-6 sm:p-8">
        <SignUpForm />
      </div>
    </Container>
  );
}
