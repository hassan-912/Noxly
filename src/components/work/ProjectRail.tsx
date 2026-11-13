"use client";

import type { KeyboardEvent } from "react";
import type { Locale, ProjectSlug, StatusKey } from "@/content/types";
import { cn } from "@/lib/cn";
import { GlowSurface } from "@/components/ui/GlowSurface";
import { StatusPill } from "@/components/ui/StatusPill";

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
  locale,
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
      className="viewer-rail -mx-5 flex gap-2 overflow-x-auto px-5 pt-1 pb-6 -mb-5 sm:-mx-8 sm:px-8 md:mx-0 md:mb-0 md:grid md:grid-cols-3 md:overflow-visible md:p-0 lg:flex lg:flex-col lg:gap-1.5"
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
              "group flex w-[13.5rem] shrink-0 cursor-pointer flex-col items-start gap-2 rounded-2xl border p-4 text-start transition-[background-color,border-color,box-shadow] duration-300 md:w-auto",
              selected
                ? "border-mist bg-surface shadow-[0_1px_1px_rgb(14_26_36/0.04),0_14px_28px_-18px_rgb(14_26_36/0.28)]"
                : "border-transparent hover:border-mist/70 hover:bg-frost/70",
            )}
          >
            <span className="flex w-full items-center gap-2.5">
              <span
                className={cn(
                  "font-mono text-xs transition-colors duration-300",
                  selected ? "text-indigo" : "text-ink-muted",
                )}
              >
                {item.number}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "viewer-rail__rule h-px flex-1 transition-[background-color,scale] duration-500",
                  selected ? "scale-x-100 bg-indigo/45" : "scale-x-50 bg-mist",
                )}
              />
            </span>
            <span
              className={cn(
                "text-[0.9375rem] leading-snug font-medium text-pretty transition-colors duration-300",
                selected ? "text-ink" : "text-ink-muted group-hover:text-ink",
              )}
            >
              {item.name}
            </span>
            {item.status.map((key) => (
              <StatusPill key={key} status={key} locale={locale} className={selected ? undefined : "bg-transparent"} />
            ))}
          </GlowSurface>
        );
      })}
    </div>
  );
}
