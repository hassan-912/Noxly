/** Synthetic data for the illustrative MG Mobile screens. Times and codes are Latin in every locale. */
export type MobileScreen = "home" | "assessment" | "ticket" | "staff";
export type MobileLang = "en" | "ar";
export type AssessmentStep = "pathway" | "details" | "funding" | "review";

export const mobileScreens: MobileScreen[] = ["home", "assessment", "ticket", "staff"];
export const mobileLangs: MobileLang[] = ["en", "ar"];

export const clock = "9:41";
export const nextConsultation = { time: "11:00", consultant: "consultantB" } as const;

export const assessmentSteps: AssessmentStep[] = ["pathway", "details", "funding", "review"];
/** Steps already completed; the next one is the current step. */
export const assessmentDone = 2;

export const ticket = { number: "MG-SAMPLE-0042", qrSeed: 42 } as const;

export const staffRows: {
  time: string;
  customer: "applicantA" | "applicantB" | "applicantC" | "applicantD";
  status: "checkedIn" | "upcoming";
}[] = [
  { time: "09:30", customer: "applicantB", status: "checkedIn" },
  { time: "11:00", customer: "applicantA", status: "upcoming" },
  { time: "13:30", customer: "applicantC", status: "upcoming" },
  { time: "15:00", customer: "applicantD", status: "upcoming" },
];
