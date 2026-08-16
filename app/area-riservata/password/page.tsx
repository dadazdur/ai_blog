import { Container } from "@/components/ui";
import { UpdatePasswordForm } from "@/components/auth-forms";

export const dynamic = "force-dynamic";

export default function CambiaPasswordPage() {
  return (
    <Container className="max-w-xl py-12 sm:py-16">
      <h1 className="t-h1 mt-4">Scegli una nuova password</h1>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
        Dopo il salvataggio resti connesso su questo dispositivo.
      </p>
      <div className="mt-8">
        <UpdatePasswordForm />
      </div>
    </Container>
  );
}
