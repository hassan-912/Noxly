import { ArrowRight, ArrowUpRight, BookOpen, Globe } from "lucide-react";
import type { ReactNode } from "react";
import type { Locale, Project } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { DemoLabel } from "@/components/demos/DemoLabel";
import { GlowSurface } from "@/components/ui/GlowSurface";
import { StatusPill } from "@/components/ui/StatusPill";
import { GitHubMark, TechLabel } from "@/components/ui/TechLabel";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Everything the viewer says about one project: counter, name, pitch, summary, status, stack
 * (icon plus readable name), links and the demo label. A server component: the viewer receives
 * it already rendered, so the icon sets never reach the client bundle.
 *
 * It lays itself out by its own width (container query): one column beside the stage, two
 * columns when it sits below it.
 */
export function ProjectInfo({
  locale,
  project,
  index,
  total,
}: {
  locale: Locale;
  project: Project;
  /** Zero-based position among the viewer's projects. */
  index: number;
  total: number;
}) {
  const dict = getDictionary(locale);
  const t = dict.viewer;
  const text = project.text[locale];
  const id = `work-info-${project.slug}`;
  const counter = t.counter.replace("{current}", pad(index + 1)).replace("{total}", pad(total));
  const newTab = <span className="sr-only"> {t.opensNewTab}</span>;

  return (
    <article data-project-info={project.slug} aria-labelledby={`${id}-name`} className="@container">
      <div className="grid gap-x-12 gap-y-7 @2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-xs text-ink-muted">
            <bdi dir="ltr">{counter}</bdi>
          </p>
          <h3 id={`${id}-name`} className="viewer-title mt-3 text-[1.375rem] leading-tight font-semibold tracking-tight">
            {text.name}
          </h3>
          <p className="mt-2 text-lg leading-snug text-pretty text-ink">{text.pitch}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-ink-muted">{text.summary}</p>
          {project.authorship.kind === "shared" && (
            <p className="mt-4 text-sm text-ink-muted">
              <span className="font-medium text-ink">{dict.authorship.shared}</span> · {project.authorship.note[locale]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {project.status.length > 0 && (
            <div>
              <p className="viewer-kicker">{t.status}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {project.status.map((key) => (
                  <StatusPill key={key} status={key} locale={locale} />
                ))}
              </div>
            </div>
          )}

          <div>
            <p id={`${id}-stack`} className="viewer-kicker">
              {t.stack}
            </p>
            <ul aria-labelledby={`${id}-stack`} className="mt-2.5 flex flex-wrap gap-1.5">
              {project.stack.map((techId) => (
                <li key={techId} className="max-w-full">
                  <TechLabel id={techId} />
                </li>
              ))}
            </ul>
          </div>

          <ul className="border-b border-mist">
            {project.caseStudy && (
              <InfoLink href={`/${locale}/work/${project.slug}/`} icon={<BookOpen aria-hidden="true" strokeWidth={1.75} />}>
                {t.caseStudy}
              </InfoLink>
            )}
            {project.liveUrl && (
              <InfoLink href={project.liveUrl} external icon={<Globe aria-hidden="true" strokeWidth={1.75} />}>
                {t.visitSite}
                {newTab}
              </InfoLink>
            )}
            {project.repo && (
              <InfoLink href={project.repo} external icon={<GitHubMark />}>
                {t.repo}
                {newTab}
              </InfoLink>
            )}
          </ul>

          {project.demo && <DemoLabel locale={locale} />}
        </div>
      </div>
    </article>
  );
}

/** One row of the link list: icon, label and a direction arrow that nudges on hover and focus. */
function InfoLink({
  href,
  external = false,
  icon,
  children,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  children: ReactNode;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <li className="border-t border-mist">
      <GlowSurface
        as="a"
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex min-h-12 items-center gap-3 rounded-lg px-2 py-3 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:text-indigo focus-visible:text-indigo"
      >
        <span className="shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-indigo group-focus-visible:text-indigo [&>svg]:size-4">
          {icon}
        </span>
        <span className="min-w-0 flex-1">{children}</span>
        <Arrow
          aria-hidden="true"
          className={
            external
              ? "size-4 shrink-0 text-ink-muted transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-indigo rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 rtl:group-focus-visible:-translate-x-0.5"
              : "size-4 shrink-0 text-ink-muted transition-[translate,color] duration-200 group-hover:translate-x-1 group-hover:text-indigo group-focus-visible:translate-x-1 group-focus-visible:text-indigo rtl:-scale-x-100 rtl:group-hover:-translate-x-1 rtl:group-focus-visible:-translate-x-1"
          }
        />
      </GlowSurface>
    </li>
  );
}
