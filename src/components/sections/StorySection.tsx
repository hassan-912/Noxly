import { story } from "@/content/story";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";

export function StorySection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="mt-6" data-section-body="story">
      <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{dict.sections.story.intro}</p>
      <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
        <figure className="self-start">
          <div aria-hidden="true" className="flex size-20 items-center justify-center rounded-2xl border border-mist bg-surface font-mono text-2xl tracking-tight text-indigo">HA</div>
          <blockquote className="mt-8 max-w-lg text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
            {story.quote[locale]}
          </blockquote>
          <figcaption className="mt-6 text-sm text-ink-muted">{site.name}</figcaption>
        </figure>
        <ol aria-label={dict.story.timelineLabel} className="ms-2 border-s border-mist">
          {story.chapters.map((chapter) => (
            <li key={chapter.id} className="relative pb-10 ps-7 last:pb-0 sm:ps-9">
              <span aria-hidden="true" className="absolute -start-[5px] top-1.5 size-[9px] rounded-full border-2 border-frost bg-indigo" />
              <p className="font-mono text-xs text-ink-muted">{chapter.marker[locale]}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{chapter.title[locale]}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{chapter.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
