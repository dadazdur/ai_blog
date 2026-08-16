"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { marked } from "marked";
import { deletePost, savePost } from "@/app/actions/admin";
import { adminInitialState } from "@/lib/form-state";
import { SeoCheck } from "@/components/admin/seo-check";
import { buttonClass, Field, inputClass } from "@/components/ui";
import type { Author, Category, Post } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";

const toolbar = [
  { label: "H2", before: "\n## ", after: "\n" },
  { label: "H3", before: "\n### ", after: "\n" },
  { label: "Grassetto", before: "**", after: "**" },
  { label: "Corsivo", before: "_", after: "_" },
  { label: "Link", before: "[", after: "](https://)" },
  { label: "Elenco", before: "\n- ", after: "" },
  { label: "Citazione", before: "\n> ", after: "\n" },
  { label: "Tabella", before: "\n| Voce | Valore |\n| --- | --- |\n| ", after: " |  |\n" },
  { label: "Blocco", before: "\n```\n", after: "\n```\n" },
];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "sm")}>
      {pending ? "Salvo…" : "Salva"}
    </button>
  );
}

export function PostEditor({
  post,
  categories,
  authors,
}: {
  post: Post | null;
  categories: Category[];
  authors: Author[];
}) {
  const [state, formAction] = useActionState(savePost, adminInitialState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content_md ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [keyword, setKeyword] = useState(post?.focus_keyword ?? "");
  const [preview, setPreview] = useState(false);

  const html = useMemo(() => (preview ? (marked.parse(content, { async: false }) as string) : ""), [preview, content]);

  const faqText = (post?.faq ?? [])
    .map((item) => `${item.question}\n${item.answer}`)
    .join("\n\n");

  function insert(before: string, after: string) {
    const field = textareaRef.current;
    if (!field) return;
    const { selectionStart, selectionEnd, value } = field;
    const selected = value.slice(selectionStart, selectionEnd);
    const next = `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`;
    setContent(next);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(selectionStart + before.length, selectionStart + before.length + selected.length);
    });
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <input type="hidden" name="id" value={post?.id ?? ""} />

      {/* ------------------------------------------------------------ Colonna testo */}
      <div className="flex min-w-0 flex-col gap-5">
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
            className={cn(inputClass, "text-xl")}
          />
        </Field>

        <Field label="Slug (URL)" htmlFor="slug" hint={`/blog/${slug || "…"}`}>
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

        <Field label="Sommario" htmlFor="excerpt" hint="Compare nelle liste del blog e nelle anteprime social.">
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            className={inputClass}
          />
        </Field>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2">
            <p className="ui text-[0.82rem] font-medium text-ink">Contenuto (Markdown)</p>
            <button
              type="button"
              onClick={() => setPreview((value) => !value)}
              className="ui text-[0.82rem] font-medium text-accent transition-colors hover:text-ink"
            >
              {preview ? "Torna a scrivere" : "Anteprima"}
            </button>
          </div>

          {!preview ? (
            <>
              <div className="flex flex-wrap gap-1 border-b border-rule py-2">
                {toolbar.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => insert(item.before, item.after)}
                    className="rounded border border-rule px-2 py-1 font-mono text-[0.7rem] text-ink-2 transition-colors hover:border-rule-strong hover:text-ink"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                id="content_md"
                name="content_md"
                rows={26}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className={cn(inputClass, "mt-3 min-h-[28rem] resize-y font-mono text-[0.85rem] leading-[1.7]")}
              />
            </>
          ) : (
            <div className="prose mt-5 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>

        <Field
          label="Domande frequenti"
          htmlFor="faq"
          hint="Una domanda per riga, la risposta nella riga successiva, blocchi separati da una riga vuota. Generano il markup FAQ nei risultati di ricerca."
        >
          <textarea id="faq" name="faq" rows={8} defaultValue={faqText} className={cn(inputClass, "font-mono text-[0.82rem]")} />
        </Field>
      </div>

      {/* --------------------------------------------------------- Colonna comandi */}
      <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
        <div className="rounded-md border border-rule bg-surface p-4">
          <div className="flex flex-col gap-4">
            <Field label="Stato" htmlFor="status">
              <select
                id="status"
                name="status"
                defaultValue={post?.status ?? "draft"}
                className={inputClass}
              >
                <option value="draft">Bozza</option>
                <option value="published">Pubblicato</option>
              </select>
            </Field>

            <Field label="Data di pubblicazione" htmlFor="published_at">
              <input
                id="published_at"
                name="published_at"
                type="date"
                defaultValue={(post?.published_at ?? "").slice(0, 10)}
                className={inputClass}
              />
            </Field>

            <Field label="Categoria" htmlFor="category_id">
              <select id="category_id" name="category_id" defaultValue={post?.category_id ?? ""} className={inputClass}>
                <option value="">— nessuna —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Autore" htmlFor="author_id">
              <select id="author_id" name="author_id" defaultValue={post?.author_id ?? ""} className={inputClass}>
                <option value="">— nessuno —</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-4">
              <SaveButton />
              {post ? (
                <Link href={`/blog/${post.slug}`} target="_blank" className={buttonClass("ghost", "sm")}>
                  Vedi
                </Link>
              ) : null}
            </div>

            {state.status !== "idle" && state.message ? (
              <p
                role="status"
                className={cn(
                  "rounded border px-3 py-2 text-[0.82rem]",
                  state.status === "error" ? "border-danger/40 text-danger" : "border-accent/40 bg-accent-wash text-ink",
                )}
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-4">
          <p className="ui text-[0.82rem] font-medium text-ink">Ricerca</p>

          <Field label="Keyword principale" htmlFor="focus_keyword">
            <input
              id="focus_keyword"
              name="focus_keyword"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="es. prompt per commercialisti"
              className={inputClass}
            />
          </Field>

          <Field label="Titolo SEO" htmlFor="seo_title" hint={`${(seoTitle || title).length} caratteri`}>
            <input
              id="seo_title"
              name="seo_title"
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder={title}
              className={inputClass}
            />
          </Field>

          <Field label="Meta description" htmlFor="seo_description" hint={`${seoDescription.length} caratteri`}>
            <textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Immagine di copertina (URL)" htmlFor="cover_url">
            <input id="cover_url" name="cover_url" defaultValue={post?.cover_url ?? ""} className={inputClass} />
          </Field>

          <Field label="Testo alternativo copertina" htmlFor="cover_alt">
            <input id="cover_alt" name="cover_alt" defaultValue={post?.cover_alt ?? ""} className={inputClass} />
          </Field>

          <Field label="Canonical" htmlFor="canonical_url" hint="Solo se l'articolo esiste già altrove.">
            <input id="canonical_url" name="canonical_url" defaultValue={post?.canonical_url ?? ""} className={inputClass} />
          </Field>

          <label className="flex items-center gap-2 text-[0.85rem] text-ink-2">
            <input
              type="checkbox"
              name="noindex"
              defaultChecked={post?.noindex ?? false}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Escludi dai motori di ricerca
          </label>
        </div>

        <SeoCheck
          title={title}
          slug={slug}
          seoTitle={seoTitle}
          seoDescription={seoDescription}
          keyword={keyword}
          content={content}
          excerpt={excerpt}
        />

        {post ? (
          <div className="rounded-md border border-danger/30 p-4">
            <p className="ui text-[0.85rem] font-semibold text-danger">Zona pericolosa</p>
            <p className="mt-2 text-[0.82rem] leading-snug text-ink-2">
              L&apos;eliminazione è definitiva e rimuove anche l&apos;URL dalla sitemap.
            </p>
          </div>
        ) : null}
      </aside>
    </form>
  );
}

export function DeletePostForm({ id, slug }: { id: string; slug: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="ui text-[0.82rem] font-medium text-danger transition-colors hover:text-ink">
        Elimina definitivamente
      </button>
    </form>
  );
}
