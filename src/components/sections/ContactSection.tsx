import { ArrowUpRight, MessageCircle } from "lucide-react";
import { contactFormCopy } from "@/content/contact-form";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

export function ContactSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = contactFormCopy[locale];
  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16" data-section-body="contact">
      <div className="min-w-0 lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">{dict.sections.contact.counter} / {copy.eyebrow}</p>
        <h2 id="contact-title" className="mt-5 max-w-lg text-[clamp(2.7rem,5.5vw,5rem)] leading-[1.03] font-semibold tracking-[-0.05em]">
          <span className="block">{copy.headlineLead}</span>
          <span className="block font-mono font-normal tracking-[-0.065em] text-indigo">{copy.headlineAccent}</span>
        </h2>
        <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-muted">{copy.intro}</p>

        <div className="mt-12 border-t border-mist pt-6">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-slate">{copy.skip}</p>
          <a href={`mailto:${site.contacts.email}`} dir="ltr" className="mt-3 block w-fit max-w-full break-all text-xl font-semibold tracking-tight underline decoration-indigo decoration-2 underline-offset-6 hover:text-indigo sm:text-2xl">
            {site.contacts.email}
          </a>
          <a href={site.contacts.whatsapp.href} target="_blank" rel="noopener noreferrer" dir="ltr" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted hover:text-indigo">
            <MessageCircle aria-hidden="true" className="size-4" />
            +20 102 317 4210 · {dict.contact.whatsapp}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{dict.viewer.opensNewTab}</span>
          </a>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyEmail email={site.contacts.email} label={dict.contact.copyEmail} copied={dict.contact.copied} />
            <a href={site.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-mist px-4 text-sm text-ink-muted hover:border-indigo hover:text-indigo">
              {dict.contact.linkedin}<ArrowUpRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
              <span className="sr-only">{dict.viewer.opensNewTab}</span>
            </a>
          </div>
        </div>
      </div>
      <ContactForm copy={copy} whatsappHref={site.contacts.whatsapp.href} />
    </div>
  );
}
