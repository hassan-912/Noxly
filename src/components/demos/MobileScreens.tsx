"use client";

import { useId, useState, type ReactNode } from "react";
import { CalendarCheck, Check, ClipboardList, House, ScanLine, Smartphone, Ticket } from "lucide-react";
import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  assessmentDone,
  assessmentSteps,
  clock,
  mobileLangs,
  mobileScreens,
  nextConsultation,
  staffRows,
  ticket,
  type MobileLang,
  type MobileScreen,
} from "./data/mobile";
import { Chip, DemoShell, Ltr, Option, SampleQr, TabPanel, Tabs, fill, type DemoProps } from "./kit";

type Strings = ReturnType<typeof getDictionary>["demos"];

/**
 * One illustrative MG Mobile screen in a phone frame. `lang` is the language of the app screen
 * (Arabic runs right to left inside the phone, whatever the page's direction); `locale` is the
 * page's locale and only names the picture for assistive tech. There are no real screens to
 * match yet: the app is in development, so these are invented and labelled as illustrative.
 */
export function MobileScreens({
  locale,
  screen = "home",
  lang,
  className,
}: {
  locale: Locale;
  screen?: MobileScreen;
  lang: MobileLang;
  className?: string;
}) {
  const page = getDictionary(locale);
  const dict = getDictionary(lang).demos;
  const t = dict.mobile;
  const isStaff = screen === "staff";
  const tabs: { id: string; label: string; icon: ReactNode; active: boolean }[] = isStaff
    ? [
        { id: "schedule", label: t.schedule, icon: <CalendarCheck />, active: true },
        { id: "scan", label: t.scan, icon: <ScanLine />, active: false },
      ]
    : [
        { id: "home", label: t.home, icon: <House />, active: screen === "home" },
        { id: "assessment", label: t.assessment, icon: <ClipboardList />, active: screen === "assessment" },
        { id: "ticket", label: t.ticket, icon: <Ticket />, active: screen === "ticket" },
      ];

  return (
    <figure
      data-phone
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      role="img"
      aria-label={`${page.demos.mobile.screensLabel}: ${page.demos.mobile[screen]} (${page.language[lang]})`}
      className={cn("demo-phone", className)}
    >
      <div className="demo-phone__body">
        {/* Status bar */}
        <div className="relative flex shrink-0 items-center justify-between px-5 pt-2.5 pb-1.5">
          <Ltr className="mp-t2 font-mono font-medium">{clock}</Ltr>
          <span className="absolute inset-x-0 top-2 mx-auto h-4.5 w-18 rounded-full bg-ink" />
          <span className="flex items-center gap-1">
            <span className="h-2 w-3.5 rounded-[calc(var(--u)*2)] bg-ink/80" />
            <span className="size-2 rounded-full bg-ink/80" />
          </span>
        </div>

        <div data-screen={screen} className="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-3">
          {screen === "home" && <HomeScreen dict={dict} />}
          {screen === "assessment" && <AssessmentScreen dict={dict} />}
          {screen === "ticket" && <TicketScreen dict={dict} />}
          {screen === "staff" && <StaffScreen dict={dict} />}
        </div>

        {/* Tab bar */}
        <div className="flex shrink-0 border-t border-mist bg-surface px-2 pt-2 pb-4">
          {tabs.map((tab) => (
            <span
              key={tab.id}
              className={cn(
                "mp-t1 flex min-w-0 flex-1 flex-col items-center gap-1 font-medium [&>svg]:size-4.5",
                tab.active ? "text-indigo" : "text-ink-muted",
              )}
            >
              {tab.icon}
              <span className="max-w-full truncate">{tab.label}</span>
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mp-r2 border border-mist bg-surface p-3", className)}>{children}</div>;
}

function Pill({ tone, children }: { tone: "indigo" | "ink" | "outline"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "mp-t2 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 font-medium [&>svg]:size-3.5",
        tone === "indigo" && "bg-indigo text-surface",
        tone === "ink" && "bg-ink text-surface",
        tone === "outline" && "border border-mist bg-surface text-ink",
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < done ? "bg-indigo" : "bg-mist")} />
      ))}
    </span>
  );
}

function HomeScreen({ dict }: { dict: Strings }) {
  const t = dict.mobile;
  return (
    <>
      <div>
        <p className="mp-t2 text-ink-muted">{t.appName}</p>
        <p className="mp-t4 font-semibold">{fill(t.greeting, { name: dict.people.applicantA })}</p>
      </div>
      <div className="mp-r2 bg-ink p-3.5 text-surface">
        <p className="mp-t1 font-medium text-mist">{t.nextConsultation}</p>
        <p className="mp-t5 mt-1 leading-tight font-semibold">
          {t.sampleDate} · <Ltr className="font-mono">{nextConsultation.time}</Ltr>
        </p>
        <p className="mp-t2 mt-0.5 text-mist">
          {fill(t.withConsultant, { name: dict.people[nextConsultation.consultant] })}
        </p>
        <span className="mp-t2 mt-3 flex items-center justify-center gap-1.5 rounded-full bg-surface px-3 py-2 font-medium text-ink [&>svg]:size-3.5">
          <Ticket />
          {t.viewTicket}
        </span>
      </div>
      <Card>
        <div className="flex items-baseline justify-between gap-2">
          <p className="mp-t3 font-semibold">{t.assessment}</p>
          <p className="mp-t1 text-ink-muted">
            {t.progress} ·{" "}
            <Ltr className="font-mono">
              {assessmentDone}/{assessmentSteps.length}
            </Ltr>
          </p>
        </div>
        <div className="mt-2.5">
          <ProgressBar done={assessmentDone} total={assessmentSteps.length} />
        </div>
        <p className="mp-t2 mt-2 text-ink-muted">{t.steps[assessmentSteps[assessmentDone]]}</p>
      </Card>
      <Card className="flex items-center gap-3">
        <span className="mp-r1 grid size-9 shrink-0 place-items-center bg-[#ecedff] text-indigo [&>svg]:size-4.5">
          <Ticket />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mp-t3 block font-semibold">{t.ticketTitle}</span>
          <span className="mp-t1 block text-ink-muted">
            <Ltr className="font-mono">{ticket.number}</Ltr>
          </span>
        </span>
      </Card>
    </>
  );
}

function AssessmentScreen({ dict }: { dict: Strings }) {
  const t = dict.mobile;
  return (
    <>
      <div>
        <p className="mp-t4 font-semibold">{t.assessment}</p>
        <p className="mp-t2 text-ink-muted">
          {t.progress} · {fill(t.step, { current: assessmentDone + 1, total: assessmentSteps.length })}
        </p>
      </div>
      <ProgressBar done={assessmentDone} total={assessmentSteps.length} />
      <Card className="p-0">
        {assessmentSteps.map((step, i) => {
          const done = i < assessmentDone;
          const current = i === assessmentDone;
          return (
            <div key={step} className={cn("flex items-center gap-2.5 px-3 py-2.5", i > 0 && "border-t border-mist")}>
              <span
                className={cn(
                  "mp-t1 grid size-5 shrink-0 place-items-center rounded-full font-mono font-medium",
                  done && "bg-[#e2f4f1] text-teal-text",
                  current && "bg-indigo text-surface",
                  !done && !current && "border border-mist text-ink-muted",
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("mp-t3", current ? "font-semibold" : done ? "text-ink" : "text-ink-muted")}>
                {t.steps[step]}
              </span>
            </div>
          );
        })}
      </Card>
      <Pill tone="indigo">{t.continue}</Pill>
    </>
  );
}

function TicketScreen({ dict }: { dict: Strings }) {
  const t = dict.mobile;
  return (
    <>
      <p className="mp-t4 font-semibold">{t.ticketTitle}</p>
      <Card className="flex flex-col items-center p-4 text-center">
        <div className="mp-r1 border border-mist p-2">
          <SampleQr seed={ticket.qrSeed} className="size-30" />
        </div>
        <p className="mp-t3 mt-3 font-semibold">{dict.people.applicantA}</p>
        <p className="mp-t2 text-ink-muted">
          {t.sampleDate} · <Ltr className="font-mono">{nextConsultation.time}</Ltr>
        </p>
        <p className="mp-t2 text-ink-muted">
          {fill(t.withConsultant, { name: dict.people[nextConsultation.consultant] })}
        </p>
        <div className="mt-3 w-full border-t border-dashed border-mist pt-2.5">
          <Ltr className="mp-t1 font-mono font-medium">{ticket.number}</Ltr>
          <p className="mp-t1 mt-0.5 text-ink-muted">{t.ticketNote}</p>
        </div>
      </Card>
    </>
  );
}

function StaffScreen({ dict }: { dict: Strings }) {
  const t = dict.mobile;
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="mp-t4 font-semibold">{t.todaySchedule}</p>
        <span className="mp-t1 rounded-full bg-[#ecedff] px-2 py-0.5 font-medium">{t.staff}</span>
      </div>
      <Card className="p-0">
        {staffRows.map((row, i) => (
          <div key={row.time} className={cn("flex items-center gap-2.5 px-3 py-2.5", i > 0 && "border-t border-mist")}>
            <Ltr className="mp-t2 shrink-0 font-mono font-medium">{row.time}</Ltr>
            <span className="min-w-0 flex-1">
              <span className="mp-t2 block truncate font-medium">{dict.people[row.customer]}</span>
              <span className="mp-t1 flex items-center gap-1 text-ink-muted">
                <span
                  className={cn("size-1.5 shrink-0 rounded-full", row.status === "checkedIn" ? "bg-teal-text" : "bg-indigo")}
                />
                {row.status === "checkedIn" ? t.statusCheckedIn : t.statusUpcoming}
              </span>
            </span>
          </div>
        ))}
      </Card>
      <Pill tone="ink">
        <ScanLine />
        {t.scan}
      </Pill>
    </>
  );
}

/**
 * The MG Mobile entry of the demo registry: the four screens, in English and Arabic side by
 * side. In a phone-width frame one phone shows at a time, with a language switch.
 */
export default function MobileDemo({ locale }: DemoProps) {
  const all = getDictionary(locale);
  const t = all.demos.mobile;
  const uid = useId();
  const [screen, setScreen] = useState<MobileScreen>("home");
  const [lang, setLang] = useState<MobileLang>(locale === "ar" ? "ar" : "en");

  return (
    <DemoShell
      id="mg-mobile"
      locale={locale}
      title={t.title}
      icon={<Smartphone />}
      aside={<Chip tone="accent">{all.building.mobileStatus}</Chip>}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <Tabs
          idBase={uid}
          label={t.screenTabs}
          value={screen}
          onChange={setScreen}
          items={mobileScreens.map((id) => ({ id, label: t[id] }))}
          className="w-full @d2:w-fit @d2:[&>button]:px-4 [&>button]:px-1.5 [&>button]:whitespace-nowrap"
        />
        <fieldset className="@d1:hidden">
          <legend className="sr-only">{t.language}</legend>
          <div className="flex gap-1.5">
            {mobileLangs.map((id) => (
              <Option
                key={id}
                shape="pill"
                name={`${uid}-lang`}
                value={id}
                checked={lang === id}
                onChange={() => setLang(id)}
                className="min-h-8 py-1"
              >
                <span lang={id} className="text-xs font-medium">
                  {all.language[id]}
                </span>
              </Option>
            ))}
          </div>
        </fieldset>
      </div>

      <TabPanel idBase={uid} id={screen} focusable className="mt-4 @d2:mt-6">
        <div className="flex justify-center gap-6 pb-4 @d2:gap-12 @d2:pb-6">
          {mobileLangs.map((id) => (
            <div
              key={id}
              className={cn("w-full max-w-[15rem] min-w-0 flex-col items-center gap-3", lang === id ? "flex" : "hidden @d1:flex")}
            >
              <MobileScreens locale={locale} lang={id} screen={screen} />
              <p lang={id} aria-hidden="true" className="demo-kicker hidden text-ink-muted @d1:block">
                {all.language[id]}
              </p>
            </div>
          ))}
        </div>
      </TabPanel>
    </DemoShell>
  );
}
