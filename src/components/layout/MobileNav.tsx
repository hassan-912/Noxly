"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { locales, type Locale } from "@/content/types";
import { localizePath } from "@/lib/i18n";
import type { NavLink } from "./nav";

interface Props {
  locale: Locale;
  links: NavLink[];
  names: Record<Locale, string>;
  whatsappHref: string;
  labels: {
    open: string;
    close: string;
    nav: string;
    language: string;
    letsTalk: string;
    opensNewTab: string;
  };
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Phone/tablet navigation: a modal <dialog> sheet at the inline end. `showModal()` makes the
 * page inert; Tab and Shift+Tab are also wrapped inside the sheet; Escape (native cancel),
 * the close button, the backdrop, or following a link closes it, and focus returns to the
 * trigger. The page itself is never scroll-locked.
 */
export function MobileNav({ locale, links, names, whatsappHref, labels }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname() || `/${locale}/`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function open() {
    setHash(window.location.hash);
    dialogRef.current?.showModal();
    setExpanded(true);
  }

  function close() {
    dialogRef.current?.close();
  }

  function onClose() {
    setExpanded(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  /** A click on the ::backdrop targets the dialog element itself. */
  function onDialogClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) close();
  }

  const linkClass =
    "flex min-h-12 items-center rounded-lg px-3 text-lg font-medium text-ink hover:bg-frost";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={expanded}
        onClick={open}
        className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-frost"
      >
        <Menu aria-hidden className="size-5" />
        <span className="sr-only">{labels.open}</span>
      </button>
      <dialog
        ref={dialogRef}
        aria-label={labels.nav}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={onDialogClick}
        className="m-0 ms-auto h-dvh max-h-none w-[min(22rem,100%)] max-w-none border-0 border-s border-mist bg-surface p-0 text-ink backdrop:bg-ink/30"
      >
        <div className="flex h-full flex-col gap-8 overflow-y-auto p-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-frost"
            >
              <X aria-hidden className="size-5" />
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>
          <nav aria-label={labels.nav}>
            <ul className="grid gap-1">
              {links.map((link) => (
                <li key={link.id}>
                  <a href={link.href} onClick={close} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="px-3 font-mono text-xs uppercase tracking-wider text-ink-muted">{labels.language}</p>
            <ul className="mt-2 grid grid-cols-2 gap-1">
              {locales.map((l) => (
                <li key={l}>
                  <a
                    href={localizePath(pathname, l, hash)}
                    lang={l}
                    hrefLang={l}
                    aria-current={l === locale ? "true" : undefined}
                    className="flex min-h-11 items-center rounded-lg px-3 text-base text-ink hover:bg-frost aria-[current]:bg-frost aria-[current]:font-semibold"
                  >
                    {names[l]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-indigo px-5 font-medium text-surface hover:bg-ink"
          >
            {labels.letsTalk}
            <span className="sr-only"> {labels.opensNewTab}</span>
          </a>
        </div>
      </dialog>
    </>
  );
}
