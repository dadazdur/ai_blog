import type { Metadata } from "next";
import { Column } from "@/components/ui";
import { ResetRequestForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Recupera password",
  robots: { index: false, follow: true },
};

export default function RecuperaPasswordPage() {
  return (
    <Column width="form" className="flex min-h-[70vh] flex-col justify-center py-16">
      <h1 className="t-h1">Reimposta la password</h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
        Inserisci l&apos;indirizzo con cui ti sei registrato: ti mandiamo un link per sceglierne una nuova.
      </p>
      <div className="mt-8">
        <ResetRequestForm />
      </div>
    </Column>
  );
}
