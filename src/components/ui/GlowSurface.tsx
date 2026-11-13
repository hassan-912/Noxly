"use client";

import type { ComponentPropsWithRef, ElementType, PointerEvent } from "react";
import { cn } from "@/lib/cn";

type Props<T extends ElementType> = { as?: T } & Omit<ComponentPropsWithRef<T>, "as">;

/**
 * A surface with a soft highlight (styles: `.glow-surface` in globals.css).
 * - Fine pointers: the glow follows the cursor.
 * - Keyboard: the same highlight, centred, on `:focus-visible` (the focus ring stays).
 * - Touch: the same highlight while pressed (`:active`).
 * Under reduced motion there is no glow at all. It is decoration only: it sits behind the
 * content and carries no meaning.
 */
export function GlowSurface<T extends ElementType = "div">({ as, className, onPointerMove, ...rest }: Props<T>) {
  const Tag: ElementType = as ?? "div";

  const track = (event: PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
  };

  return <Tag {...rest} data-glow="" className={cn("glow-surface", className)} onPointerMove={track} />;
}
