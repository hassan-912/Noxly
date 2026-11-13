import type { Locale, StatusKey } from "@/content/types";
import { status as statusLabels } from "@/content/status";
import { cn } from "@/lib/cn";

/** The dot only supports the label; the meaning is always in the text. */
const dots: Record<StatusKey, string> = {
  "internal-tool": "bg-periwinkle",
  "public-site": "bg-teal",
  "in-development": "bg-indigo",
  "not-released": "bg-grey",
  "graduation-project": "bg-periwinkle",
  "team-project": "bg-periwinkle",
};

/** A project status as a quiet pill with a localized label. */
export function StatusPill({ status, locale, className }: { status: StatusKey; locale: Locale; className?: string }) {
  return (
    <span
      data-status={status}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-mist bg-surface px-2 py-0.5 text-xs leading-5 font-medium text-ink-muted",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dots[status])} />
      <span className="min-w-0 truncate">{statusLabels[status][locale]}</span>
    </span>
  );
}
