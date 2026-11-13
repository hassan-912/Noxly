"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { CalendarCheck, Check, FileText, SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMotionOK } from "@/lib/motion";

export type HeroCompositionLabels = {
  /** Accessible name of the whole composition (it is one illustrative image to assistive tech). */
  composition: string;
  /** "Illustrative demo · sample data" */
  demo: string;
  review: {
    title: string;
    documentA: string;
    documentB: string;
    factualChecks: string;
    aiAssisted: string;
    match: string;
    discrepancy: string;
  };
  calculator: {
    title: string;
    pathway: string;
    tourism: string;
    immigration: string;
    jobSeeker: string;
    fundingCheck: string;
    result: string;
  };
  consultation: { title: string; chooseSlot: string; confirm: string; ticket: string };
};

/** Sample booking times: Latin digits in every locale. */
const SLOTS = ["09:30", "11:00", "13:30", "15:00"];

/** A decorative QR-like pattern (not a real, scannable code). */
const QR = [
  "111010111",
  "101001101",
  "111010111",
  "001101000",
  "110010110",
  "010111001",
  "111001010",
  "101010110",
  "111011001",
];

/** The settle finishes after this share of the first viewport has been scrolled. */
const SETTLE_VIEWPORTS = 0.55;

/**
 * The layered product screens at the end side of the hero. They start slightly fanned out and
 * settle into a tight stack while the first viewport is scrolled: `--p` (0 → 1) drives the
 * transforms in CSS (`.hero-screen`), which also mirrors them in RTL and pins `--p` to 1 under
 * reduced motion.
 *
 * // swap after task 5: these are simplified static mock screens; Task 10 replaces them with
 * thumbnails of the real coded demos (Review, Calculator, Consultation).
 */
export function HeroComposition({ labels, className }: { labels: HeroCompositionLabels; className?: string }) {
  const ok = useMotionOK();
  const { scrollY } = useScroll();
  const settle = useTransform(scrollY, (y) => {
    if (typeof window === "undefined") return 0;
    return Math.min(Math.max(y / (window.innerHeight * SETTLE_VIEWPORTS), 0), 1);
  });
  const progress = useSpring(settle, { stiffness: 140, damping: 28, mass: 0.6 });

  return (
    <figure className={cn("hero-comp", className)}>
      <motion.div
        role="img"
        aria-label={labels.composition}
        className="hero-comp__stage"
        style={ok ? ({ "--p": progress } as unknown as CSSProperties) : undefined}
      >
        <ReviewScreen labels={labels.review} />
        <CalculatorScreen labels={labels.calculator} />
        <ConsultationScreen labels={labels.consultation} />
      </motion.div>
      <figcaption className="hero-comp__caption">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-teal" />
        {labels.demo}
      </figcaption>
    </figure>
  );
}

function Screen({
  pose,
  className,
  children,
}: {
  /** Start offset (design px, inline axis mirrored in RTL) and start → settled rotation (deg). */
  pose: { x: number; y: number; from: number; to: number };
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("hero-screen", className)}
      style={{ "--x": pose.x, "--y": pose.y, "--r0": pose.from, "--r1": pose.to } as CSSProperties}
    >
      {children}
    </div>
  );
}

function TitleBar({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-mist/80 px-3.5 py-2.5">
      <span className="grid size-5 shrink-0 place-items-center rounded-[calc(var(--u)*6)] bg-indigo/10 text-indigo [&>svg]:size-3">
        {icon}
      </span>
      <span className="hc-title truncate">{title}</span>
    </div>
  );
}

/** A placeholder line standing in for sample data. */
function Line({ className }: { className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-mist/80", className)} />;
}

function Chip({ tone, children }: { tone: "match" | "discrepancy"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "hc-small inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-ink",
        tone === "match" ? "bg-[#e2f4f1]" : "bg-[#ffe8dc]",
      )}
    >
      <span className={cn("size-1 rounded-full", tone === "match" ? "bg-teal" : "bg-[#f08a5d]")} />
      {children}
    </span>
  );
}

function ReviewScreen({ labels }: { labels: HeroCompositionLabels["review"] }) {
  const documents = [
    { label: labels.documentA, lines: ["w-4/5", "w-3/5", "w-11/12", "w-2/3"] },
    { label: labels.documentB, lines: ["w-3/4", "w-2/3", "w-5/6", "w-1/2"] },
  ];
  return (
    <Screen pose={{ x: 16, y: -12, from: 2.6, to: 1.1 }} className="end-0 top-0 z-10 w-116">
      <TitleBar icon={<FileText aria-hidden="true" />} title={labels.title} />
      <div className="space-y-3 p-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          {documents.map((doc) => (
            <div key={doc.label} className="rounded-[calc(var(--u)*8)] border border-mist/80 bg-frost/70 p-2.5">
              <p className="hc-small font-mono text-ink-muted">{doc.label}</p>
              <div className="mt-2 space-y-1.5">
                {doc.lines.map((width, i) =>
                  i === 2 ? (
                    // The one field that differs between the two documents.
                    <span key={i} className="-mx-1 block rounded-[calc(var(--u)*4)] bg-[#ffe8dc] px-1 py-1">
                      <Line className={cn(width, "bg-[#f3b79c]")} />
                    </span>
                  ) : (
                    <Line key={i} className={width} />
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.15fr_1fr] gap-2.5">
          <div>
            <p className="hc-label font-semibold">{labels.factualChecks}</p>
            <ul className="mt-2 space-y-1.5">
              {(["match", "match", "discrepancy"] as const).map((tone, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Line className={["w-24", "w-16", "w-20"][i]} />
                  <span className="flex-1" />
                  <Chip tone={tone}>{tone === "match" ? labels.match : labels.discrepancy}</Chip>
                </li>
              ))}
            </ul>
          </div>
          {/* AI-assisted work is always a separate, differently styled panel. */}
          <div className="rounded-[calc(var(--u)*8)] border border-dashed border-periwinkle bg-[#f3f2ff] p-2.5">
            <p className="hc-small flex items-start gap-1.5 font-medium text-ink">
              <Sparkles aria-hidden="true" className="mt-px size-3 shrink-0 text-indigo" />
              {labels.aiAssisted}
            </p>
            <div className="mt-2 space-y-1.5">
              <Line className="bg-periwinkle/30" />
              <Line className="w-3/4 bg-periwinkle/30" />
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function CalculatorScreen({ labels }: { labels: HeroCompositionLabels["calculator"] }) {
  const pathways = [labels.tourism, labels.immigration, labels.jobSeeker];
  return (
    <Screen pose={{ x: 22, y: 34, from: -2.4, to: -0.7 }} className="end-2 top-60 z-20 w-76 sm:w-80">
      <TitleBar icon={<SlidersHorizontal aria-hidden="true" />} title={labels.title} />
      <div className="space-y-3 p-3.5">
        <div>
          <p className="hc-small font-mono text-ink-muted">{labels.pathway}</p>
          <div className="mt-1.5 grid grid-cols-3 gap-0.5 rounded-full bg-frost p-0.5">
            {pathways.map((pathway, i) => (
              <span
                key={pathway}
                className={cn(
                  "hc-small truncate rounded-full px-1.5 py-1 text-center font-medium",
                  i === 0 ? "bg-surface text-ink shadow-[0_1px_2px_rgb(14_26_36/0.12)]" : "text-ink-muted",
                )}
              >
                {pathway}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-[calc(var(--u)*8)] border border-mist/80 px-2.5 py-2">
          <span className="hc-label font-medium">{labels.fundingCheck}</span>
          <Line className="flex-1" />
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-teal-text text-surface">
            <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
          </span>
        </div>
        <div className="rounded-[calc(var(--u)*8)] bg-frost p-2.5">
          <p className="hc-label font-semibold">{labels.result}</p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1.5 rounded-full", i < 3 ? "bg-indigo" : "bg-mist")} />
            ))}
          </div>
          <Line className="mt-2 w-2/3" />
        </div>
      </div>
    </Screen>
  );
}

function ConsultationScreen({ labels }: { labels: HeroCompositionLabels["consultation"] }) {
  return (
    <Screen pose={{ x: -22, y: 20, from: -5.5, to: -2.6 }} className="start-0 top-50 z-30 w-56">
      <TitleBar icon={<CalendarCheck aria-hidden="true" />} title={labels.title} />
      <div className="p-3.5">
        <p className="hc-small font-mono text-ink-muted">{labels.chooseSlot}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {SLOTS.map((slot, i) => (
            <span
              key={slot}
              className={cn(
                "hc-small rounded-[calc(var(--u)*7)] border py-1.5 text-center font-mono",
                i === 1 ? "border-indigo bg-indigo text-surface" : "border-mist text-ink",
              )}
            >
              {slot}
            </span>
          ))}
        </div>
        <span className="hc-label mt-2.5 block rounded-full bg-ink py-1.5 text-center font-medium text-surface">
          {labels.confirm}
        </span>
        <div className="mt-3 flex items-center gap-2.5 border-t border-dashed border-mist pt-3">
          <svg viewBox="0 0 9 9" aria-hidden="true" className="size-10 shrink-0 text-ink" shapeRendering="crispEdges">
            {QR.flatMap((row, y) =>
              Array.from(row, (bit, x) =>
                bit === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null,
              ),
            )}
          </svg>
          <div className="min-w-0 flex-1">
            <p className="hc-label font-semibold">{labels.ticket}</p>
            <Line className="mt-1.5 w-4/5" />
            <Line className="mt-1.5 w-1/2" />
          </div>
        </div>
      </div>
    </Screen>
  );
}
