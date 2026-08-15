import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const Heading = priority ? "h2" : "h3";

  return (
    <article className="group relative flex flex-col gap-3 border-t border-rule pt-5">
      <div className="flex items-center gap-3">
        {post.category ? <p className="t-label text-accent">{post.category.name}</p> : null}
        <span className="t-meta">{post.reading_minutes} min</span>
      </div>

      <Heading className="text-[1.28rem] leading-[1.25] text-balance">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </Heading>

      {post.excerpt ? (
        <p className="text-[0.93rem] leading-relaxed text-ink-soft text-pretty">{post.excerpt}</p>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-2">
        <time className="t-meta" dateTime={post.published_at ?? post.created_at}>
          {formatDate(post.published_at ?? post.created_at)}
        </time>
        {post.author ? <span className="t-meta">· {post.author.name}</span> : null}
      </div>

      <span
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full"
      />
    </article>
  );
}

/** Riga compatta usata negli elenchi lunghi: il registro, una voce per riga. */
export function PostRow({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-2 border-b border-rule py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
      <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1">
        <time className="t-meta" dateTime={post.published_at ?? post.created_at}>
          {formatDate(post.published_at ?? post.created_at)}
        </time>
        {post.category ? <p className="t-label text-accent">{post.category.name}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[1.22rem] leading-[1.28]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="max-w-2xl text-[0.93rem] leading-relaxed text-ink-soft text-pretty">{post.excerpt}</p>
        ) : null}
        <p className="t-meta">
          {post.author?.name ? `${post.author.name} · ` : ""}
          {post.reading_minutes} minuti di lettura
        </p>
      </div>
    </article>
  );
}
