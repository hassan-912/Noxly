"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/cn";

export const devices = ["desktop", "tablet", "phone"] as const;
export type Device = (typeof devices)[number];

const icons = { desktop: Monitor, tablet: Tablet, phone: Smartphone } as const;

/**
 * Desktop / tablet / phone (or a subset, via `options`) as a radio group of native radios (so
 * arrow keys, focus and form semantics are the browser's own). The caller hides it below 768px,
 * where the frame is always the phone layout.
 */
export function DeviceControls({
  name,
  label,
  labels,
  options = devices,
  value,
  onChange,
  className,
}: {
  name: string;
  label: string;
  labels: Record<Device, string>;
  /** The devices offered, in order. */
  options?: readonly Device[];
  value: Device;
  onChange: (device: Device) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("gap-0.5 rounded-full bg-mist/55 p-0.5", className)}>
      {options.map((device) => {
        const Icon = icons[device];
        const checked = device === value;
        return (
          <label
            key={device}
            className={cn(
              "relative inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium transition-[background-color,color,box-shadow] duration-200",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo",
              checked ? "bg-surface text-ink shadow-[0_1px_2px_rgb(14_26_36/0.16)]" : "text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={device}
              checked={checked}
              onChange={() => onChange(device)}
              className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full opacity-0"
            />
            <Icon aria-hidden="true" strokeWidth={1.75} className={cn("size-4 shrink-0", checked && "text-indigo")} />
            {labels[device]}
          </label>
        );
      })}
    </div>
  );
}
