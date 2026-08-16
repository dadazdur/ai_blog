import Link from "next/link";
import type { Author } from "@/lib/types";

export function AuthorBox({ author }: { author: Author }) {
  return (
    <aside className="border-t border-rule pt-6">
      <p className="text-[1.05rem] font-semibold tracking-[-0.015em]">
        <Link href={`/autori/${author.slug}`} className="link">
          {author.name}
        </Link>
      </p>
      {author.role_title ? <p className="meta mt-1">{author.role_title}</p> : null}

      {author.bio ? (
        <p className="mt-3 max-w-[60ch] text-[0.95rem] leading-relaxed text-ink-2">{author.bio}</p>
      ) : null}

      {author.linkedin_url ? (
        <a
          href={author.linkedin_url}
          target="_blank"
          rel="noopener"
          className="ui link mt-3 inline-block text-[0.88rem]"
        >
          Profilo LinkedIn
        </a>
      ) : null}
    </aside>
  );
}
