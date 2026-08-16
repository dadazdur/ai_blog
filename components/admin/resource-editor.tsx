"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteResource, saveResource } from "@/app/actions/admin";
import { adminInitialState } from "@/lib/form-state";
import { buttonClass, Field, inputClass } from "@/components/ui";
import type { Resource } from "@/lib/types";
import { cn, formatBytes, slugify } from "@/lib/utils";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "sm")}>
      {pending ? "Carico…" : "Salva risorsa"}
    </button>
  );
}

export function ResourceEditor({ resource }: { resource: Resource | null }) {
  const [state, formAction] = useActionState(saveResource, adminInitialState);
  const [type, setType] = useState(resource?.type ?? "guida");
  const [title, setTitle] = useState(resource?.title ?? "");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(resource?.slug));

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      <input type="hidden" name="id" value={resource?.id ?? ""} />
      <input type="hidden" name="file_path" value={resource?.file_path ?? ""} />
      <input type="hidden" name="file_name" value={resource?.file_name ?? ""} />
      <input type="hidden" name="file_size" value={resource?.file_size ?? ""} />

      <Field label="Titolo" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          className={inputClass}
        />
      </Field>

      <Field label="Slug" htmlFor="slug" hint={`/area-riservata/${slug || "…"}`}>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          className={cn(inputClass, "font-mono text-[0.85rem]")}
        />
      </Field>

      <Field label="Descrizione" htmlFor="description">
        <textarea id="description" name="description" rows={3} defaultValue={resource?.description ?? ""} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tipo" htmlFor="type">
          <select
            id="type"
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as Resource["type"])}
            className={inputClass}
          >
            <option value="prompt">Prompt</option>
            <option value="template">Template</option>
            <option value="guida">Guida</option>
            <option value="video">Video</option>
          </select>
        </Field>

        <Field label="Ordine" htmlFor="position" hint="Numero più basso = più in alto nella lista.">
          <input id="position" name="position" type="number" defaultValue={resource?.position ?? 0} className={inputClass} />
        </Field>
      </div>

      {type === "prompt" ? (
        <Field label="Testo del prompt" htmlFor="prompt_text" hint="Viene mostrato nella pagina con il pulsante di copia.">
          <textarea
            id="prompt_text"
            name="prompt_text"
            rows={10}
            defaultValue={resource?.prompt_text ?? ""}
            className={cn(inputClass, "font-mono text-[0.82rem] leading-[1.7]")}
          />
        </Field>
      ) : (
        <input type="hidden" name="prompt_text" value={resource?.prompt_text ?? ""} />
      )}

      {type === "video" ? (
        <Field label="URL del video" htmlFor="external_url" hint="Link alla piattaforma di hosting del video.">
          <input id="external_url" name="external_url" defaultValue={resource?.external_url ?? ""} className={inputClass} />
        </Field>
      ) : (
        <input type="hidden" name="external_url" value={resource?.external_url ?? ""} />
      )}

      <Field
        label="File da scaricare"
        htmlFor="file"
        hint={
          resource?.file_name
            ? `File attuale: ${resource.file_name} (${formatBytes(resource.file_size)}). Caricane uno nuovo per sostituirlo.`
            : "PDF, Word, Excel. Massimo 15 MB. Il file resta in uno spazio privato: si scarica solo con link temporaneo."
        }
      >
        <input
          id="file"
          name="file"
          type="file"
          className="block w-full text-[0.85rem] text-ink-2 file:mr-3 file:rounded-full file:border file:border-rule file:bg-surface file:px-4 file:py-2 file:text-[0.8rem] file:text-ink hover:file:border-rule-strong"
        />
      </Field>

      <label className="flex items-center gap-2 text-[0.9rem] text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={resource ? resource.published : true}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Visibile nell&apos;area riservata
      </label>

      {state.status !== "idle" && state.message ? (
        <p
          role="status"
          className={cn(
            "rounded border px-3 py-2 text-[0.85rem]",
            state.status === "error" ? "border-danger/40 text-danger" : "border-accent/40 bg-accent-wash text-ink",
          )}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center gap-4 border-t border-rule pt-5">
        <SaveButton />
      </div>
    </form>
  );
}

export function DeleteResourceForm({ id, filePath }: { id: string; filePath: string | null }) {
  return (
    <form action={deleteResource}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="file_path" value={filePath ?? ""} />
      <button type="submit" className="ui text-[0.82rem] font-medium text-danger transition-colors hover:text-ink">
        Elimina risorsa
      </button>
    </form>
  );
}
