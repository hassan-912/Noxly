"use client";

import type { CSSProperties } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { useImageFailed } from "@/lib/use-image-failed";
import { useMotionOK } from "@/lib/motion";

/** One real screenshot in the composition, labelled with its project's name. */
export type HeroScreen = {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** The settle finishes after this share of the first viewport has been scrolled. */
const SETTLE_VIEWPORTS = 0.55;

/**
 * Where each screen sits (design px; Tailwind spacing inside the stage is in the same unit) and
 * how it settles: start offset (inline axis mirrored in RTL) and start → settled rotation (deg).
 * Back to front: three desktop captures — a large one at the top end, one at the bottom start,
 * and a smaller one in front at the bottom end.
 */
const layout = [
  { className: "end-0 top-0 z-10 w-116", pose: { x: 16, y: -12, from: 2.6, to: 1.1 } },
  { className: "start-0 top-58 z-20 w-84", pose: { x: -22, y: 26, from: -4.2, to: -1.8 } },
  { className: "end-2 top-70 z-30 w-68", pose: { x: 14, y: 30, from: 4.4, to: 1.9 } },
];

/**
 * Real screenshots of the public pages of Hassan's live projects, layered at the end side of
 * the hero. They start slightly fanned out and settle into a tight stack while the first
 * viewport is scrolled: `--p` (0 → 1) drives the transforms in CSS (`.hero-screen`), which also
 * mirrors them in RTL and pins `--p` to 1 under reduced motion. A screenshot that fails to load
 * is left out rather than shown broken.
 */
export function HeroComposition({
  screens,
  caption,
  className,
}: {
  /** Back to front; up to three. */
  screens: HeroScreen[];
  caption: string;
  className?: string;
}) {
  const ok = useMotionOK();
  const { scrollY } = useScroll();
  const settle = useTransform(scrollY, (y) => {
    if (typeof window === "undefined") return 0;
    return Math.min(Math.max(y / (window.innerHeight * SETTLE_VIEWPORTS), 0), 1);
  });
  const progress = useSpring(settle, { stiffness: 140, damping: 28, mass: 0.6 });

  return (
    <figure data-hero-composition="" className={cn("hero-comp", className)}>
      <motion.div
        className="hero-comp__stage"
        style={ok ? ({ "--p": progress } as unknown as CSSProperties) : undefined}
      >
        {screens.slice(0, layout.length).map((screen, i) => (
          <Screen key={screen.src} screen={screen} {...layout[i]} />
        ))}
      </motion.div>
      <figcaption className="hero-comp__caption">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-teal" />
        {caption}
      </figcaption>
    </figure>
  );
}

function Screen({
  screen,
  pose,
  className,
}: {
  screen: HeroScreen;
  pose: { x: number; y: number; from: number; to: number };
  className: string;
}) {
  const { failed, imgProps } = useImageFailed(screen.src);
  if (failed) return null;
  return (
    <figure
      data-hero-screen=""
      className={cn("hero-screen", className)}
      style={{ "--x": pose.x, "--y": pose.y, "--r0": pose.from, "--r1": pose.to } as CSSProperties}
    >
      <figcaption className="hero-screen__bar">
        <span aria-hidden="true" className="hero-screen__dot" />
        <span className="hc-title truncate">{screen.name}</span>
      </figcaption>
      {/* Images are served unoptimized (next.config.ts); next/image would add nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        decoding="async"
        {...imgProps}
        className="hero-screen__img"
        style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
      />
    </figure>
  );
}
