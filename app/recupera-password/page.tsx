import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { ResetRequestForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Recupera password",
  robots: { index: false, follow: true },
};

export default function RecuperaPasswordPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <Eyebrow>Accesso</Eyebrow>
      <h1 className="t-h1 mt-4">Reimposta la password</h1>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
        Inserisci l&apos;indirizzo con cui ti sei registrato: ti mandiamo un link per sceglierne una nuova.
      </p>
      <div className="mt-8">
        <ResetRequestForm />
      </div>
    </Container>
  );
}
