"use client";

import { useId, useState } from "react";
import { ChevronDown, FileText, Sparkles } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { reviewCase, reviewFields, type ReviewValue } from "./data/review";
import { Chip, DemoShell, Kicker, Ltr, Panel, TabPanel, Tabs, fill, type DemoProps } from "./kit";

type View = "comparison" | "report";

/** Column template of the comparison table once the frame is wide enough for one row per field. */
const ROW_COLUMNS = "@d2:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)_9.5rem]";

/**
 * Document review: a field-by-field comparison of two sample documents. Whether a field matches
 * is computed here by comparing the two values (deterministic). The AI-assisted narrative check
 * is a separate region with its own look, and it never feeds the factual findings.
 */
export default function ReviewDemo({ locale }: DemoProps) {
  const dict = getDictionary(locale).demos;
  const t = dict.review;
  const uid = useId();
  const [view, setView] = useState<View>("comparison");

  const text = (value: ReviewValue) => ("text" in value ? value.text : dict.people[value.person]);
  const rows = reviewFields.map((field) => {
    const a = text(field.a.value);
    const b = text(field.b.value);
    return { ...field, label: t.fields[field.id], aText: a, bText: b, isMatch: a === b, literal: "text" in field.a.value };
  });
  const discrepancies = rows.filter((row) => !row.isMatch);
  const matches = rows.length - discrepancies.length;
  const [open, setOpen] = useState<string | null>(discrepancies[0]?.id ?? null);

  const documents = [
    { key: "a" as const, tag: t.documentA, name: t.documentAName },
    { key: "b" as const, tag: t.documentB, name: t.documentBName },
  ];

  const value = (content: string, literal: boolean, differs: boolean) => (
    <span
      className={cn(
        "inline-block max-w-full rounded-md break-words",
        literal && "font-mono text-xs",
        differs && "bg-[#ffe8dc] px-1.5 py-0.5 font-medium",
      )}
    >
      {literal ? <Ltr>{content}</Ltr> : content}
    </span>
  );

  return (
    <DemoShell
      id="review"
      locale={locale}
      title={t.title}
      icon={<FileText />}
      aside={
        <Chip tone="muted" dot={false}>
          {t.caseLabel} · <Ltr className="font-mono">{reviewCase.id}</Ltr>
        </Chip>
      }
    >
      <Tabs
        idBase={uid}
        label={dict.common.views}
        value={view}
        onChange={setView}
        items={[
          { id: "comparison", label: t.comparison },
          { id: "report", label: t.report },
        ]}
        className="@d1:w-fit @d1:[&>button]:px-4 @d1:[&>button]:whitespace-nowrap"
      />

      {view === "comparison" && (
        <TabPanel idBase={uid} id="comparison" className="mt-3 @d2:mt-4">
          <div
            data-review-layout
            className="grid grid-cols-1 items-start gap-3 @d2:gap-4 @d3:grid-cols-[minmax(0,1fr)_17.5rem]"
          >
            {/* Deterministic region */}
            <section
              data-region="factual"
              aria-labelledby={`${uid}-factual`}
              className="overflow-hidden rounded-xl border border-mist bg-surface"
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-3.5 py-3">
                <div className="min-w-0">
                  <p id={`${uid}-factual`} className="text-sm font-semibold">
                    {t.factualChecks}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">{t.factualNote}</p>
                </div>
                <p className="flex flex-wrap gap-1.5">
                  <Chip tone="positive">
                    {t.match} <span className="font-mono">{matches}</span>
                  </Chip>
                  <Chip tone="warning">
                    {t.discrepancy} <span className="font-mono">{discrepancies.length}</span>
                  </Chip>
                </p>
              </div>

              <div
                aria-hidden="true"
                className={cn(
                  "hidden gap-x-3 border-y border-mist bg-frost/70 px-3.5 py-1.5 text-ink-muted @d2:grid",
                  ROW_COLUMNS,
                )}
              >
                <Kicker>{t.field}</Kicker>
                {documents.map((doc) => (
                  <Kicker key={doc.key} className="truncate">
                    {doc.tag}
                    <span className="hidden @d3:inline"> · {doc.name}</span>
                  </Kicker>
                ))}
              </div>

              <ul className="divide-y divide-mist border-t border-mist @d2:border-t-0">
                {rows.map((row) => {
                  const expanded = open === row.id;
                  const panelId = `${uid}-evidence-${row.id}`;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        onClick={() => setOpen(expanded ? null : row.id)}
                        className={cn(
                          "grid w-full cursor-pointer grid-cols-2 items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5 text-start transition-colors hover:bg-frost/70 focus-visible:-outline-offset-2",
                          ROW_COLUMNS,
                          expanded && "bg-frost/70",
                        )}
                      >
                        <span className="order-1 font-medium">{row.label}</span>
                        <span className="order-3 flex min-w-0 items-baseline gap-1.5">
                          <Kicker className="@d2:hidden">A</Kicker>
                          <span className="sr-only">{t.documentA}:</span>
                          {value(row.aText, row.literal, !row.isMatch)}
                        </span>
                        <span className="order-4 flex min-w-0 items-baseline gap-1.5">
                          <Kicker className="@d2:hidden">B</Kicker>
                          <span className="sr-only">{t.documentB}:</span>
                          {value(row.bText, row.literal, !row.isMatch)}
                        </span>
                        <span className="order-2 flex min-w-0 items-center justify-end gap-1.5 @d2:order-5">
                          <Chip tone={row.isMatch ? "positive" : "warning"} className="shrink">
                            {row.isMatch ? t.match : t.discrepancy}
                          </Chip>
                          <span className="sr-only">{t.showEvidence}</span>
                          <ChevronDown
                            aria-hidden="true"
                            className={cn("size-4 shrink-0 text-ink-muted transition-transform", expanded && "rotate-180")}
                          />
                        </span>
                      </button>

                      <div id={panelId} hidden={!expanded} className="border-t border-mist bg-frost/70 px-3.5 py-3">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <Kicker className="font-medium text-ink">{t.evidence}</Kicker>
                          <p className="text-xs text-ink-muted">{row.isMatch ? t.evidenceSame : t.evidenceDiffers}</p>
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-2 @d1:grid-cols-2">
                          {documents.map((doc) => (
                            <Excerpt
                              key={doc.key}
                              heading={`${doc.tag} · ${doc.name}`}
                              location={fill(t.location, { page: row[doc.key].page, line: row[doc.key].line })}
                              label={row.label}
                              content={doc.key === "a" ? row.aText : row.bText}
                              literal={row.literal}
                              differs={!row.isMatch}
                            />
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* AI-assisted region: separate element, dashed lavender treatment, own label */}
            <section
              data-region="ai"
              aria-labelledby={`${uid}-ai`}
              className="rounded-xl border border-dashed border-periwinkle bg-[#f3f2ff] p-3.5"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <Sparkles aria-hidden="true" className="size-4 shrink-0 text-indigo" />
                <p id={`${uid}-ai`} className="text-sm font-semibold">
                  {t.aiAssisted}
                </p>
                <Chip tone="accent" dot={false} className="@d3:ms-0 ms-auto">
                  {t.aiModel}
                </Chip>
              </div>
              <p className="mt-1.5 text-xs text-ink-muted">{t.aiNote}</p>
              <div className="mt-3 rounded-lg border border-[#d6d8ff] bg-surface/80 p-3">
                <Kicker>{t.aiSampleLabel}</Kicker>
                <p className="mt-1">{t.aiSample}</p>
              </div>
            </section>
          </div>
        </TabPanel>
      )}

      {view === "report" && (
        <TabPanel idBase={uid} id="report" focusable className="mt-3 @d2:mt-4">
          <Panel className="mx-auto max-w-[42rem] p-4 shadow-[0_18px_40px_-24px_rgb(14_26_36/0.3)] @d1:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-mist pb-3">
              <div>
                <p className="text-base font-semibold">{t.reportTitle}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {t.caseLabel} · <Ltr className="font-mono">{reviewCase.id}</Ltr> · {dict.people.applicantA}
                </p>
              </div>
              <Chip tone="muted" dot={false} className="font-mono">
                PDF
              </Chip>
            </div>

            <div data-report-factual className="mt-4 grid grid-cols-1 gap-4 @d2:grid-cols-[14rem_minmax(0,1fr)] @d2:gap-6">
              <div>
                <Kicker>{t.reportDocuments}</Kicker>
                <ul className="mt-1.5 space-y-1">
                  {documents.map((doc) => (
                    <li key={doc.key} className="flex items-baseline gap-2">
                      <span className="demo-kicker shrink-0 text-ink-muted">{doc.tag}</span>
                      <span>{doc.name}</span>
                    </li>
                  ))}
                </ul>
                <Kicker className="mt-4">{t.factualChecks}</Kicker>
                <dl className="mt-1.5 grid grid-cols-2 gap-2">
                  {[
                    { label: t.match, count: matches, bar: "bg-teal-text" },
                    { label: t.discrepancy, count: discrepancies.length, bar: "bg-[#c2571f]" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-mist px-2.5 py-2">
                      <dd className="font-mono text-lg leading-none font-medium">{stat.count}</dd>
                      <dt className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
                        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", stat.bar)} />
                        <span className="min-w-0 truncate">{stat.label}</span>
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <Kicker>{t.reportFindings}</Kicker>
                <ul className="mt-1.5 divide-y divide-mist rounded-lg border border-mist">
                  {discrepancies.map((row) => (
                    <li key={row.id} className="px-3 py-2.5">
                      <p className="font-medium">{row.label}</p>
                      <dl className="mt-1.5 grid grid-cols-1 gap-1.5 @d1:grid-cols-2 @d1:gap-3">
                        {documents.map((doc) => (
                          <div key={doc.key} className="min-w-0">
                            <dt className="demo-kicker text-ink-muted">{doc.tag}</dt>
                            <dd className="mt-0.5">
                              {value(doc.key === "a" ? row.aText : row.bText, row.literal, true)}
                              <span className="demo-kicker mt-1 block text-ink-muted">
                                {fill(t.location, { page: row[doc.key].page, line: row[doc.key].line })}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-report-ai className="mt-4 rounded-lg border border-dashed border-periwinkle bg-[#f3f2ff] p-3">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
                <Sparkles aria-hidden="true" className="size-3.5 shrink-0 text-indigo" />
                {t.aiAssisted}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{t.aiNote}</p>
              <p className="mt-2">{t.aiSample}</p>
            </div>

            <p className="mt-4 border-t border-mist pt-3 text-xs text-ink-muted">{t.reportSample}</p>
          </Panel>
        </TabPanel>
      )}
    </DemoShell>
  );
}

/** A slice of a sample document: placeholder lines around the one quoted line, value marked. */
function Excerpt({
  heading,
  location,
  label,
  content,
  literal,
  differs,
}: {
  heading: string;
  location: string;
  label: string;
  content: string;
  literal: boolean;
  differs: boolean;
}) {
  return (
    <figure className="min-w-0 rounded-lg border border-mist bg-surface p-2.5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <span className="text-xs font-medium">{heading}</span>
        <span className="demo-kicker text-ink-muted">{location}</span>
      </figcaption>
      <div className="mt-2 space-y-1.5">
        <span aria-hidden="true" className="block h-1.5 w-4/5 rounded-full bg-mist/70" />
        <p className="text-xs break-words">
          {label}:{" "}
          <mark
            className={cn(
              "rounded px-1 py-0.5 font-medium text-ink",
              differs ? "bg-[#ffd9c7]" : "bg-[#d5efec]",
              literal && "font-mono",
            )}
          >
            {literal ? <Ltr>{content}</Ltr> : content}
          </mark>
        </p>
        <span aria-hidden="true" className="block h-1.5 w-3/5 rounded-full bg-mist/70" />
      </div>
    </figure>
  );
}
