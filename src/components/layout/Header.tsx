import type { Dictionary } from "@/content/i18n";
import { locales, type Locale } from "@/content/types";
import { site } from "@/content/site";
import { LanguageMenu } from "./LanguageMenu";
import { MobileNav } from "./MobileNav";
import { navLinks } from "./nav";

/**
 * Sticky frosted header. At `lg` and up: wordmark, section anchors, language menu, "Let's talk".
 * Below `lg` the anchors move into the MobileNav sheet (seven anchors do not fit at 768px);
 * below `md` the language menu and CTA move there too.
 */
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = navLinks(locale, dict);
  const names = Object.fromEntries(locales.map((l) => [l, dict.language[l]])) as Record<Locale, string>;

  return (
    <header className="sticky top-0 z-50 border-b border-mist/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <a
          href={`/${locale}/`}
          aria-label={dict.nav.home}
          className="shrink-0 rounded-sm text-base font-semibold tracking-tight text-ink"
        >
          {site.name}
        </a>
        <nav aria-label={dict.nav.label} className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center justify-center gap-5 text-sm">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="whitespace-nowrap rounded-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto flex shrink-0 items-center gap-2 lg:ms-0">
          <div className="hidden md:block">
            <LanguageMenu locale={locale} label={dict.language.label} names={names} />
          </div>
          <a
            href={site.contacts.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center whitespace-nowrap rounded-full bg-indigo px-4 text-sm font-medium text-surface transition-colors hover:bg-ink md:inline-flex"
          >
            {dict.nav.letsTalk}
            <span className="sr-only"> {dict.viewer.opensNewTab}</span>
          </a>
          <div className="lg:hidden">
            <MobileNav
              locale={locale}
              links={links}
              names={names}
              whatsappHref={site.contacts.whatsapp.href}
              labels={{
                open: dict.nav.menuOpen,
                close: dict.nav.menuClose,
                nav: dict.nav.label,
                language: dict.language.label,
                letsTalk: dict.nav.letsTalk,
                opensNewTab: dict.viewer.opensNewTab,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
