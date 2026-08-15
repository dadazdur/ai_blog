import Link from "next/link";
import type { Author } from "@/lib/types";

export function AuthorBox({ author }: { author: Author }) {
  return (
    <aside className="rounded-lg border border-rule bg-surface p-6">
      <p className="t-label">Chi ha scritto questo articolo</p>
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="font-display text-[1.2rem] leading-tight text-ink">
            <Link href={`/autori/${author.slug}`} className="link-underline">
              {author.name}
            </Link>
          </p>
          {author.role_title ? <p className="t-meta mt-1">{author.role_title}</p> : null}
        </div>

        {author.bio ? <p className="text-[0.9rem] leading-relaxed text-ink-soft">{author.bio}</p> : null}

        {author.credentials ? (
          <p className="border-t border-rule pt-3 text-[0.8rem] leading-snug text-ink-faint">
            {author.credentials}
          </p>
        ) : null}

        {author.linkedin_url ? (
          <a
            href={author.linkedin_url}
            target="_blank"
            rel="noopener"
            className="text-[0.85rem] text-accent link-underline self-start"
          >
            Profilo LinkedIn
          </a>
        ) : null}
      </div>
    </aside>
  );
}
