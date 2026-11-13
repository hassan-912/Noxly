import { untranslated, type Localized, type TechId } from "./types";

export interface DiagramNode {
  id: string;
  label: Localized<string>;
  tech: TechId[];
  explain: Localized<string>;
  col: number;
  row: number;
}

/**
 * A connection from one step to the next. The optional label names what passes along it, only
 * where docs/brief.md says so; most connections are unlabeled.
 */
export type DiagramEdge = [from: string, to: string, label?: Localized<string>];

export interface Diagram {
  project: "review" | "consultation" | "calculator" | "mg-mobile";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const node = (
  id: string, col: number, row: number, label: string, tech: TechId[], explain: string,
): DiagramNode => ({ id, col, row, tech, label: untranslated(label), explain: untranslated(explain) });

/**
 * One view per project, following the brief's four pipelines. Each project has its own shape;
 * nothing here implies a shared architecture. `col` is the step along the flow, `row` the lane.
 * TODO(task 11): replace each `untranslated(...)` (inside `node`, and on edge labels) with real
 * de/fr/ar text.
 */
export const diagrams: Diagram[] = [
  {
    // documents → Python/PDF/OCR processing → factual checks and selected Gemini review → evidence/report
    project: "review",
    nodes: [
      node("documents", 0, 0, "Visa documents", [],
        "The documents in a visa file, uploaded for review."),
      node("processing", 1, 0, "Document processing", ["python", "pymupdf", "ocr", "pydantic"],
        "Python reads each document with PyMuPDF and OCR, then structures the extracted details with Pydantic."),
      node("checks", 2, 0, "Factual checks", ["python"],
        "Deterministic rules compare the same facts across documents and record where each value was found."),
      node("ai-review", 2, 1, "AI-assisted review", ["gemini"],
        "Google Gemini is used only for selected narrative checks. The factual comparisons don't depend on it."),
      node("report", 3, 0, "Evidence and report", ["streamlit", "pdf-reporting"],
        "Findings appear in Streamlit next to their source evidence and can be exported as a PDF report."),
    ],
    edges: [
      ["documents", "processing"],
      ["processing", "checks"],
      // Brief: "uses AI for selected narrative checks".
      ["processing", "ai-review", untranslated("Selected narrative checks")],
      ["checks", "report"],
      ["ai-review", "report"],
    ],
  },
  {
    // React interface → Supabase services → database/storage → payment/email integrations
    project: "consultation",
    nodes: [
      node("interface", 0, 0, "React interface", ["react", "typescript", "vite", "zustand", "tailwind"],
        "Customers book consultations and staff manage their work in a React app built with Vite."),
      node("services", 1, 0, "Supabase services", ["supabase", "supabase-auth", "supabase-edge-functions"],
        "Supabase Auth handles sign-in, and Edge Functions run the server-side steps."),
      node("data", 2, 0, "Database and storage", ["postgresql", "supabase-storage"],
        "A PostgreSQL database holds the platform's data, and Supabase Storage keeps its files."),
      node("integrations", 3, 0, "Payments and email", ["easykash", "resend"],
        "The platform integrates EasyKash for payment workflows and Resend for email."),
    ],
    edges: [
      ["interface", "services"],
      ["services", "data"],
      ["data", "integrations"],
    ],
  },
  {
    // Next.js interface → browser scoring → external lookups → report
    project: "calculator",
    nodes: [
      node("interface", 0, 0, "Next.js interface", ["nextjs", "react", "typescript", "tailwind"],
        "Questionnaires for tourism, immigration, and job-seeker pathways."),
      node("scoring", 1, 0, "Browser scoring", ["typescript"],
        "Answers are scored in the browser and organized into a structured assessment."),
      node("anabin", 2, 0, "Anabin lookups", ["anabin"],
        "Qualifications can be looked up in the Anabin database."),
      node("rates", 2, 1, "Exchange rates", ["exchangerate-api"],
        "Funding checks convert amounts with ExchangeRate-API."),
      node("report", 3, 0, "Assessment report", [],
        "A report of the preliminary MG assessment. It is not an official eligibility decision."),
    ],
    edges: [
      ["interface", "scoring"],
      ["scoring", "anabin"],
      // Brief: "funding checks".
      ["scoring", "rates", untranslated("Funding checks")],
      ["anabin", "report"],
      ["rates", "report"],
    ],
  },
  {
    // Flutter → shared Supabase services → consultations, tickets, staff workflows
    project: "mg-mobile",
    nodes: [
      node("app", 0, 1, "Flutter app", ["flutter", "dart", "riverpod", "gorouter", "dio"],
        "Built with Flutter and Dart, using Riverpod for state, GoRouter for navigation, and Dio for networking. In development."),
      node("services", 1, 1, "Shared Supabase services", ["supabase"],
        "The same Supabase services the Consultation platform uses. There is no separate backend."),
      node("consultations", 2, 0, "Consultations", [],
        "Upcoming consultations, in Arabic or English."),
      node("tickets", 2, 1, "Tickets", [],
        "Tickets for booked consultations."),
      node("staff", 2, 2, "Staff workflows", [],
        "Views for staff to handle their part of the work."),
    ],
    edges: [
      ["app", "services"],
      ["services", "consultations"],
      ["services", "tickets"],
      ["services", "staff"],
    ],
  },
];
