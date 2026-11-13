/**
 * Synthetic data for the Assessment demo. The rate and the daily amounts are fixed sample
 * figures, not live exchange rates and not real visa requirements.
 */
export type Pathway = "tourism" | "immigration" | "jobSeeker";
export type Work = "employed" | "selfEmployed" | "student";
export const pathways: Pathway[] = ["tourism", "immigration", "jobSeeker"];
export const workOptions: Work[] = ["employed", "selfEmployed", "student"];

/** Fixed sample rate: 1 EUR = 50 EGP. Always shown with the "Sample rate" label. */
export const sampleRate = { from: "EUR", to: "EGP", rate: 50 } as const;

/** Sample amount per day of stay, in EUR. */
export const sampleDailyAmount: Record<Pathway, number> = { tourism: 50, immigration: 30, jobSeeker: 35 };

export const stayOptions: Record<Pathway, number[]> = {
  tourism: [7, 14, 30],
  immigration: [30, 90, 180],
  jobSeeker: [30, 90, 180],
};

export const funds = { min: 20000, max: 400000, step: 5000, initial: 120000 } as const;

/** Funding check with the sample figures: required = days × daily amount; available = funds ÷ rate. */
export function fundingCheck(pathway: Pathway, days: number, fundsEgp: number) {
  const requiredEur = days * sampleDailyAmount[pathway];
  const availableEur = Math.floor(fundsEgp / sampleRate.rate);
  return { requiredEur, availableEur, covers: availableEur >= requiredEur };
}
