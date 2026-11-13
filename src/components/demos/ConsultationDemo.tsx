"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Info, RotateCcw } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  consultants,
  days,
  initialBooking,
  sampleFee,
  sampleTicket,
  staffSchedule,
  times,
  unavailable,
  type BookingStatus,
  type ConsultantId,
  type DayId,
  type StaffBooking,
} from "./data/consultation";
import {
  Button,
  Chip,
  DemoShell,
  Kicker,
  Ltr,
  Option,
  Panel,
  SampleQr,
  Stepper,
  TabPanel,
  Tabs,
  fill,
  formatNumber,
  useFocusAfterUpdate,
  type ChipTone,
  type DemoProps,
} from "./kit";

type View = "customer" | "staff";

const TICKET = 3;
const NEW_BOOKING_ID = "new";

const statusTone: Record<BookingStatus, ChipTone> = {
  upcoming: "accent",
  checkedIn: "positive",
  completed: "neutral",
};

/**
 * Consultation: a customer books (consultant → time → mock payment → QR ticket) and the staff
 * schedule shows the same booking. Nothing is paid and nothing is sent; the ticket is a sample.
 */
export default function ConsultationDemo({ locale }: DemoProps) {
  const dict = getDictionary(locale).demos;
  const t = dict.consultation;
  const uid = useId();
  const focusAfterUpdate = useFocusAfterUpdate();

  const [view, setView] = useState<View>("customer");
  const [step, setStep] = useState(0);
  const [consultantId, setConsultantId] = useState<ConsultantId>(initialBooking.consultant);
  const [day, setDay] = useState<DayId>(initialBooking.day);
  const [time, setTime] = useState(initialBooking.time);
  const [statuses, setStatuses] = useState<Record<string, BookingStatus>>({});

  const consultant = consultants.find((c) => c.id === consultantId)!;
  const steps = [t.stepConsultant, t.stepTime, t.payment, t.stepTicket];
  const headingId = `${uid}-heading`;
  const booked = step === TICKET;

  const when = (d: DayId, at: string) => (
    <>
      {t.days[d]} <Ltr className="font-mono">{days.find((x) => x.id === d)!.date}</Ltr> ·{" "}
      <Ltr className="font-mono">{at}</Ltr>
    </>
  );
  const fee = (
    <Ltr className="font-mono whitespace-nowrap">
      {sampleFee.currency} {formatNumber(sampleFee.amount)}
    </Ltr>
  );

  const go = (to: number) => {
    setStep(to);
    focusAfterUpdate(headingId);
  };
  const chooseDay = (next: DayId) => {
    setDay(next);
    if (unavailable[next].includes(time)) setTime(times.find((slot) => !unavailable[next].includes(slot))!);
  };
  const bookAnother = () => {
    setConsultantId(initialBooking.consultant);
    setDay(initialBooking.day);
    setTime(initialBooking.time);
    setStatuses((current) =>
      Object.fromEntries(Object.entries(current).filter(([id]) => id !== NEW_BOOKING_ID)),
    );
    go(0);
  };

  const schedule: StaffBooking[] = [
    ...staffSchedule,
    ...(booked
      ? [{ id: NEW_BOOKING_ID, day, time, customer: "applicantA" as const, consultant: consultantId, status: "upcoming" as const }]
      : []),
  ].sort((a, b) => days.findIndex((d) => d.id === a.day) - days.findIndex((d) => d.id === b.day) || a.time.localeCompare(b.time));

  const summaryRows: { label: string; value: ReactNode }[] = [
    { label: t.customer, value: dict.people.applicantA },
    { label: t.stepConsultant, value: dict.people[consultant.name] },
    { label: t.stepTime, value: when(day, time) },
    {
      label: t.fee,
      value: (
        <>
          {fee}
          <span className="block text-xs font-normal text-ink-muted">{t.sampleFee}</span>
        </>
      ),
    },
  ];
  const summary = (
    <dl className="divide-y divide-mist">
      {summaryRows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-3 py-2">
          <dt className="shrink-0 text-xs text-ink-muted">{row.label}</dt>
          <dd className="text-end font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <DemoShell id="consultation" locale={locale} title={t.title} icon={<CalendarCheck />}>
      <Tabs
        idBase={uid}
        label={dict.common.views}
        value={view}
        onChange={setView}
        items={[
          { id: "customer", label: t.customerView },
          { id: "staff", label: t.staffView },
        ]}
        className="@d1:w-fit @d1:[&>button]:px-4 @d1:[&>button]:whitespace-nowrap"
      />

      {view === "customer" && (
        <TabPanel idBase={uid} id="customer" className="mt-3 @d2:mt-4">
          <div className="grid grid-cols-1 items-start gap-3 @d2:grid-cols-[minmax(0,1fr)_16rem] @d2:gap-4 @d3:grid-cols-[minmax(0,1fr)_19rem]">
            <Panel className="p-3.5 @d1:p-5">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <Stepper steps={steps} current={step} label={t.title} />
                <Kicker>{fill(dict.common.step, { current: step + 1, total: steps.length })}</Kicker>
              </div>

              {step < TICKET ? (
                <form
                  className="mt-4 @d1:mt-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    go(step + 1);
                  }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend id={headingId} tabIndex={-1} className="text-[0.9375rem] font-semibold focus:outline-none">
                        {t.chooseConsultant}
                      </legend>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {consultants.map((c) => (
                          <Option
                            key={c.id}
                            name={`${uid}-consultant`}
                            value={c.id}
                            checked={consultantId === c.id}
                            onChange={() => setConsultantId(c.id)}
                          >
                            <span
                              aria-hidden="true"
                              style={{ backgroundColor: c.tint }}
                              className="grid size-9 shrink-0 place-items-center rounded-full font-mono text-sm font-medium text-ink"
                            >
                              {c.initial}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium">{dict.people[c.name]}</span>
                              <span className="block text-xs text-ink-muted">{t.specialties[c.specialty]}</span>
                            </span>
                          </Option>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <p id={headingId} tabIndex={-1} className="text-[0.9375rem] font-semibold focus:outline-none">
                        {t.chooseSlot}
                      </p>
                      <fieldset>
                        <legend className="demo-kicker text-ink-muted">{t.day}</legend>
                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                          {days.map((d) => (
                            <Option
                              key={d.id}
                              shape="pill"
                              name={`${uid}-day`}
                              value={d.id}
                              checked={day === d.id}
                              onChange={() => chooseDay(d.id)}
                              className="rounded-xl"
                            >
                              <span className="font-medium">
                                {t.days[d.id]} <Ltr className="font-mono">{d.date}</Ltr>
                              </span>
                            </Option>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="demo-kicker text-ink-muted">{t.stepTime}</legend>
                        <div className="mt-1.5 grid grid-cols-3 gap-2 @d1:grid-cols-5">
                          {times.map((slot) => {
                            const taken = unavailable[day].includes(slot);
                            return (
                              <Option
                                key={slot}
                                shape="pill"
                                name={`${uid}-time`}
                                value={slot}
                                checked={time === slot}
                                onChange={() => setTime(slot)}
                                disabled={taken}
                                className="rounded-xl"
                              >
                                <Ltr className={cn("font-mono font-medium", taken && "line-through")}>{slot}</Ltr>
                                {taken && <span className="sr-only">{t.unavailable}</span>}
                              </Option>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p id={headingId} tabIndex={-1} className="text-[0.9375rem] font-semibold focus:outline-none">
                        {t.payment}
                      </p>
                      <p className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-slate bg-frost p-3 font-medium">
                        <Info aria-hidden="true" className="mt-px size-4 shrink-0 text-ink-muted" />
                        {t.paymentMock}
                      </p>
                      <div className="mt-3 @d2:hidden">{summary}</div>
                      <p className="mt-3 hidden items-baseline justify-between gap-3 @d2:flex">
                        <span className="text-ink-muted">{t.fee}</span>
                        <span className="text-base font-semibold">{fee}</span>
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-mist pt-3.5">
                    {step > 0 ? (
                      <Button onClick={() => go(step - 1)}>
                        <ArrowLeft aria-hidden="true" className="rtl:-scale-x-100" />
                        {dict.common.back}
                      </Button>
                    ) : (
                      <span />
                    )}
                    <Button type="submit" variant="primary">
                      {step === 2 ? t.confirm : dict.common.next}
                      {step < 2 && <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 @d1:mt-5">
                  <div className="mx-auto max-w-[26rem] overflow-hidden rounded-2xl border border-mist bg-surface shadow-[0_18px_40px_-24px_rgb(14_26_36/0.35)]">
                    <div className="flex flex-col items-center gap-3 p-4 @d1:flex-row @d1:items-center @d1:gap-4">
                      <div className="shrink-0 rounded-xl border border-mist p-2">
                        <SampleQr seed={sampleTicket.qrSeed} className="size-28" />
                      </div>
                      <div className="min-w-0 text-center @d1:text-start">
                        <p id={headingId} tabIndex={-1} className="text-base font-semibold focus:outline-none">
                          {t.ticket}
                        </p>
                        <p className="mt-1 font-medium">{dict.people.applicantA}</p>
                        <p className="text-ink-muted">{dict.people[consultant.name]}</p>
                        <p className="mt-1 font-medium">{when(day, time)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-dashed border-mist bg-frost/70 px-4 py-2.5">
                      <span className="text-xs text-ink-muted">{t.ticketNumber}</span>
                      <Ltr className="font-mono text-xs font-medium">{sampleTicket.number}</Ltr>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs text-ink-muted">{t.ticketNote}</p>
                  <div className="mt-4 flex justify-end border-t border-mist pt-3.5">
                    <Button onClick={bookAnother}>
                      <RotateCcw aria-hidden="true" />
                      {t.bookAnother}
                    </Button>
                  </div>
                </div>
              )}
            </Panel>

            <Panel className="hidden p-3.5 @d2:block">
              <Kicker>{t.summary}</Kicker>
              <div className="mt-1">{summary}</div>
            </Panel>
          </div>
        </TabPanel>
      )}

      {view === "staff" && (
        <TabPanel idBase={uid} id="staff" className="mt-3 @d2:mt-4">
          <Panel className="overflow-hidden">
            <ul className="divide-y divide-mist">
              {schedule.map((booking) => {
                const status = statuses[booking.id] ?? booking.status;
                const isNew = booking.id === NEW_BOOKING_ID;
                const statusLabel = {
                  upcoming: t.statusUpcoming,
                  checkedIn: t.statusCheckedIn,
                  completed: t.statusCompleted,
                }[status];
                return (
                  <li
                    key={booking.id}
                    id={`${uid}-booking-${booking.id}`}
                    tabIndex={-1}
                    data-booking={isNew ? "new" : "sample"}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5 focus:outline-none @d2:min-h-13 @d2:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1fr)_9rem_6.5rem]",
                      isNew && "bg-[#f5f5ff]",
                    )}
                  >
                    <span className="font-medium">{when(booking.day, booking.time)}</span>
                    <span className="col-start-1 row-start-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 @d2:col-start-auto @d2:row-start-auto">
                      <span className="font-medium">{dict.people[booking.customer]}</span>
                      {isNew && (
                        <Chip tone="accent" dot={false}>
                          {t.newBooking}
                        </Chip>
                      )}
                    </span>
                    <span className="col-start-1 row-start-3 text-xs text-ink-muted @d2:col-start-auto @d2:row-start-auto @d2:text-[0.8125rem]">
                      {dict.people[consultants.find((c) => c.id === booking.consultant)!.name]}
                    </span>
                    <span className="col-start-2 row-start-1 flex justify-end @d2:col-start-auto @d2:row-start-auto @d2:justify-start">
                      <Chip tone={statusTone[status]}>{statusLabel}</Chip>
                    </span>
                    <span className="col-start-2 row-span-2 row-start-2 flex justify-end self-end @d2:col-start-auto @d2:row-span-1 @d2:row-start-auto @d2:self-auto">
                      {status === "upcoming" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setStatuses((current) => ({ ...current, [booking.id]: "checkedIn" }));
                            focusAfterUpdate(`${uid}-booking-${booking.id}`);
                          }}
                        >
                          {t.checkIn}
                        </Button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </TabPanel>
      )}
    </DemoShell>
  );
}
