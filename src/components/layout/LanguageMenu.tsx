"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/content/types";
import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { FlagIcon } from "./FlagIcon";

interface Props {
  locale: Locale;
  /** "Language" — prefixes the button's accessible name. */
  label: string;
  /** Native language names, e.g. { de: "Deutsch" }. */
  names: Record<Locale, string>;
}

/**
 * WAI-ARIA menu button. Enter/Space/ArrowDown open on the first item, ArrowUp on the last;
 * arrows, Home and End move; Escape closes and returns focus; Tab closes. Each item is a real
 * link to the same page in that locale, keeping the current #hash.
 */
export function LanguageMenu({ locale, label, names }: Props) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname() || `/${locale}/`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusOnOpen = useRef<number | null>(null);
  const menuId = useId();

  function openMenu(focusIndex: number) {
    setHash(window.location.hash);
    focusOnOpen.current = focusIndex;
    setOpen(true);
  }

  function closeMenu(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    if (focusOnOpen.current !== null) {
      itemRefs.current[focusOnOpen.current]?.focus();
      focusOnOpen.current = null;
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(locales.length - 1);
    }
  }

  function onMenuKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    const last = locales.length - 1;
    const focus = (i: number) => itemRefs.current[i]?.focus();
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focus(current >= last ? 0 : current + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focus(current <= 0 ? last : current - 1);
        break;
      case "Home":
        e.preventDefault();
        focus(0);
        break;
      case "End":
        e.preventDefault();
        focus(last);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? closeMenu(false) : openMenu(0))}
        onKeyDown={onButtonKeyDown}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-frost hover:text-ink aria-expanded:bg-frost aria-expanded:text-ink"
      >
        <FlagIcon locale={locale} />
        <span className="sr-only">{label}: </span>
        <span lang={locale}>{names[locale]}</span>
        <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <ul
        id={menuId}
        role="menu"
        aria-label={label}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className="absolute end-0 top-full z-10 mt-2 min-w-44 rounded-xl border border-mist bg-surface p-1 shadow-[0_12px_32px_-12px_rgb(14_26_36/0.25)]"
      >
        {locales.map((l, i) => (
          <li key={l} role="none">
            <a
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="menuitem"
              tabIndex={-1}
              href={localizePath(pathname, l, hash)}
              lang={l}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              className="flex min-h-10 items-center justify-between gap-4 rounded-lg px-3 text-sm text-ink hover:bg-frost focus-visible:bg-frost aria-[current]:font-semibold"
            >
              <span className="flex items-center gap-2"><FlagIcon locale={l} />{names[l]}</span>
              {l === locale && <Check aria-hidden className="size-4 text-indigo" />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
