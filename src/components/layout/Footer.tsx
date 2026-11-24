import type { Dictionary } from "@/content/i18n";
import type { Locale } from "@/content/types";
import { site } from "@/content/site";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { contacts } = site;
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  const newTab = <span className="sr-only"> {dict.viewer.opensNewTab}</span>;
  const linkClass = "rounded-sm text-ink underline-offset-4 hover:text-indigo hover:underline";
  // Built once at export time; the year updates with the next deploy.
  const year = String(new Date().getFullYear());

  return (
    <footer className="border-t border-mist bg-frost">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-semibold tracking-tight">{site.name}</p>
          <p className="mt-1 text-sm text-ink-muted">{dict.identity.role}</p>
          <p className="mt-1 text-sm text-ink-muted">{site.location[locale]}</p>
        </div>
        <ul className="grid gap-2 text-sm">
          <li>
            <a href={contacts.whatsapp.href} {...external} className={linkClass}>
              {dict.contact.whatsapp}
              {newTab}
            </a>
          </li>
          <li>
            <a href={`mailto:${contacts.email}`} className={linkClass}>
              {dict.contact.email}
            </a>
          </li>
          <li>
            <a href={contacts.linkedin} {...external} className={linkClass}>
              {dict.contact.linkedin}
              {newTab}
            </a>
          </li>
        </ul>
      </div>
      <div className="border-t border-mist">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 text-sm text-ink-muted sm:px-8">
          <p>{dict.footer.privacy}</p>
          <p>{dict.footer.copyright.replace("{year}", year)}</p>
          <a href="#main" className={linkClass}>
            {dict.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
