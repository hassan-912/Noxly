import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getDictionary, isLocale } from "@/lib/i18n";
import { sectionIds } from "@/components/layout/nav";

/**
 * Home page shell. Every section exists with its final anchor id and heading so navigation
 * works now; later tasks replace each placeholder with the real section (spec §7 order).
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* TODO(task 4): the hero renders the visible h1. */}
      <h1 className="sr-only">
        {site.name} — {dict.identity.role}
      </h1>
      {sectionIds.map((id, i) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-title`}
          className={i % 2 === 1 ? "bg-frost" : undefined}
        >
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="font-mono text-sm text-ink-muted">{dict.sections[id].counter}</p>
            <h2 id={`${id}-title`} className="mt-2 text-3xl font-semibold tracking-tight">
              {dict.sections[id].title}
            </h2>
          </div>
        </section>
      ))}
    </>
  );
}
