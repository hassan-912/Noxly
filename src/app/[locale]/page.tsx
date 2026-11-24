import { notFound } from "next/navigation";
import { getDictionary, getProjects, isLocale } from "@/lib/i18n";
import { sectionIds } from "@/components/layout/nav";
import { Hero } from "@/components/hero/Hero";
import { ProjectViewer } from "@/components/work/ProjectViewer";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StorySection } from "@/components/sections/StorySection";
import { FurtherProjectsSection } from "@/components/sections/FurtherProjectsSection";
import { BuildingSection } from "@/components/sections/BuildingSection";
import { ContactSection } from "@/components/sections/ContactSection";

/**
 * Home page: the hero (the only h1), followed by the portfolio sections in navigation order.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} locale={locale} />
      {sectionIds.map((id, i) => {
        const wide: boolean = id === "work";
        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-title`}
            className={i % 2 === 1 ? "site-dots bg-frost" : undefined}
          >
            <div className={wide ? "mx-auto max-w-7xl px-5 pt-24 sm:px-8" : "mx-auto max-w-7xl px-5 py-24 sm:px-8"}>
              {id !== "contact" && <>
                <p className="font-mono text-sm text-ink-muted">{dict.sections[id].counter}</p>
                <h2 id={`${id}-title`} className="mt-2 text-3xl font-semibold tracking-tight">
                  {dict.sections[id].title}
                </h2>
              </>}
              {wide && (
                <p className="mt-4 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-ink-muted">
                  {dict.sections[id].intro}
                </p>
              )}
              {id === "services" && <ServicesSection locale={locale} />}
              {id === "story" && <StorySection locale={locale} />}
              {id === "projects" && <FurtherProjectsSection locale={locale} />}
              {id === "building" && <BuildingSection locale={locale} />}
              {id === "contact" && <ContactSection locale={locale} />}
            </div>
            {wide && (
              <div className="mx-auto mt-10 max-w-[100rem] px-5 pb-24 sm:px-8 lg:mt-12">
                <ProjectViewer locale={locale} projects={getProjects("featured")} />
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
