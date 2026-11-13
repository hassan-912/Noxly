import { locales } from "@/content/types";
import { site } from "@/content/site";
import { dirOf, getDictionary } from "@/lib/i18n";

const en = getDictionary("en");

/**
 * Sends the visitor to the first supported language in `navigator.languages`
 * (falling back to English) and keeps any hash. It runs while the page is parsed, so
 * visitors with JavaScript are redirected at once; without it, the links are the way in.
 */
const redirect = `(function(){var s=${JSON.stringify(locales)};var l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];var t="en";for(var i=0;i<l.length;i++){var c=String(l[i]).toLowerCase().split("-")[0];if(s.indexOf(c)>-1){t=c;break}}location.replace("/"+t+"/"+location.hash)})();`;

export default function RootPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-8 px-6 py-16">
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <div>
        <p className="font-mono text-sm text-ink-muted">{site.name}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{en.root.title}</h1>
      </div>
      <noscript>
        <p className="text-ink-muted">{en.root.noscript}</p>
      </noscript>
      <ul className="grid gap-3">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={`/${locale}/`}
              lang={locale}
              hrefLang={locale}
              dir={dirOf(locale)}
              className="block rounded-lg border border-mist px-4 py-3 text-lg font-medium text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              {en.language[locale]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
