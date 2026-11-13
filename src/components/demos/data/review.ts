/**
 * Synthetic data for the Document review demo. Nothing here comes from a real applicant,
 * company or document: names resolve to "Sample …" strings and numbers are made up.
 */
export type ReviewFieldId =
  | "fullName"
  | "dateOfBirth"
  | "passportNumber"
  | "employer"
  | "monthlySalary"
  | "startDate";

/** A literal (dates, codes, amounts: Latin in every locale) or a fictional name from the dictionary. */
export type ReviewValue = { text: string } | { person: "applicantA" | "company" };

export interface ReviewSource {
  value: ReviewValue;
  page: number;
  line: number;
}

export interface ReviewField {
  id: ReviewFieldId;
  a: ReviewSource;
  b: ReviewSource;
}

export const reviewCase = { id: "MG-0000" } as const;

/** Whether a field matches is never stored: the demo compares the two values itself. */
export const reviewFields: ReviewField[] = [
  {
    id: "fullName",
    a: { value: { person: "applicantA" }, page: 1, line: 2 },
    b: { value: { person: "applicantA" }, page: 1, line: 4 },
  },
  {
    id: "dateOfBirth",
    a: { value: { text: "1990-01-01" }, page: 1, line: 3 },
    b: { value: { text: "1990-01-01" }, page: 1, line: 5 },
  },
  {
    id: "passportNumber",
    a: { value: { text: "SAMPLE-000001" }, page: 1, line: 5 },
    b: { value: { text: "SAMPLE-000001" }, page: 1, line: 6 },
  },
  {
    id: "employer",
    a: { value: { person: "company" }, page: 2, line: 1 },
    b: { value: { person: "company" }, page: 1, line: 1 },
  },
  {
    id: "monthlySalary",
    a: { value: { text: "EGP 28,000" }, page: 2, line: 4 },
    b: { value: { text: "EGP 25,000" }, page: 1, line: 9 },
  },
  {
    id: "startDate",
    a: { value: { text: "2021-03-01" }, page: 2, line: 3 },
    b: { value: { text: "2021-08-01" }, page: 1, line: 8 },
  },
];
