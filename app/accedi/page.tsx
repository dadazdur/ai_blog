import type { Metadata } from "next";
import { Container, Eyebrow, Notice } from "@/components/ui";
import { SignInForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi all'area riservata di Studio Aumentato per scaricare prompt, template e guide operative.",
  robots: { index: false, follow: true },
};

export default async function AccediPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; errore?: string }>;
}) {
  const { redirect, errore } = await searchParams;

  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <Eyebrow>Area riservata</Eyebrow>
      <h1 className="t-h1 mt-4">Bentornato</h1>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
        Accedi per scaricare la libreria di prompt, i modelli e le checklist.
      </p>

      {errore ? (
        <div className="mt-6">
          <Notice tone="error">Il link non è più valido. Richiedine uno nuovo e riprova.</Notice>
        </div>
      ) : null}

      <div className="mt-8">
        <SignInForm redirectTo={redirect} />
      </div>
    </Container>
  );
}
