import type { Locale } from "@/content/types";

/** Flags used by the language picker: English (UK), German, French, and Arabic (Egypt). */
export function FlagIcon({ locale }: { locale: Locale }) {
  return (
    <svg aria-hidden="true" data-language-flag={locale} viewBox="0 0 24 16" className="h-4 w-6 shrink-0 overflow-hidden rounded-[3px] border border-ink/10 shadow-sm">
      {locale === "en" && <>
        <path fill="#17366d" d="M0 0h24v16H0z" />
        <path stroke="#fff" strokeWidth="3.4" d="M-1-1 25 17M25-1-1 17" />
        <path stroke="#d52030" strokeWidth="1.5" d="M-1-1 25 17M25-1-1 17" />
        <path stroke="#fff" strokeWidth="5" d="M12 0v16M0 8h24" />
        <path stroke="#d52030" strokeWidth="2.5" d="M12 0v16M0 8h24" />
      </>}
      {locale === "de" && <>
        <path fill="#171717" d="M0 0h24v5.34H0z" />
        <path fill="#d21f2b" d="M0 5.33h24v5.34H0z" />
        <path fill="#f6c33b" d="M0 10.66h24V16H0z" />
      </>}
      {locale === "fr" && <>
        <path fill="#194a91" d="M0 0h8v16H0z" />
        <path fill="#fff" d="M8 0h8v16H8z" />
        <path fill="#df263b" d="M16 0h8v16h-8z" />
      </>}
      {locale === "ar" && <>
        <path fill="#d42a32" d="M0 0h24v5.34H0z" />
        <path fill="#fff" d="M0 5.33h24v5.34H0z" />
        <path fill="#171717" d="M0 10.66h24V16H0z" />
        <path fill="#c59b3c" d="m11 5.8 1-.45 1 .45.7 1.2-.55 2.5H10.8L10.3 7z" />
      </>}
    </svg>
  );
}
