"use client";

import type { FormEvent } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import type { ContactFormCopy } from "@/content/contact-form";
import { composeContactMessage } from "@/lib/contact-message";

const fieldClass = "mt-2 min-h-11 w-full rounded-md border border-mist bg-frost/70 px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/65 focus:border-indigo focus:bg-surface focus:ring-2 focus:ring-indigo/15";
const labelClass = "font-mono text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-slate";

function ChoiceGroup({ name, label, options, multiple = false, defaultIndex }: {
  name: string;
  label: string;
  options: string[];
  multiple?: boolean;
  defaultIndex?: number;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option, index) => (
          <label key={option} className="cursor-pointer">
            <input type={multiple ? "checkbox" : "radio"} name={name} value={index} defaultChecked={index === defaultIndex} className="peer sr-only" />
            <span className="inline-flex min-h-8 items-center rounded-md border border-mist bg-surface px-2.5 py-1.5 text-xs text-ink transition-colors hover:border-indigo peer-checked:border-ink peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ContactForm({ copy, whatsappHref }: { copy: ContactFormCopy; whatsappHref: string }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = composeContactMessage(new FormData(event.currentTarget), copy);
    window.open(`${whatsappHref}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={submit} className="min-w-0 rounded-xl border border-mist bg-surface p-5 shadow-[0_20px_50px_-40px_rgb(14_26_36/0.3)] sm:p-7 lg:p-8" aria-label={copy.eyebrow}>
      <div className="grid gap-7">
        <ChoiceGroup name="about" label={copy.about} options={copy.aboutOptions} defaultIndex={0} />
        <ChoiceGroup name="kind" label={copy.kind} options={copy.kindOptions} multiple />
        <div className="grid gap-7 sm:grid-cols-2">
          <ChoiceGroup name="budget" label={copy.budget} options={copy.budgetOptions} />
          <ChoiceGroup name="timeline" label={copy.timeline} options={copy.timelineOptions} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>{copy.name}</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>{copy.email}</label>
            <input id="contact-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254} className={fieldClass} />
          </div>
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>{copy.message}</label>
          <textarea id="contact-message" name="message" required maxLength={4000} rows={5} placeholder={copy.messagePlaceholder} className={`${fieldClass} min-h-32 resize-y`} />
        </div>
        <ChoiceGroup name="referral" label={copy.referral} options={copy.referralOptions} />
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-mist pt-5">
          <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">
            <Send aria-hidden="true" className="size-4" />
            {copy.send}
            <ArrowUpRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
          </button>
          <p className="max-w-xs text-xs leading-relaxed text-ink-muted">{copy.sendNote}</p>
        </div>
      </div>
    </form>
  );
}
