/**
 * Popola il database con i contenuti dimostrativi.
 *
 *   npm run db:seed
 *
 * Richiede NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env.local.
 * È idempotente: rilanciarlo aggiorna i record esistenti invece di duplicarli.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { demoAuthors, demoCategories, demoPosts, demoResources } from "../lib/demo-content";

// Carica .env.local senza dipendenze aggiuntive.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // il file può non esistere
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const authors = demoAuthors.map(({ id, slug, name, role_title, bio, credentials, linkedin_url, email }) => ({
    id,
    slug,
    name,
    role_title,
    bio,
    credentials,
    linkedin_url,
    email,
  }));

  const categories = demoCategories.map((category, index) => ({ ...category, position: index }));

  const posts = demoPosts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content_md: post.content_md,
    category_id: post.category_id,
    author_id: post.author_id,
    status: post.status,
    published_at: post.published_at,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    focus_keyword: post.focus_keyword,
    faq: post.faq,
    reading_minutes: post.reading_minutes,
  }));

  const resources = demoResources.map((resource, index) => ({
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    description: resource.description,
    type: resource.type,
    prompt_text: resource.prompt_text,
    external_url: resource.external_url,
    // I file veri vanno caricati dal pannello admin: qui restano i soli metadati.
    file_name: resource.file_name,
    file_size: resource.file_size,
    published: resource.published,
    position: index,
  }));

  // L'ordine conta: articoli e risorse referenziano autori e categorie.
  const results = [
    { label: "autori", result: await supabase.from("authors").upsert(authors, { onConflict: "id" }) },
    { label: "categorie", result: await supabase.from("categories").upsert(categories, { onConflict: "id" }) },
    { label: "articoli", result: await supabase.from("posts").upsert(posts, { onConflict: "id" }) },
    { label: "risorse", result: await supabase.from("resources").upsert(resources, { onConflict: "id" }) },
  ];

  for (const { label, result } of results) {
    if (result.error) {
      console.error(`✗ ${label}: ${result.error.message}`);
      process.exit(1);
    }
    console.log(`✓ ${label}`);
  }

  console.log("\nContenuti dimostrativi caricati. Ricordati di:");
  console.log("  1. promuovere il tuo utente ad admin (vedi README)");
  console.log("  2. caricare i file veri dal pannello /admin/risorse");
}

main();
