"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

/** A compact project index; details remain available to keyboard and touch visitors. */
export function ProjectDisclosure({ name, pitch, number, showLabel, hideLabel, children }: {
  name: string;
  pitch: string;
  number: string;
  showLabel: string;
  hideLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <article className="border-b border-mist">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}
          className="group grid w-full cursor-pointer grid-cols-[2rem_minmax(0,1fr)_1.5rem] items-start gap-4 py-6 text-start hover:text-indigo sm:items-center sm:gap-6">
          <span aria-hidden="true" className="pt-1 font-mono text-xs text-ink-muted">{number}</span>
          <span className="grid min-w-0 gap-2 sm:grid-cols-2 sm:gap-6">
            <span className="text-xl font-semibold tracking-tight">{name}</span>
            <span className="text-sm font-normal leading-relaxed text-ink-muted">{pitch}</span>
          </span>
          <Plus aria-hidden="true" className={`mt-0.5 size-5 text-indigo motion-safe:transition-transform ${open ? "rotate-45" : ""}`} />
          <span className="sr-only">{open ? hideLabel : showLabel}</span>
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-8 ps-12 sm:ps-14">{children}</div>
    </article>
  );
}
