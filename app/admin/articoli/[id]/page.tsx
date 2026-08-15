import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Notice } from "@/components/ui";
import { DeletePostForm, PostEditor } from "@/components/admin/post-editor";
import { createClient } from "@/lib/supabase/server";
import type { Author, Category, Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminArticoloPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvato?: string }>;
}) {
  const { id } = await params;
  const { salvato } = await searchParams;

  const supabase = await createClient();
  if (!supabase) return null;

  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase.from("categories").select("*").order("position"),
    supabase.from("authors").select("*").order("name"),
  ]);

  let post: Post | null = null;
  if (id !== "nuovo") {
    const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    post = data as Post;
  }

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>
            <Link href="/admin/articoli" className="hover:text-ink">
              Articoli
            </Link>{" "}
            / {post ? "modifica" : "nuovo"}
          </Eyebrow>
          <h1 className="t-h2 mt-2">{post ? post.title : "Nuovo articolo"}</h1>
        </div>
        {post ? <DeletePostForm id={post.id} slug={post.slug} /> : null}
      </div>

      {salvato ? (
        <div className="mt-6">
          <Notice tone="success">Articolo creato. Ora puoi continuare a modificarlo qui.</Notice>
        </div>
      ) : null}

      <div className="mt-8">
        <PostEditor
          post={post}
          categories={(categories as Category[]) ?? []}
          authors={(authors as Author[]) ?? []}
        />
      </div>
    </Container>
  );
}
