import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** The "Illustrative demo · sample data" marker every coded demo carries (localized). */
export function DemoLabel({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p data-demo-label className={cn("demo-kicker inline-flex items-center gap-1.5 text-ink-muted", className)}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-teal" />
      {getDictionary(locale).demos.label}
    </p>
  );
}
