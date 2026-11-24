import type { Locale } from "@/content/types";
import type { Post } from "@/content/posts";
import { readTime } from "@/content/notes";
import { cn } from "@/lib/cn";
import { formatPostDate, readingMinutes } from "@/lib/posts";

function initials(name: string): string {
  return name.split(/\s+/u).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

type Props = {
  locale: Locale;
  post: Post;
  /** Show the date under the name (the index rows show it in their own column). */
  withDate?: boolean;
  month?: "short" | "long";
  className?: string;
};

/** Author monogram and name, with the date and reading time beneath. */
export function AuthorLine({ locale, post, withDate = true, month = "short", className }: Props) {
  const minutes = readTime(locale, readingMinutes(post.text[locale]));
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)} data-author-line>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo/10 text-[0.6875rem] font-semibold tracking-wide text-indigo ring-1 ring-indigo/15"
      >
        {initials(post.author)}
      </span>
      <div className="leading-snug">
        <p className="font-medium text-ink">{post.author}</p>
        <p className="text-ink-muted">
          {withDate && (
            <>
              <time dateTime={post.publishedAt}>{formatPostDate(locale, post.publishedAt, month)}</time>
              <span aria-hidden="true"> · </span>
            </>
          )}
          <span data-read-time>{minutes}</span>
        </p>
      </div>
    </div>
  );
}
