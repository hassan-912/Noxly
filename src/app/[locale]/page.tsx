import { notFound } from "next/navigation";
import { getDictionary, getProjects, isLocale } from "@/lib/i18n";
import { sectionIds } from "@/components/layout/nav";
import { Hero } from "@/components/hero/Hero";
import { ProjectViewer } from "@/components/work/ProjectViewer";

/**
 * Home page: the hero (the only h1), then every section with its final anchor id and heading so
 * navigation works now; later tasks replace each placeholder with the real section (spec §7 order).
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} />
      {sectionIds.map((id, i) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-title`}
          className={i % 2 === 1 ? "bg-frost" : undefined}
        >
          <div className={id === "work" ? "mx-auto max-w-7xl px-5 pt-24 sm:px-8" : "mx-auto max-w-7xl px-5 py-24 sm:px-8"}>
            <p className="font-mono text-sm text-ink-muted">{dict.sections[id].counter}</p>
            <h2 id={`${id}-title`} className="mt-2 text-3xl font-semibold tracking-tight">
              {dict.sections[id].title}
            </h2>
            {id === "work" && (
              <p className="mt-4 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-ink-muted">
                {dict.sections.work.intro}
              </p>
            )}
          </div>
          {id === "work" && (
            // The viewer is the one section that breaks out of the page column: a wide stage.
            <div className="mx-auto mt-10 max-w-[100rem] px-5 pb-24 sm:px-8 lg:mt-12">
              <ProjectViewer locale={locale} projects={getProjects("featured")} />
            </div>
          )}
        </section>
      ))}
    </>
  );
}
