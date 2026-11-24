import { ArrowUpRight } from "lucide-react";
import type { NotesCopy } from "@/content/notes";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * The one strong-colour surface on the Notes pages.
 * `wide` is the band at the end of the index; the default is the article sidebar card.
 */
export function NotesContactCard({ locale, copy, wide = false, className }: { locale: Locale; copy: NotesCopy; wide?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-indigo text-white",
        wide ? "flex flex-col gap-8 p-8 sm:p-12 md:flex-row md:items-end md:justify-between" : "p-6",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <h2 className={cn("font-semibold tracking-tight", wide ? "text-3xl sm:text-4xl" : "text-xl leading-snug")}>{copy.contactTitle}</h2>
        <p className={cn("mt-3 text-white/80", wide ? "max-w-lg text-lg leading-relaxed" : "text-sm leading-relaxed")}>{copy.contactBody}</p>
      </div>
      <a
        href={`/${locale}/#contact`}
        className={cn(
          "group relative inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white font-semibold text-indigo transition-colors hover:bg-frost focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:self-auto",
          wide ? "px-6 py-3" : "mt-5 px-4 py-2 text-sm",
        )}
        data-contact-card
      >
        {copy.contactAction}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
      </a>
    </div>
  );
}
