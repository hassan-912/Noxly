"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Its own module (re-exported by the demo kit) so a component can use the tabs without pulling
// in the demos' dictionaries.

/**
 * A segmented view switch with tab semantics: arrow keys (mirrored in RTL), Home and End move
 * and select; only the selected tab is in the tab order. Pair with `TabPanel` and the same `idBase`.
 */
export function Tabs<T extends string>({
  idBase,
  label,
  items,
  value,
  onChange,
  className,
}: {
  idBase: string;
  label: string;
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const index = items.findIndex((item) => item.id === value);
    let next = index;
    if (event.key === "ArrowRight") next = index + (rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") next = index + (rtl ? 1 : -1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    const target = items[(next + items.length) % items.length];
    onChange(target.id);
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${target.id}"]`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("flex max-w-full gap-0.5 rounded-[0.7rem] bg-mist/60 p-0.5", className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${idBase}-tab-${item.id}`}
            data-tab={item.id}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "min-h-8 min-w-0 flex-auto cursor-pointer rounded-[0.55rem] px-3 py-1.5 text-center text-[0.8125rem] leading-tight font-medium transition-colors",
              selected
                ? "bg-surface text-ink shadow-[0_1px_2px_rgb(14_26_36/0.14)]"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idBase,
  id,
  focusable = false,
  className,
  children,
}: {
  idBase: string;
  id: string;
  /** Set when the panel has no focusable content of its own. */
  focusable?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${id}`}
      aria-labelledby={`${idBase}-tab-${id}`}
      tabIndex={focusable ? 0 : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
