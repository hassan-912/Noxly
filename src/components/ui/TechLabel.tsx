import * as simpleIcons from "simple-icons";
import * as lucide from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { TechId } from "@/content/types";
import { tech } from "@/content/tech";
import { cn } from "@/lib/cn";

type SimpleIcon = { slug: string; path: string };

const simpleBySlug = new Map(
  (Object.values(simpleIcons) as SimpleIcon[]).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon]),
);

/**
 * The icon of a technology alone, decorative (aria-hidden): always pair it with the name nearby.
 * Renders nothing when there is no glyph. Server component only, like `TechLabel`.
 */
export function TechIcon({ id, className }: { id: TechId; className?: string }) {
  const item = tech[id];
  if (!item) throw new Error(`Unknown tech: ${id}`);
  const brand = item.simpleIcon ? simpleBySlug.get(item.simpleIcon) : undefined;
  const Glyph = item.lucide
    ? (lucide as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[item.lucide]
    : undefined;
  if (brand) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={brand.path} />
      </svg>
    );
  }
  return Glyph ? <Glyph aria-hidden="true" strokeWidth={1.75} className={className} /> : null;
}

/**
 * A technology as its icon plus its readable name (never an icon alone). Latin in every locale.
 *
 * Server component only: it looks icons up by name in the whole Simple Icons and Lucide sets,
 * which must stay out of the client bundle. Client components receive it as rendered children.
 */
export function TechLabel({ id, className }: { id: TechId; className?: string }) {
  const item = tech[id];
  if (!item) throw new Error(`Unknown tech: ${id}`);

  return (
    <span
      data-tech={id}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-mist bg-surface py-1 ps-2 pe-2.5 text-[0.8125rem] leading-5 text-ink",
        className,
      )}
    >
      <TechIcon id={id} className="size-3.5 shrink-0 text-slate" />
      <bdi dir="ltr" className="min-w-0 truncate">
        {item.name}
      </bdi>
    </span>
  );
}

/** The GitHub mark (Lucide ships no brand icons). Server component only, like `TechLabel`. */
export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={simpleBySlug.get("github")!.path} />
    </svg>
  );
}
