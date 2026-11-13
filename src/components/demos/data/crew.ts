/** Synthetic data for the Crew-MG demo. `.example` is a reserved domain: these links go nowhere. */
export type LinkStatus = "unused" | "used" | "expired";
export type ModuleCategory = "training" | "visa";
export type ModuleId =
  | "gettingStarted"
  | "communication"
  | "internalTools"
  | "tourismChecklist"
  | "businessChecklist"
  | "followUp";

export const linkBase = "crew-mg.example/join/";

/** Codes handed out in order by "Generate one-time link" (made up, not tokens of anything). */
export const sampleCodes = ["7F3K-Q2M9", "X8PL-4TNA", "B6WD-9HRC", "M2ZV-5KJE", "R4GY-8SUD"];

export const seedLinks: { code: string; status: LinkStatus }[] = [{ code: "A1CE-0LD0", status: "expired" }];

/** How many links the list keeps. */
export const maxLinks = 4;

export const modules: { id: ModuleId; category: ModuleCategory }[] = [
  { id: "gettingStarted", category: "training" },
  { id: "communication", category: "training" },
  { id: "internalTools", category: "training" },
  { id: "tourismChecklist", category: "visa" },
  { id: "businessChecklist", category: "visa" },
  { id: "followUp", category: "visa" },
];
