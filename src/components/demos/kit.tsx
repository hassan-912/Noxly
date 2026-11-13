"use client";

import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";
import type { DemoId, Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { DemoLabel } from "./DemoLabel";

export { Tabs, TabPanel } from "@/components/ui/Tabs";

/** Props of every coded demo. All text comes from `getDictionary(locale).demos`. */
export type DemoProps = { locale: Locale };

/** Fills `{name}` placeholders of a dictionary string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Latin digits with thousands separators in every locale (identical on server and client). */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Latin data (amounts, codes, times, links) keeps its own direction inside RTL text. */
export function Ltr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}

/**
 * The frame shared by every demo: a quiet app bar (icon, product name, optional status) with the
 * demo label, and a frost body. The root is the size container the layouts respond to, so a
 * device frame of 390 / 768 / 960px+ reflows the demo (`@d1` 420px, `@d2` 760px, `@d3` 920px).
 */
export function DemoShell({
  id,
  locale,
  title,
  icon,
  aside,
  children,
}: {
  id: DemoId;
  locale: Locale;
  title: string;
  icon: ReactNode;
  /** A chip beside the title, e.g. a status or the sample case. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div data-demo={id} role="group" aria-label={title} className="demo @container">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-mist bg-surface px-3.5 py-3 @d1:px-4 @d2:px-5">
        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-lg bg-indigo/10 text-indigo [&>svg]:size-4"
        >
          {icon}
        </span>
        <p className="text-sm font-semibold">{title}</p>
        {aside}
        <DemoLabel locale={locale} className="ms-auto" />
      </div>
      <div className="p-3 @d1:p-4 @d2:p-5">{children}</div>
    </div>
  );
}

/** A white surface with a hairline border. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-mist bg-surface", className)}>{children}</div>;
}

/** Small uppercase-free label above a group of content. */
export function Kicker({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <p id={id} className={cn("demo-kicker text-ink-muted", className)}>
      {children}
    </p>
  );
}

const chipTones = {
  neutral: "bg-frost text-ink border-mist",
  positive: "bg-[#e2f4f1] text-ink border-[#c5e6e1]",
  warning: "bg-[#ffe8dc] text-ink border-[#f6cfba]",
  accent: "bg-[#ecedff] text-ink border-[#d6d8ff]",
  muted: "bg-surface text-ink-muted border-mist",
} as const;

const dotTones = {
  neutral: "bg-slate",
  positive: "bg-teal-text",
  warning: "bg-[#c2571f]",
  accent: "bg-indigo",
  muted: "bg-grey",
} as const;

export type ChipTone = keyof typeof chipTones;

/** A status chip. The meaning is always in the text; the colour and dot only support it. */
export function Chip({
  tone = "neutral",
  dot = true,
  className,
  children,
}: {
  tone?: ChipTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs leading-5 font-medium",
        chipTones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotTones[tone])} />}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

const buttonVariants = {
  primary: "bg-indigo text-surface shadow-[0_1px_2px_rgb(14_26_36/0.16)] hover:bg-[#434ae6]",
  secondary: "border border-mist bg-surface text-ink hover:border-slate hover:bg-frost",
  quiet: "text-ink-muted hover:bg-mist/40 hover:text-ink",
} as const;

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants; size?: "sm" | "md" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-medium transition-colors [&>svg]:size-3.5 [&>svg]:shrink-0",
        size === "md" ? "min-h-9 px-4 text-[0.8125rem]" : "min-h-8 px-3 text-xs",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/**
 * A native radio drawn as a selectable card or pill. The input stays in the DOM (visually
 * hidden), so arrow keys, focus and form semantics are the browser's own.
 */
export function Option({
  name,
  value,
  checked,
  onChange,
  disabled,
  shape = "card",
  className,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  shape?: "card" | "pill";
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex min-w-0 items-center border bg-surface transition-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo",
        shape === "card" ? "gap-3 rounded-xl px-3 py-2.5" : "min-h-9 justify-center gap-1.5 rounded-full px-3 py-1.5",
        checked ? "border-indigo bg-[#f1f1ff] shadow-[inset_0_0_0_1px_var(--color-indigo)]" : "border-mist",
        disabled ? "cursor-not-allowed bg-frost text-ink-muted" : "cursor-pointer",
        !disabled && !checked && "hover:border-slate",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="absolute inset-0 size-full cursor-[inherit] appearance-none opacity-0"
      />
      {shape === "pill" && checked && <Check aria-hidden="true" className="size-3.5 shrink-0 text-indigo" strokeWidth={3} />}
      {children}
      {shape === "card" && (
        <span
          aria-hidden="true"
          className={cn(
            "demo-option-check ms-auto grid size-4.5 shrink-0 place-items-center rounded-full border",
            checked ? "border-indigo bg-indigo text-surface" : "border-mist bg-surface text-transparent",
          )}
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </label>
  );
}

/** Numbered steps of a short flow. The current step is marked for assistive tech as well. */
export function Stepper({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  return (
    <ol aria-label={label} className="flex items-center gap-1.5 @d1:gap-2">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className={cn("flex min-w-0 items-center gap-1.5", active ? "shrink-0" : "shrink")}
          >
            {i > 0 && <span aria-hidden="true" className="h-px w-3 shrink-0 bg-mist @d1:w-5" />}
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full font-mono text-[0.6875rem] leading-none font-medium",
                active && "bg-indigo text-surface",
                done && "bg-[#e2f4f1] text-ink",
                !active && !done && "border border-mist bg-surface text-ink-muted",
              )}
            >
              {done ? <Check aria-hidden="true" className="size-3 text-teal-text" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                "truncate text-xs",
                active ? "font-semibold text-ink" : "text-ink-muted",
                !active && "sr-only @d1:not-sr-only",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Moves focus after the next render, for moments when the focused control disappears (the last
 * step of a flow, a link that has just been used). Returns a function taking the target's id.
 */
export function useFocusAfterUpdate(): (id: string) => void {
  const pending = useRef<string | null>(null);
  useEffect(() => {
    if (!pending.current) return;
    document.getElementById(pending.current)?.focus();
    pending.current = null;
  });
  return (id) => {
    pending.current = id;
  };
}

const QR_SIZE = 21;

/** Whether a module belongs to one of the three finder squares, and if so whether it is dark. */
function finder(x: number, y: number): boolean | null {
  for (const [ox, oy] of [
    [0, 0],
    [QR_SIZE - 7, 0],
    [0, QR_SIZE - 7],
  ]) {
    const dx = x - ox;
    const dy = y - oy;
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false; // quiet ring
      const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
      return ring !== 2;
    }
  }
  return null;
}

/**
 * A QR-looking pattern drawn from a seed. It is decoration: the modules are pseudo-random, so it
 * encodes nothing and does not scan.
 */
export function SampleQr({ seed, className }: { seed: number; className?: string }) {
  let state = seed * 2654435761;
  const cells: ReactNode[] = [];
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const dark = finder(x, y) ?? state / 4294967296 > 0.52;
      if (dark) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg
      data-qr
      aria-hidden="true"
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={cn("text-ink", className)}
    >
      {cells}
    </svg>
  );
}
