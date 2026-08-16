import type { Metadata } from "next";
import { Container, Panel } from "@/components/ui";
import { SignUpForm } from "@/components/auth-forms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Crea un account gratuito",
  description:
    "Registrati gratuitamente per accedere a prompt testati, modelli di documento e checklist di conformità per l'uso dell'AI in studio.",
  path: "/registrati",
});

const inclusi = [
  "Gli schemi di prompt divisi per attività di studio",
  "I modelli di documento da adattare e far firmare",
  "Le checklist di conformità su dati e privacy",
  "L'avviso quando un materiale viene aggiornato",
];

export default function RegistratiPage() {
  return (
    <Container className="grid gap-x-16 gap-y-12 py-14 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="max-w-[46ch]">
        <h1 className="t-h1">Tutto il materiale, senza costi</h1>
        <p className="t-deck mt-5">
          Un account serve solo a farti ritrovare le risorse quando cambiano. Nessun piano a pagamento, nessuna
          versione ridotta, nessun contatto commerciale.
        </p>

        <ul className="mt-9 flex flex-col">
          {inclusi.map((voce) => (
            <li
              key={voce}
              className="border-t border-rule py-3 text-[0.98rem] leading-relaxed text-ink-2 last:border-b"
            >
              {voce}
            </li>
          ))}
        </ul>
      </div>

      <Panel className="p-6 sm:p-7">
        <SignUpForm />
      </Panel>
    </Container>
  );
}
