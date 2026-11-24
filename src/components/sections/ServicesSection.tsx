import { services } from "@/content/services";
import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";

export function ServicesSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="mt-6" data-section-body="services">
      <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{dict.sections.services.intro}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <ol aria-label={dict.services.outcomesLabel} className="border-t border-mist">
          {services.outcomes.map((outcome, index) => (
            <li key={outcome.id} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-mist py-7 sm:gap-6">
              <span aria-hidden="true" className="pt-1 font-mono text-xs text-indigo">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{outcome.title[locale]}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{outcome.body[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="self-start border-s-2 border-indigo/30 ps-6 sm:ps-8">
          <h3 className="font-mono text-sm text-ink-muted">{dict.services.stepsTitle}</h3>
          <ol className="mt-8 space-y-9">
            {services.steps.map((step, index) => (
              <li key={step.id}>
                <span aria-hidden="true" className="font-mono text-xs text-indigo">{String(index + 1).padStart(2, "0")}</span>
                <h4 className="mt-2 text-lg font-semibold tracking-tight">{step.title[locale]}</h4>
                <p className="mt-2 leading-relaxed text-ink-muted">{step.body[locale]}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
