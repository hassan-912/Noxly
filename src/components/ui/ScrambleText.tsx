"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { scrambleFrame, useMotionOK } from "@/lib/motion";

/** Scrambled glyphs change this often; slower than the frame rate so it reads as calm, not noisy. */
const FRAME_MS = 45;

type Props = {
  text: string;
  as?: ElementType;
  /** The scramble only ever runs once per mount. */
  once?: true;
  durationMs?: number;
  /** Wait before scrambling, e.g. until a reveal has brought the text on screen. */
  delayMs?: number;
  className?: string;
};

/**
 * Renders `text` as-is in the HTML. After mount, when motion is allowed, it scrambles once and
 * resolves to `text` in logical order. The width is locked while it runs so nothing reflows.
 */
export function ScrambleText({ text, as: Tag = "span", durationMs = 600, delayMs = 0, className }: Props) {
  const ok = useMotionOK();
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const [frame, setFrame] = useState<{ text: string; inlineSize: number } | null>(null);

  useEffect(() => {
    if (!ok || played.current) return;
    let raf = 0;
    let startedAt = 0;
    let lastFrameAt = -Infinity;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = (now - startedAt) / durationMs;
      if (progress >= 1) {
        played.current = true;
        setFrame(null);
        return;
      }
      if (now - lastFrameAt >= FRAME_MS) {
        lastFrameAt = now;
        const inlineSize = ref.current?.getBoundingClientRect().width ?? 0;
        setFrame((prev) => ({
          text: scrambleFrame(text, progress, Math.random),
          inlineSize: prev?.inlineSize ?? inlineSize,
        }));
      }
      raf = requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      setFrame(null);
    };
  }, [ok, text, durationMs, delayMs]);

  const lock: CSSProperties | undefined =
    frame && frame.inlineSize > 0
      ? { display: "inline-block", inlineSize: frame.inlineSize, whiteSpace: "nowrap" }
      : undefined;

  return (
    <Tag ref={ref} className={className} style={lock} data-scrambling={frame ? "true" : undefined}>
      {frame ? frame.text : text}
    </Tag>
  );
}
