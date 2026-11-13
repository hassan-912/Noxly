/** Synthetic data for the Consultation demo: fictional consultants, bookings, fee and ticket. */
export type ConsultantId = "a" | "b" | "c";
export type DayId = "mon" | "tue" | "wed";
export type BookingStatus = "upcoming" | "checkedIn" | "completed";

export interface Consultant {
  id: ConsultantId;
  name: "consultantA" | "consultantB" | "consultantC";
  specialty: "tourism" | "immigration" | "jobSeeker";
  initial: string;
  /** Avatar background (pastel, decorative). */
  tint: string;
}

export const consultants: Consultant[] = [
  { id: "a", name: "consultantA", specialty: "tourism", initial: "A", tint: "#dfe1ff" },
  { id: "b", name: "consultantB", specialty: "immigration", initial: "B", tint: "#d5efec" },
  { id: "c", name: "consultantC", specialty: "jobSeeker", initial: "C", tint: "#ffe3d3" },
];

export const days: { id: DayId; date: number }[] = [
  { id: "mon", date: 12 },
  { id: "tue", date: 13 },
  { id: "wed", date: 14 },
];

export const times = ["09:30", "11:00", "13:30", "15:00", "16:30"];

/** Slots shown as already taken. */
export const unavailable: Record<DayId, string[]> = {
  mon: ["09:30", "11:00", "15:00"],
  tue: ["09:30"],
  wed: ["13:30", "16:30"],
};

export const initialBooking: { consultant: ConsultantId; day: DayId; time: string } = {
  consultant: "a",
  day: "tue",
  time: "11:00",
};

export const sampleFee = { amount: 500, currency: "EGP" } as const;
export const sampleTicket = { number: "MG-SAMPLE-0042", qrSeed: 42 } as const;

export interface StaffBooking {
  id: string;
  day: DayId;
  time: string;
  customer: "applicantA" | "applicantB" | "applicantC" | "applicantD";
  consultant: ConsultantId;
  status: BookingStatus;
}

export const staffSchedule: StaffBooking[] = [
  { id: "s1", day: "mon", time: "09:30", customer: "applicantB", consultant: "a", status: "completed" },
  { id: "s2", day: "mon", time: "11:00", customer: "applicantC", consultant: "c", status: "checkedIn" },
  { id: "s3", day: "mon", time: "15:00", customer: "applicantD", consultant: "b", status: "upcoming" },
  { id: "s4", day: "tue", time: "09:30", customer: "applicantB", consultant: "b", status: "upcoming" },
];
