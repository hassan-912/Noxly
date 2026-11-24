"use client";

import type { KeyboardEvent } from "react";
import type { Locale, ProjectSlug, StatusKey } from "@/content/types";
import { cn } from "@/lib/cn";
import { GlowSurface } from "@/components/ui/GlowSurface";

export type RailItem = {
  slug: ProjectSlug;
  /** Two-digit position, e.g. "02". Latin digits in every locale. */
  number: string;
  name: string;
  status: StatusKey[];
};

export const tabId = (idBase: string, slug: string) => `${idBase}-tab-${slug}`;
export const panelId = (idBase: string) => `${idBase}-panel`;

/**
 * The project rail: a tablist of number, name and status. A horizontal, scrollable strip on
 * phones, three columns on tablets, a vertical rail at the start side from `lg`. Arrow keys
 * move and select (left/right mirrored in RTL), with Home and End; only the selected tab is in
 * the tab order.
 */
export function ProjectRail({
  idBase,
  label,
  items,
  active,
  onSelect,
}: {
  idBase: string;
  label: string;
  locale: Locale;
  items: RailItem[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    let next = active;
    if (event.key === "ArrowRight") next = active + (rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") next = active + (rtl ? 1 : -1);
    else if (event.key === "ArrowDown") next = active + 1;
    else if (event.key === "ArrowUp") next = active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    next = (next + items.length) % items.length;
    onSelect(next);
    const tab = document.getElementById(tabId(idBase, items[next].slug));
    tab?.focus({ preventScroll: true });
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="viewer-rail flex min-w-0 gap-1 overflow-x-auto px-1 pt-1"
    >
      {items.map((item, i) => {
        const selected = i === active;
        return (
          <GlowSurface
            as="button"
            key={item.slug}
            type="button"
            role="tab"
            id={tabId(idBase, item.slug)}
            aria-selected={selected}
            aria-controls={panelId(idBase)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i)}
            className={cn(
              "group flex min-h-12 shrink-0 cursor-pointer items-center gap-3 rounded-t-xl border border-b-0 px-5 py-3 text-start transition-colors",
              selected
                ? "border-mist bg-frost"
                : "border-transparent hover:border-mist/70 hover:bg-frost/70",
            )}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "font-mono text-xs transition-colors duration-300",
                  selected ? "text-indigo" : "text-ink-muted",
                )}
              >
                {item.number}
              </span>
            </span>
            <span
              className={cn(
                "text-[0.9375rem] leading-snug font-medium text-pretty transition-colors duration-300",
                selected ? "text-ink" : "text-ink-muted group-hover:text-ink",
              )}
            >
              {item.name}
            </span>
          </GlowSurface>
        );
      })}
    </div>
  );
}
