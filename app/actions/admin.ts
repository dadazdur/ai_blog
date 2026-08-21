"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, requireAdmin } from "@/lib/supabase/server";
import { RESOURCES_BUCKET } from "@/lib/supabase/config";
import { readingMinutes, slugify } from "@/lib/utils";
import type { FaqItem } from "@/lib/types";
import type { AdminState } from "@/lib/form-state";

const DENIED: AdminState = { status: "error", message: "Servono i permessi di amministratore." };

async function adminClient() {
  const profile = await requireAdmin();
  if (!profile) return null;
  return createClient();
}

/** Rigenera le pagine pubbliche toccate da un articolo. */
function revalidatePost(slug?: string | null, categorySlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
  if (categorySlug) revalidatePath(`/blog/categoria/${categorySlug}`);
}

function parseFaq(raw: string): FaqItem[] | null {
  const blocks = raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const items = blocks
    .map((block) => {
      const [question, ...rest] = block.split("\n");
      const answer = rest.join(" ").trim();
      if (!question || !answer) return null;
      return { question: question.replace(/^[-*]\s*/, "").trim(), answer };
    })
    .filter((item): item is FaqItem => item !== null);

  return items.length ? items : null;
}

// ---------------------------------------------------------------------------
// Articoli
// ---------------------------------------------------------------------------

export async function savePost(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const supabase = await adminClient();
  if (!supabase) return DENIED;

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const contentMd = String(formData.get("content_md") ?? "");
  const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";
  const slug = slugify(String(formData.get("slug") ?? "") || title);

  if (!title) return { status: "error", message: "Il titolo è obbligatorio." };
  if (!slug) return { status: "error", message: "Serve uno slug valido: controlla il titolo." };

  const publishedAtRaw = String(formData.get("published_at") ?? "").trim();
  const faqRaw = String(formData.get("faq") ?? "").trim();

  const payload = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content_md: contentMd,
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    cover_alt: String(formData.get("cover_alt") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    author_id: String(formData.get("author_id") ?? "") || null,
    status,
    published_at:
      status === "published" ? (publishedAtRaw ? new Date(publishedAtRaw).toISOString() : new Date().toISOString()) : null,
    seo_title: String(formData.get("seo_title") ?? "").trim() || null,
    seo_description: String(formData.get("seo_description") ?? "").trim() || null,
    focus_keyword: String(formData.get("focus_keyword") ?? "").trim() || null,
    canonical_url: String(formData.get("canonical_url") ?? "").trim() || null,
    noindex: formData.get("noindex") === "on",
    faq: faqRaw ? parseFaq(faqRaw) : null,
    reading_minutes: readingMinutes(contentMd),
  };

  const query = id
    ? supabase.from("posts").update(payload).eq("id", id).select("slug").maybeSingle()
    : supabase.from("posts").insert(payload).select("id, slug").maybeSingle();

  const { data, error } = await query;

  if (error) {
    const message = error.message.includes("duplicate")
      ? "Esiste già un articolo con questo slug: cambialo."
      : "Salvataggio non riuscito. Controlla i campi e riprova.";
    return { status: "error", message };
  }

  revalidatePost(payload.slug);
  revalidatePath("/admin/articoli");

  if (!id && data && "id" in data) redirect(`/admin/articoli/${data.id}?salvato=1`);

  return { status: "success", message: status === "published" ? "Articolo pubblicato." : "Bozza salvata." };
}

export async function deletePost(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  await supabase.from("posts").delete().eq("id", id);

  revalidatePost(slug);
  revalidatePath("/admin/articoli");
  redirect("/admin/articoli");
}

// ---------------------------------------------------------------------------
// Risorse
// ---------------------------------------------------------------------------

export async function saveResource(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const supabase = await adminClient();
  if (!supabase) return DENIED;

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { status: "error", message: "Il titolo è obbligatorio." };

  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const file = formData.get("file");

  let filePath = String(formData.get("file_path") ?? "").trim() || null;
  let fileName = String(formData.get("file_name") ?? "").trim() || null;
  let fileSize = Number(formData.get("file_size") ?? 0) || null;

  if (file instanceof File && file.size > 0) {
    const safeName = slugify(file.name.replace(/\.[^.]+$/, ""));
    const extension = file.name.split(".").pop() ?? "bin";
    const path = `${slug}/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(RESOURCES_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type || undefined });

    if (uploadError) {
      return { status: "error", message: `Caricamento del file non riuscito: ${uploadError.message}` };
    }

    // Il file precedente non serve più: liberiamo lo spazio.
    if (filePath && filePath !== path) {
      await supabase.storage.from(RESOURCES_BUCKET).remove([filePath]);
    }

    filePath = path;
    fileName = file.name;
    fileSize = file.size;
  }

  const payload = {
    slug,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    type: String(formData.get("type") ?? "guida"),
    prompt_text: String(formData.get("prompt_text") ?? "").trim() || null,
    external_url: String(formData.get("external_url") ?? "").trim() || null,
    file_path: filePath,
    file_name: fileName,
    file_size: fileSize,
    published: formData.get("published") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
  };

  const { data, error } = id
    ? await supabase.from("resources").update(payload).eq("id", id).select("id").maybeSingle()
    : await supabase.from("resources").insert(payload).select("id").maybeSingle();

  if (error) {
    const message = error.message.includes("duplicate")
      ? "Esiste già una risorsa con questo slug."
      : "Salvataggio non riuscito.";
    return { status: "error", message };
  }

  revalidatePath("/admin/risorse");
  revalidatePath("/risorse");
  revalidatePath("/area-riservata");

  if (!id && data?.id) redirect(`/admin/risorse/${data.id}?salvato=1`);

  return { status: "success", message: "Risorsa salvata." };
}

export async function deleteResource(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const filePath = String(formData.get("file_path") ?? "");

  if (filePath) await supabase.storage.from(RESOURCES_BUCKET).remove([filePath]);
  await supabase.from("resources").delete().eq("id", id);

  revalidatePath("/admin/risorse");
  revalidatePath("/risorse");
  redirect("/admin/risorse");
}

// ---------------------------------------------------------------------------
// Autori e categorie
// ---------------------------------------------------------------------------

export async function saveAuthor(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const supabase = await adminClient();
  if (!supabase) return DENIED;

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { status: "error", message: "Il nome è obbligatorio." };

  const payload = {
    slug: slugify(String(formData.get("slug") ?? "") || name),
    name,
    role_title: String(formData.get("role_title") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    credentials: String(formData.get("credentials") ?? "").trim() || null,
    avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
  };

  const { error } = id
    ? await supabase.from("authors").update(payload).eq("id", id)
    : await supabase.from("authors").insert(payload);

  if (error) return { status: "error", message: "Salvataggio non riuscito: lo slug potrebbe essere già in uso." };

  revalidatePath("/admin/autori");
  revalidatePath("/chi-siamo");
  revalidatePath(`/autori/${payload.slug}`);
  return { status: "success", message: "Autore salvato." };
}

export async function saveCategory(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const supabase = await adminClient();
  if (!supabase) return DENIED;

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { status: "error", message: "Il nome è obbligatorio." };

  const payload = {
    slug: slugify(String(formData.get("slug") ?? "") || name),
    name,
    description: String(formData.get("description") ?? "").trim() || null,
    seo_title: String(formData.get("seo_title") ?? "").trim() || null,
    seo_description: String(formData.get("seo_description") ?? "").trim() || null,
    position: Number(formData.get("position") ?? 0) || 0,
  };

  const { error } = id
    ? await supabase.from("categories").update(payload).eq("id", id)
    : await supabase.from("categories").insert(payload);

  if (error) return { status: "error", message: "Salvataggio non riuscito: lo slug potrebbe essere già in uso." };

  revalidatePath("/admin/autori");
  revalidatePath("/blog");
  revalidatePath(`/blog/categoria/${payload.slug}`);
  return { status: "success", message: "Categoria salvata." };
}

// ---------------------------------------------------------------------------
// Iscritti
// ---------------------------------------------------------------------------

export async function confirmSubscriber(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;

  await supabase
    .from("newsletter_subscribers")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", String(formData.get("id") ?? ""));

  revalidatePath("/admin/iscritti");
}

export async function removeSubscriber(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;

  await supabase.from("newsletter_subscribers").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/iscritti");
}
