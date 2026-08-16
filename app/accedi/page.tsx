import type { Metadata } from "next";
import { Column, Notice } from "@/components/ui";
import { SignInForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi all'area riservata di Studio Aumentato.",
  robots: { index: false, follow: true },
};

export default async function AccediPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; errore?: string }>;
}) {
  const { redirect, errore } = await searchParams;

  return (
    <Column width="form" className="flex min-h-[70vh] flex-col justify-center py-16">
      <h1 className="t-h1">Bentornato</h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
        Accedi per scaricare prompt, modelli e checklist.
      </p>

      {errore ? (
        <div className="mt-6">
          <Notice tone="error">Il link non è più valido. Richiedine uno nuovo e riprova.</Notice>
        </div>
      ) : null}

      <div className="mt-8">
        <SignInForm redirectTo={redirect} />
      </div>
    </Column>
  );
}
