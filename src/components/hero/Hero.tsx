import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/content/i18n";
import { site } from "@/content/site";
import { Aurora } from "./Aurora";
import { HeroComposition, type HeroCompositionLabels } from "./HeroComposition";
import { StaggerHeadline } from "./StaggerHeadline";

/**
 * Cinematic moment 1 (spec §9): an asymmetric split with the introduction at the start side and
 * a layered product composition at the end side, over a slow pastel aurora. Everything is in the
 * static HTML and readable at once; motion is an enhancement and is removed under reduced motion.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const { review, calculator, consultation } = dict.demos;

  // Only the strings the composition shows cross into the client bundle.
  const labels: HeroCompositionLabels = {
    composition: t.compositionLabel,
    demo: dict.demos.label,
    review: {
      title: review.title,
      documentA: review.documentA,
      documentB: review.documentB,
      factualChecks: review.factualChecks,
      aiAssisted: review.aiAssisted,
      match: review.match,
      discrepancy: review.discrepancy,
    },
    calculator: {
      title: calculator.title,
      pathway: calculator.pathway,
      tourism: calculator.tourism,
      immigration: calculator.immigration,
      jobSeeker: calculator.jobSeeker,
      fundingCheck: calculator.fundingCheck,
      result: calculator.result,
    },
    consultation: {
      title: consultation.title,
      chooseSlot: consultation.chooseSlot,
      confirm: consultation.confirm,
      ticket: consultation.ticket,
    },
  };

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-clip">
      <Aurora />
      <div className="mx-auto grid max-w-7xl items-center gap-x-12 gap-y-16 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:min-h-[min(calc(100svh-4rem),54rem)] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] lg:py-20">
        <div className="max-w-2xl">
          <p className="hero-eyebrow">
            <span aria-hidden="true" className="hero-eyebrow__mark" />
            {t.eyebrow}
          </p>
          <StaggerHeadline id="hero-title" text={t.headline} scrambleWord={t.scrambleWord} className="mt-6 sm:mt-7" />
          <p className="mt-7 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.7] text-ink-muted sm:mt-8 sm:text-lg sm:leading-[1.7]">
            {t.intro}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-10">
            <a
              href={site.contacts.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-indigo py-3 ps-6 pe-5 text-base font-medium text-surface transition-colors duration-200 hover:bg-ink"
            >
              {t.ctaPrimary}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 rtl:group-focus-visible:-translate-x-0.5"
              />
              <span className="sr-only"> {dict.viewer.opensNewTab}</span>
            </a>
            <a
              href="#work"
              className="group inline-flex min-h-12 items-center gap-2 rounded-sm text-base font-medium text-ink underline decoration-mist decoration-2 underline-offset-8 transition-colors duration-200 hover:decoration-indigo focus-visible:decoration-indigo"
            >
              {t.ctaSecondary}
              <ArrowDown
                aria-hidden="true"
                className="size-4 shrink-0 text-ink-muted transition-transform duration-200 group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5"
              />
            </a>
          </div>
        </div>
        <HeroComposition labels={labels} className="lg:-me-4 xl:-me-10" />
      </div>
    </section>
  );
}
