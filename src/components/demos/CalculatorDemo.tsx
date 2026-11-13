"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Check, Info, Landmark, Plane, RotateCcw, SlidersHorizontal, TriangleAlert } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  fundingCheck,
  funds as fundsRange,
  pathways,
  sampleDailyAmount,
  sampleRate,
  stayOptions,
  workOptions,
  type Pathway,
  type Work,
} from "./data/calculator";
import { Button, Chip, DemoShell, Kicker, Ltr, Option, Panel, Stepper, fill, formatNumber, useFocusAfterUpdate, type DemoProps } from "./kit";

const RESULT = 3;

const pathwayIcons: Record<Pathway, ReactNode> = {
  tourism: <Plane aria-hidden="true" />,
  immigration: <Landmark aria-hidden="true" />,
  jobSeeker: <Briefcase aria-hidden="true" />,
};

/**
 * Assessment: a three-step questionnaire that organises the answers into a "Preliminary MG
 * assessment" with a funding check at a fixed sample rate. It shows no score and says plainly
 * that it is not an official eligibility decision.
 */
export default function CalculatorDemo({ locale }: DemoProps) {
  const dict = getDictionary(locale).demos;
  const t = dict.calculator;
  const uid = useId();
  const focusAfterUpdate = useFocusAfterUpdate();

  const [step, setStep] = useState(0);
  const [pathway, setPathway] = useState<Pathway>("tourism");
  const [travelled, setTravelled] = useState(true);
  const [work, setWork] = useState<Work>("employed");
  const [funds, setFunds] = useState<number>(fundsRange.initial);
  const [stay, setStay] = useState(stayOptions.tourism[1]);

  const funding = fundingCheck(pathway, stay, funds);
  const steps = [t.pathway, t.details, t.fundingCheck];
  const headingId = `${uid}-heading`;
  const money = (amount: number, currency: string) => (
    <Ltr className="font-mono whitespace-nowrap">
      {currency} {formatNumber(amount)}
    </Ltr>
  );

  const go = (to: number) => {
    setStep(to);
    focusAfterUpdate(headingId);
  };
  const choosePathway = (next: Pathway) => {
    setPathway(next);
    setStay(stayOptions[next][1]);
  };
  const startOver = () => {
    setPathway("tourism");
    setTravelled(true);
    setWork("employed");
    setFunds(fundsRange.initial);
    setStay(stayOptions.tourism[1]);
    go(0);
  };

  const answers: { label: string; value: ReactNode; shown: boolean }[] = [
    { label: t.pathway, value: t[pathway], shown: true },
    { label: t.travelHistory, value: travelled ? t.yes : t.no, shown: step >= 1 },
    { label: t.workSituation, value: t[work], shown: step >= 1 },
    { label: t.funds, value: money(funds, sampleRate.to), shown: step >= 2 },
    { label: t.stay, value: fill(t.days, { count: stay }), shown: step >= 2 },
  ];

  const fundingSummary = (
    <div className="rounded-lg border border-mist bg-frost/70 p-3">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 @d1:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-muted">{t.funds}</dt>
          <dd className="mt-0.5 font-medium">
            {money(funds, sampleRate.to)}
            <span className="mx-1.5 text-ink-muted">≈</span>
            {money(funding.availableEur, sampleRate.from)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">
            {t.sampleRequirement} · {fill(t.days, { count: stay })}
          </dt>
          <dd className="mt-0.5 font-medium">
            {money(funding.requiredEur, sampleRate.from)}{" "}
            <span className="text-xs font-normal text-ink-muted">
              ({fill(t.perDay, { amount: `${sampleRate.from} ${sampleDailyAmount[pathway]}` })})
            </span>
          </dd>
        </div>
      </dl>
      <p className="mt-2.5 flex flex-wrap items-center gap-x-1.5 border-t border-mist pt-2 text-xs text-ink-muted">
        <span className="font-medium text-ink">{t.sampleRate}</span>
        <Ltr className="font-mono">
          1 {sampleRate.from} = {sampleRate.rate.toFixed(2)} {sampleRate.to}
        </Ltr>
      </p>
    </div>
  );

  return (
    <DemoShell id="calculator" locale={locale} title={t.title} icon={<SlidersHorizontal />}>
      <div className="grid grid-cols-1 items-start gap-3 @d2:grid-cols-[minmax(0,1fr)_15rem] @d2:gap-4 @d3:grid-cols-[minmax(0,1fr)_18rem]">
        <Panel className="p-3.5 @d1:p-5">
          {step < RESULT ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                go(step + 1);
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <Stepper steps={steps} current={step} label={t.title} />
                <Kicker>{fill(dict.common.step, { current: step + 1, total: steps.length })}</Kicker>
              </div>

              <div className="mt-4 @d1:mt-5">
                {step === 0 && (
                  <fieldset>
                    <legend id={headingId} tabIndex={-1} className="text-[0.9375rem] font-semibold focus:outline-none">
                      {t.pathwayQuestion}
                    </legend>
                    <div className="mt-3 grid grid-cols-1 gap-2 @d2:grid-cols-3">
                      {pathways.map((id) => (
                        <Option
                          key={id}
                          name={`${uid}-pathway`}
                          value={id}
                          checked={pathway === id}
                          onChange={() => choosePathway(id)}
                          className="@d2:flex-col @d2:items-start @d2:gap-2.5 @d2:py-3 @d2:[&>.demo-option-check]:absolute @d2:[&>.demo-option-check]:end-3 @d2:[&>.demo-option-check]:top-3"
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg [&>svg]:size-4",
                              pathway === id ? "bg-indigo text-surface" : "bg-frost text-ink-muted",
                            )}
                          >
                            {pathwayIcons[id]}
                          </span>
                          <span className="font-medium">{t[id]}</span>
                        </Option>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <fieldset>
                      <legend id={headingId} tabIndex={-1} className="text-[0.9375rem] font-semibold focus:outline-none">
                        {t.travelQuestion}
                      </legend>
                      <div className="mt-2.5 grid max-w-xs grid-cols-2 gap-2">
                        {[true, false].map((answer) => (
                          <Option
                            key={String(answer)}
                            shape="pill"
                            name={`${uid}-travel`}
                            value={String(answer)}
                            checked={travelled === answer}
                            onChange={() => setTravelled(answer)}
                          >
                            <span className="font-medium">{answer ? t.yes : t.no}</span>
                          </Option>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="text-[0.9375rem] font-semibold">{t.workQuestion}</legend>
                      <div className="mt-2.5 grid grid-cols-1 gap-2 @d1:grid-cols-3">
                        {workOptions.map((id) => (
                          <Option
                            key={id}
                            shape="pill"
                            name={`${uid}-work`}
                            value={id}
                            checked={work === id}
                            onChange={() => setWork(id)}
                          >
                            <span className="font-medium">{t[id]}</span>
                          </Option>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <label
                          id={headingId}
                          tabIndex={-1}
                          htmlFor={`${uid}-funds`}
                          className="text-[0.9375rem] font-semibold focus:outline-none"                        >
                          {t.funds}
                        </label>
                        <output htmlFor={`${uid}-funds`} className="text-[0.9375rem] font-medium">
                          {money(funds, sampleRate.to)}
                        </output>
                      </div>
                      <input
                        id={`${uid}-funds`}
                        type="range"
                        min={fundsRange.min}
                        max={fundsRange.max}
                        step={fundsRange.step}
                        value={funds}
                        aria-valuetext={`${sampleRate.to} ${formatNumber(funds)}`}
                        onChange={(event) => setFunds(Number(event.target.value))}
                        className="mt-2 block h-6 w-full cursor-pointer accent-indigo"
                      />
                    </div>
                    <fieldset>
                      <legend className="text-[0.9375rem] font-semibold">{t.stay}</legend>
                      <div className="mt-2.5 grid grid-cols-3 gap-2">
                        {stayOptions[pathway].map((days) => (
                          <Option
                            key={days}
                            shape="pill"
                            name={`${uid}-stay`}
                            value={String(days)}
                            checked={stay === days}
                            onChange={() => setStay(days)}
                          >
                            <span className="font-medium">{fill(t.days, { count: days })}</span>
                          </Option>
                        ))}
                      </div>
                    </fieldset>
                    {fundingSummary}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-mist pt-3.5">
                {step > 0 ? (
                  <Button onClick={() => go(step - 1)}>
                    <ArrowLeft aria-hidden="true" className="rtl:-scale-x-100" />
                    {t.back}
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" variant="primary">
                  {step === steps.length - 1 ? t.seeResult : t.next}
                  <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <p id={headingId} tabIndex={-1} className="text-base font-semibold focus:outline-none">
                  {t.result}
                </p>
                <Chip tone="accent" dot={false}>
                  {t.pathway} · {t[pathway]}
                </Chip>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 @d3:grid-cols-[15rem_minmax(0,1fr)] @d3:items-center @d3:gap-5">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full [&>svg]:size-4",
                      funding.covers ? "bg-[#e2f4f1] text-teal-text" : "bg-[#ffe8dc] text-[#a3441a]",
                    )}
                  >
                    {funding.covers ? <Check strokeWidth={2.5} /> : <TriangleAlert />}
                  </span>
                  <div className="min-w-0">
                    <Kicker>{t.fundingCheck}</Kicker>
                    <p className="font-semibold">{funding.covers ? t.fundingCovers : t.fundingBelow}</p>
                  </div>
                </div>
                {fundingSummary}
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-lg border border-mist bg-frost p-3 font-medium">
                <Info aria-hidden="true" className="mt-px size-4 shrink-0 text-ink-muted" />
                {t.disclaimer}
              </p>

              <div className="mt-4 flex justify-end border-t border-mist pt-3.5">
                <Button onClick={startOver}>
                  <RotateCcw aria-hidden="true" />
                  {t.startOver}
                </Button>
              </div>
            </div>
          )}
        </Panel>

        {/* The structured answers, building up beside the questions (below them on a phone, once done). */}
        <Panel className={cn("p-3.5", step < RESULT && "hidden @d2:block")}>
          <Kicker>{t.answers}</Kicker>
          <dl className="mt-2 divide-y divide-mist">
            {answers.map((answer) => (
              <div key={answer.label} className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-xs text-ink-muted">{answer.label}</dt>
                <dd className={cn("text-end font-medium", !answer.shown && "text-ink-muted")}>
                  {answer.shown ? answer.value : <span aria-hidden="true">—</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </DemoShell>
  );
}
