"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, signIn, signUp, updatePassword, updateProfile } from "@/app/actions/auth";
import { authInitialState, type AuthState } from "@/lib/form-state";
import { buttonClass, Field, inputClass } from "@/components/ui";
import { cn } from "@/lib/utils";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(buttonClass("primary"), "w-full")}>
      {pending ? "Un attimo…" : label}
    </button>
  );
}

function Feedback({ state }: { state: AuthState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-md border px-3 py-2 text-[0.85rem] leading-snug",
        state.status === "error" ? "border-danger/40 text-danger" : "border-accent/40 bg-accent-wash text-ink",
      )}
    >
      {state.message}
    </p>
  );
}

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useActionState(signIn, authInitialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo ?? "/area-riservata"} />

      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <Feedback state={state} />
      <Submit label="Accedi" />

      <div className="flex flex-wrap justify-between gap-2 text-[0.85rem] text-ink-2">
        <Link href="/recupera-password" className="link">
          Password dimenticata
        </Link>
        <Link href="/registrati" className="link">
          Crea un account
        </Link>
      </div>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, authInitialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Nome e cognome" htmlFor="full_name">
        <input id="full_name" name="full_name" type="text" required autoComplete="name" className={inputClass} />
      </Field>

      <Field label="Studio" htmlFor="studio" hint="Facoltativo. Ci serve solo per capire chi ci legge.">
        <input id="studio" name="studio" type="text" autoComplete="organization" className={inputClass} />
      </Field>

      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>

      <Field label="Password" htmlFor="password" hint="Almeno 8 caratteri.">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <label className="flex items-start gap-2.5 text-[0.82rem] leading-snug text-ink-2">
        <input type="checkbox" name="consenso" required className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]" />
        <span>
          Ho letto la{" "}
          <Link href="/privacy" className="link">
            privacy policy
          </Link>{" "}
          e acconsento al trattamento dei dati per l&apos;accesso all&apos;area riservata.
        </span>
      </label>

      <Feedback state={state} />
      <Submit label="Crea account" />

      <p className="text-[0.85rem] text-ink-2">
        Hai già un account?{" "}
        <Link href="/accedi" className="link">
          Accedi
        </Link>
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, formAction] = useActionState(requestPasswordReset, authInitialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Feedback state={state} />
      <Submit label="Inviami il link" />
      <p className="text-[0.85rem] text-ink-2">
        <Link href="/accedi" className="link">
          Torna all&apos;accesso
        </Link>
      </p>
    </form>
  );
}

export function ProfileForm({ fullName, studio }: { fullName: string; studio: string }) {
  const [state, formAction] = useActionState(updateProfile, authInitialState);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-5">
      <Field label="Nome e cognome" htmlFor="profile_name">
        <input
          id="profile_name"
          name="full_name"
          type="text"
          defaultValue={fullName}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label="Studio" htmlFor="profile_studio">
        <input
          id="profile_studio"
          name="studio"
          type="text"
          defaultValue={studio}
          autoComplete="organization"
          className={inputClass}
        />
      </Field>

      <Feedback state={state} />
      <Submit label="Salva" />
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, authInitialState);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-5">
      <Field label="Nuova password" htmlFor="password" hint="Almeno 8 caratteri.">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <Feedback state={state} />
      <Submit label="Aggiorna password" />
    </form>
  );
}
