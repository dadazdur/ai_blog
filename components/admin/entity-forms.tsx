"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveAuthor, saveCategory } from "@/app/actions/admin";
import { adminInitialState } from "@/lib/form-state";
import { buttonClass, Field, inputClass } from "@/components/ui";
import type { Author, Category } from "@/lib/types";
import { cn } from "@/lib/utils";

function Save({ label = "Salva" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "sm")}>
      {pending ? "Salvo…" : label}
    </button>
  );
}

function Feedback({ status, message }: { status: string; message: string }) {
  if (status === "idle" || !message) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded border px-3 py-2 text-[0.82rem]",
        status === "error" ? "border-danger/40 text-danger" : "border-accent/40 bg-accent-wash text-ink",
      )}
    >
      {message}
    </p>
  );
}

export function AuthorForm({ author }: { author?: Author }) {
  const [state, formAction] = useActionState(saveAuthor, adminInitialState);
  const id = author?.id ?? "nuovo";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={author?.id ?? ""} />

      <Field label="Nome e cognome" htmlFor={`name-${id}`}>
        <input id={`name-${id}`} name="name" required defaultValue={author?.name ?? ""} className={inputClass} />
      </Field>

      <Field label="Slug" htmlFor={`slug-${id}`} hint="Lascia vuoto per generarlo dal nome.">
        <input
          id={`slug-${id}`}
          name="slug"
          defaultValue={author?.slug ?? ""}
          className={cn(inputClass, "font-mono text-[0.85rem]")}
        />
      </Field>

      <Field label="Qualifica" htmlFor={`role-${id}`} hint="Es. Dottore commercialista.">
        <input id={`role-${id}`} name="role_title" defaultValue={author?.role_title ?? ""} className={inputClass} />
      </Field>

      <Field label="Iscrizione all'Ordine" htmlFor={`cred-${id}`} hint="Compare nel markup delle credenziali.">
        <input id={`cred-${id}`} name="credentials" defaultValue={author?.credentials ?? ""} className={inputClass} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Biografia" htmlFor={`bio-${id}`} hint="Due o tre frasi: esperienza concreta, non elogi.">
          <textarea id={`bio-${id}`} name="bio" rows={4} defaultValue={author?.bio ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="LinkedIn" htmlFor={`linkedin-${id}`}>
        <input id={`linkedin-${id}`} name="linkedin_url" defaultValue={author?.linkedin_url ?? ""} className={inputClass} />
      </Field>

      <Field label="Email" htmlFor={`email-${id}`}>
        <input id={`email-${id}`} name="email" type="email" defaultValue={author?.email ?? ""} className={inputClass} />
      </Field>

      <Field label="Foto (URL)" htmlFor={`avatar-${id}`}>
        <input id={`avatar-${id}`} name="avatar_url" defaultValue={author?.avatar_url ?? ""} className={inputClass} />
      </Field>

      <div className="flex items-end gap-4 sm:col-span-2">
        <Save label={author ? "Aggiorna autore" : "Crea autore"} />
      </div>

      <div className="sm:col-span-2">
        <Feedback status={state.status} message={state.message} />
      </div>
    </form>
  );
}

export function CategoryForm({ category }: { category?: Category }) {
  const [state, formAction] = useActionState(saveCategory, adminInitialState);
  const id = category?.id ?? "nuova";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={category?.id ?? ""} />

      <Field label="Nome" htmlFor={`cat-name-${id}`}>
        <input id={`cat-name-${id}`} name="name" required defaultValue={category?.name ?? ""} className={inputClass} />
      </Field>

      <Field label="Slug" htmlFor={`cat-slug-${id}`}>
        <input
          id={`cat-slug-${id}`}
          name="slug"
          defaultValue={category?.slug ?? ""}
          className={cn(inputClass, "font-mono text-[0.85rem]")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field
          label="Descrizione"
          htmlFor={`cat-desc-${id}`}
          hint="Compare in cima all'archivio: è testo indicizzabile, non riempitivo."
        >
          <textarea
            id={`cat-desc-${id}`}
            name="description"
            rows={3}
            defaultValue={category?.description ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Titolo SEO" htmlFor={`cat-seo-title-${id}`}>
        <input id={`cat-seo-title-${id}`} name="seo_title" defaultValue={category?.seo_title ?? ""} className={inputClass} />
      </Field>

      <Field label="Ordine" htmlFor={`cat-pos-${id}`}>
        <input id={`cat-pos-${id}`} name="position" type="number" defaultValue={category?.position ?? 0} className={inputClass} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Meta description" htmlFor={`cat-seo-desc-${id}`}>
          <textarea
            id={`cat-seo-desc-${id}`}
            name="seo_description"
            rows={2}
            defaultValue={category?.seo_description ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex items-end gap-4 sm:col-span-2">
        <Save label={category ? "Aggiorna categoria" : "Crea categoria"} />
      </div>

      <div className="sm:col-span-2">
        <Feedback status={state.status} message={state.message} />
      </div>
    </form>
  );
}
