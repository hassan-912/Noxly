"use client";

import { useId, useState } from "react";
import { BookOpen, ClipboardList, Info, Link2, Users } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  linkBase,
  maxLinks,
  modules,
  sampleCodes,
  seedLinks,
  type LinkStatus,
  type ModuleCategory,
} from "./data/crew";
import {
  Button,
  Chip,
  DemoShell,
  Kicker,
  Ltr,
  Option,
  Panel,
  TabPanel,
  Tabs,
  fill,
  useFocusAfterUpdate,
  type ChipTone,
  type DemoProps,
} from "./kit";

type View = "admin" | "library";
type Filter = "all" | ModuleCategory;
type ReferralLink = { key: string; code: string; status: LinkStatus };

const statusTone: Record<LinkStatus, ChipTone> = { unused: "accent", used: "neutral", expired: "muted" };

/**
 * Crew-MG, in development: two moments of the internal platform, with no sign-in and no real
 * links. An admin generates a one-time referral link, which reads "Used" after one simulated
 * use; a newcomer sees the training and visa resource library.
 */
export default function CrewDemo({ locale }: DemoProps) {
  const all = getDictionary(locale);
  const dict = all.demos;
  const t = dict.crew;
  const uid = useId();
  const focusAfterUpdate = useFocusAfterUpdate();

  const [view, setView] = useState<View>("admin");
  const [filter, setFilter] = useState<Filter>("all");
  const [generated, setGenerated] = useState(0);
  const [links, setLinks] = useState<ReferralLink[]>(() =>
    seedLinks.map((link) => ({ ...link, key: `seed-${link.code}` })),
  );

  const generate = () => {
    const code = sampleCodes[generated % sampleCodes.length];
    setLinks((current) => [{ key: `link-${generated}`, code, status: "unused" as const }, ...current].slice(0, maxLinks));
    setGenerated(generated + 1);
  };
  const markUsed = (key: string) => {
    setLinks((current) => current.map((link) => (link.key === key ? { ...link, status: "used" } : link)));
    focusAfterUpdate(`${uid}-${key}`);
  };

  const statusText: Record<LinkStatus, { label: string; note: string }> = {
    unused: { label: t.unused, note: t.unusedNote },
    used: { label: t.used, note: t.usedNote },
    expired: { label: t.expired, note: t.expiredNote },
  };
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.all },
    { id: "training", label: t.training },
    { id: "visa", label: t.visaResources },
  ];
  const shown = modules.filter((module) => filter === "all" || module.category === filter);

  return (
    <DemoShell
      id="crew-mg"
      locale={locale}
      title={t.title}
      icon={<Users />}
      aside={<Chip tone="accent">{all.building.crewStatus}</Chip>}
    >
      <Tabs
        idBase={uid}
        label={dict.common.views}
        value={view}
        onChange={setView}
        items={[
          { id: "admin", label: t.adminView },
          { id: "library", label: t.libraryView },
        ]}
        className="@d2:w-fit @d2:[&>button]:px-4 @d2:[&>button]:whitespace-nowrap"
      />

      {view === "admin" && (
        <TabPanel idBase={uid} id="admin" className="mt-3 @d2:mt-4">
          <div className="grid grid-cols-1 items-start gap-3 @d2:grid-cols-[17rem_minmax(0,1fr)] @d2:gap-4 @d3:grid-cols-[20rem_minmax(0,1fr)]">
            <Panel className="p-3.5 @d1:p-4">
              <Kicker>{t.inviteFor}</Kicker>
              <div className="mt-2 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-[#dfe1ff] font-mono text-sm font-medium"
                >
                  A
                </span>
                <p className="min-w-0 font-medium">{dict.people.newcomerA}</p>
              </div>
              <Button variant="primary" onClick={generate} className="mt-3.5 w-full">
                <Link2 aria-hidden="true" />
                {t.generateLink}
              </Button>
              <p className="mt-3.5 flex items-start gap-2 border-t border-mist pt-3 text-xs text-ink-muted">
                <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                {t.securityNote}
              </p>
            </Panel>

            <Panel className="overflow-hidden">
              <Kicker id={`${uid}-links`} className="border-b border-mist bg-frost/70 px-3.5 py-2">
                {t.links}
              </Kicker>
              <ul aria-labelledby={`${uid}-links`} aria-live="polite" className="divide-y divide-mist">
                {links.map((link) => (
                  <li
                    key={link.key}
                    id={`${uid}-${link.key}`}
                    tabIndex={-1}
                    data-link
                    data-link-status={link.status}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3.5 py-3 focus:outline-none"
                  >
                    <p
                      className={cn(
                        "col-span-2 min-w-0 font-mono text-xs break-all @d1:col-span-1",
                        link.status === "unused" ? "font-medium text-ink" : "text-ink-muted line-through",
                      )}
                    >
                      <Ltr>
                        {linkBase}
                        {link.code}
                      </Ltr>
                    </p>
                    <Chip tone={statusTone[link.status]} className="justify-self-start @d1:justify-self-end">
                      {statusText[link.status].label}
                    </Chip>
                    <p className="order-last col-span-2 min-w-0 text-xs text-ink-muted @d1:order-none @d1:col-span-1">
                      {statusText[link.status].note}
                    </p>
                    <span className="flex justify-end">
                      {link.status === "unused" && (
                        <Button size="sm" onClick={() => markUsed(link.key)}>
                          {t.simulateUse}
                        </Button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </TabPanel>
      )}

      {view === "library" && (
        <TabPanel idBase={uid} id="library" className="mt-3 @d2:mt-4">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <Kicker>{fill(t.welcome, { name: dict.people.newcomerA })}</Kicker>
              <p className="mt-0.5 text-base font-semibold">{t.library}</p>
            </div>
            <fieldset className="min-w-0">
              <legend className="sr-only">{t.filter}</legend>
              <div className="flex flex-wrap gap-1.5">
                {filters.map((item) => (
                  <Option
                    key={item.id}
                    shape="pill"
                    name={`${uid}-filter`}
                    value={item.id}
                    checked={filter === item.id}
                    onChange={() => setFilter(item.id)}
                    className="min-h-8 py-1"
                  >
                    <span className="text-xs font-medium">{item.label}</span>
                  </Option>
                ))}
              </div>
            </fieldset>
          </div>

          <ul className="mt-3 grid grid-cols-1 gap-2 @d1:grid-cols-2 @d2:gap-3 @d3:grid-cols-3">
            {shown.map((module) => {
              const training = module.category === "training";
              const number = modules.filter((m) => m.category === module.category).indexOf(module) + 1;
              return (
                <li key={module.id} className="flex items-start gap-3 rounded-xl border border-mist bg-surface p-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg text-ink [&>svg]:size-4",
                      training ? "bg-[#dfe1ff]" : "bg-[#d5efec]",
                    )}
                  >
                    {training ? <BookOpen /> : <ClipboardList />}
                  </span>
                  <span className="min-w-0">
                    <Kicker>
                      {training ? t.training : t.visaResources} · {fill(t.moduleNumber, { number })}
                    </Kicker>
                    <span className="mt-0.5 block font-medium">{t.modules[module.id]}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </TabPanel>
      )}
    </DemoShell>
  );
}
