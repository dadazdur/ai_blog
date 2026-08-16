import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn, formatDate, openingParagraphs } from "@/lib/utils";

/** Riga di metadati: data, categoria, tempo di lettura. Una sola riga, sempre nello stesso ordine. */
function MetaLine({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={cn("meta flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
      {post.category ? (
        <>
          <span aria-hidden="true" className="text-ink-3">
            ·
          </span>
          <span className="text-accent">{post.category.name}</span>
        </>
      ) : null}
      <span aria-hidden="true" className="text-ink-3">
        ·
      </span>
      <span>{post.reading_minutes} min di lettura</span>
    </p>
  );
}

/**
 * L'articolo in testata: la prima schermata è questo, a piena larghezza,
 * come testo. Non è una card e non ha un contenitore.
 */
export function LeadArticle({ post }: { post: Post }) {
  const opening = openingParagraphs(post.content_md, 2);

  return (
    <article className="lede">
      <MetaLine post={post} />

      <h1 className="t-display mt-4 max-w-[22ch]">
        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
          {post.title}
        </Link>
      </h1>

      {post.excerpt ? <p className="t-deck mt-5 max-w-[46ch]">{post.excerpt}</p> : null}

      <div className="mt-6 max-w-[58ch]">
        {post.author ? (
          <p className="ui text-[0.9rem] text-ink-2">
            <Link href={`/autori/${post.author.slug}`} className="transition-colors hover:text-ink">
              di {post.author.name}
            </Link>
          </p>
        ) : null}

        {/* Le prime righe vere: si legge già mentre si decide se continuare. */}
        {opening.map((paragraph, index) => (
          <p key={index} className="mt-4 text-[1.08rem] leading-[1.65] text-ink">
            {paragraph}
          </p>
        ))}

        <p className="ui mt-5 text-[0.92rem]">
          <Link href={`/blog/${post.slug}`} className="link font-medium">
            Continua a leggere
          </Link>
        </p>
      </div>
    </article>
  );
}

/** Voce dell'indice: separata da un filetto, mai racchiusa in un riquadro. */
export function ArticleRow({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <article className="group relative border-t border-rule py-7">
      <MetaLine post={post} />

      <h3
        className={cn(
          "mt-2.5 font-semibold tracking-[-0.02em]",
          compact ? "text-[1.1rem] leading-[1.3]" : "text-[1.35rem] leading-[1.25]",
        )}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
        >
          {post.title}
        </Link>
      </h3>

      {post.excerpt && !compact ? (
        <p className="mt-2.5 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">{post.excerpt}</p>
      ) : null}

      {post.author && !compact ? <p className="meta-sm mt-3">di {post.author.name}</p> : null}
    </article>
  );
}
