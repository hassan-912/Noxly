import { untranslated, type Project } from "./types";

/**
 * Every project on the site. Facts come only from docs/brief.md and the design spec.
 * Pitches and the Crew-MG paragraph are the brief's wording, verbatim.
 * TODO(task 11): replace each `untranslated(...)` with real de/fr/ar text.
 */
export const projects: Project[] = [
  {
    slug: "review",
    tier: "featured",
    order: 1,
    repo: "https://github.com/hassan-912/Review-Project",
    liveUrl: null,
    embeddable: false,
    demo: "review",
    stack: ["python", "streamlit", "pydantic", "supabase", "pymupdf", "ocr", "pdf-reporting", "gemini"],
    status: ["internal-tool"],
    authorship: { kind: "solo" },
    caseStudy: true,
    text: untranslated({
      name: "MG Visa Document Review",
      pitch: "Make every detail easier to check.",
      summary:
        "A document-review tool that compares information across visa documents, surfaces discrepancies with source evidence, and uses AI for selected narrative checks.",
      problem:
        "A visa file brings together many documents, and the same details have to agree across all of them. Checking that by hand is slow, repetitive work, and a mismatch is easy to miss.",
      contribution:
        "I designed and built it on my own: the document processing, the factual comparisons, the AI-assisted checks, and the reports.",
      approach:
        "Documents are read with PyMuPDF and OCR, then structured with Pydantic. Deterministic checks compare the facts across documents and link every finding to its source. Google Gemini is used only for selected narrative checks, and its results stay separate from the factual comparisons. Reviewers work in a Streamlit interface and can export the findings as a PDF report.",
      features: [
        "Document processing with PyMuPDF and OCR",
        "Factual comparisons across documents",
        "Findings backed by evidence from the source document",
        "AI-assisted review for selected narrative checks, kept apart from the deterministic checks",
        "Clear PDF reports of the findings",
      ],
      outcomes: [
        "Reviewers see each discrepancy next to the source text it came from.",
        "Factual checks and AI-assisted checks are labelled separately, so it's always clear where a finding came from.",
        "A file's findings can be shared as one clear report.",
      ],
    }),
  },
  {
    slug: "calculator",
    tier: "featured",
    order: 2,
    repo: "https://github.com/hassan-912/Visa-File-Strength-Calculator",
    liveUrl: null,
    embeddable: false,
    demo: "calculator",
    stack: ["typescript", "nextjs", "react", "tailwind", "exchangerate-api", "anabin"],
    status: ["internal-tool"],
    authorship: { kind: "solo" },
    caseStudy: true,
    text: untranslated({
      name: "MG Visa Calculator",
      pitch: "Turn complicated questions into a clearer starting point.",
      summary:
        "Assessment tools for tourism, immigration, and job-seeker pathways, organizing answers into structured assessments, funding checks, and reports.",
      problem:
        "Questions about a visa pathway are rarely simple, and answers gathered in conversation are hard to compare. A consistent, structured first look makes the next conversation more useful.",
      contribution:
        "I designed and built it on my own: the questionnaires for each pathway, the scoring, the funding checks, and the reports.",
      approach:
        "Built with Next.js, React, and TypeScript. Answers are scored in the browser into a structured assessment. Funding checks convert amounts with ExchangeRate-API, and qualifications can be looked up in Anabin. Every result is a preliminary MG assessment, not an official eligibility decision.",
      features: [
        "Separate assessments for tourism, immigration, and job-seeker pathways",
        "Structured questionnaires that organize every answer",
        "Funding checks with currency conversion through ExchangeRate-API",
        "Anabin lookups for qualifications",
        "Reports that present the result as a preliminary MG assessment",
      ],
      outcomes: [
        "Every assessment follows the same structure, whoever fills it in.",
        "Funding amounts are converted automatically instead of by hand.",
        "Each result is clearly framed as a preliminary MG assessment, not an official eligibility decision.",
      ],
    }),
  },
  {
    slug: "consultation",
    tier: "featured",
    order: 3,
    repo: "https://github.com/hassan-912/consultatioin",
    // Live, but sends X-Frame-Options: DENY, so it is linked externally and never embedded.
    liveUrl: "https://consultatioin.vercel.app",
    embeddable: false,
    demo: "consultation",
    stack: [
      "typescript", "react", "vite", "tailwind", "zustand", "framer-motion", "supabase", "postgresql",
      "supabase-auth", "supabase-storage", "supabase-edge-functions", "easykash", "resend",
    ],
    status: ["public-site"],
    authorship: { kind: "solo" },
    caseStudy: true,
    text: untranslated({
      name: "MG Consultation",
      pitch: "A clearer journey from first booking to follow-up.",
      summary:
        "A platform connecting customer bookings with consultant schedules, payment workflows, QR tickets, assessments, and role-specific staff operations.",
      problem:
        "A consultation involves several people: a customer booking a time, a consultant managing a schedule, and staff handling payments and follow-up. When those steps live in different places, details get lost between them.",
      contribution:
        "I designed and built it on my own: the customer booking journey, the staff tools for each role, and the integrations behind them.",
      approach:
        "A React and TypeScript front end built with Vite, using Zustand for state and Framer Motion for transitions. Supabase provides the PostgreSQL database, authentication, storage, and Edge Functions. The platform integrates EasyKash for payment workflows and Resend for email.",
      features: [
        "Bookings connected to consultant schedules",
        "Payment workflows through EasyKash",
        "QR tickets for booked consultations",
        "Assessments as part of the consultation journey",
        "Role-specific views for staff operations",
        "Email through Resend",
      ],
      outcomes: [
        "Customer bookings and consultant schedules live in one system.",
        "Each booking leads to a QR ticket.",
        "Staff work from views built for their own role.",
      ],
    }),
  },
  {
    slug: "mg-mobile",
    tier: "in-development",
    order: 4,
    repo: null,
    liveUrl: null,
    embeddable: false,
    demo: "mg-mobile",
    stack: ["flutter", "dart", "riverpod", "gorouter", "dio", "supabase"],
    status: ["in-development", "not-released"],
    authorship: { kind: "solo" },
    caseStudy: true,
    text: untranslated({
      name: "MG Mobile",
      pitch: "Bringing the MG experience into your hand.",
      summary:
        "A mobile application connecting consultations, assessments, tickets, and staff workflows, with Arabic and English experiences. It's in development and hasn't been released.",
      problem:
        "Customers and staff move between consultations, assessments, and tickets. A mobile app can bring those steps together, in Arabic or English.",
      contribution:
        "I'm designing and building it on my own, on top of the Consultation project's shared Supabase services.",
      approach:
        "Built with Flutter and Dart, using Riverpod for state, GoRouter for navigation, and Dio for networking. It works from the Consultation project's shared Supabase services instead of a separate backend.",
      features: [
        "Consultations",
        "Assessments",
        "Tickets",
        "Staff workflows",
        "Arabic and English experiences",
      ],
      outcomes: [
        "The app and the Consultation platform build on the same Supabase services.",
        "Arabic and English are part of the app from the start.",
        "It's still in development, and nothing has been released yet.",
      ],
    }),
  },
  {
    slug: "crew-mg",
    tier: "in-development",
    order: 5,
    repo: "https://github.com/hassan-912/Crew-MG",
    liveUrl: null,
    embeddable: false,
    demo: "crew-mg",
    stack: ["nextjs", "react", "typescript", "tailwind", "supabase", "postgresql"],
    status: ["internal-tool", "in-development"],
    authorship: { kind: "solo" },
    caseStudy: false,
    text: untranslated({
      name: "Crew-MG",
      // The brief's wording, verbatim. Security is an ongoing requirement, never presented as finished.
      pitch: "Company knowledge, with controlled access from the start.",
      summary:
        "I'm developing an internal platform to help the MG team access company training and visa resources. It uses one-time referral links to support controlled onboarding, with access-management features being developed around the company's security needs.",
      features: [
        "One-time referral links for controlled onboarding",
        "Company training and visa resources for the MG team",
        "Access-management features in development",
      ],
    }),
  },
  {
    slug: "mawid",
    tier: "further",
    order: 6,
    repo: "https://github.com/hassan-912/mawe-ed",
    liveUrl: null,
    embeddable: false,
    demo: null,
    stack: ["javascript", "pwa", "cloudflare-workers", "d1", "cron-triggers", "web-push"],
    status: ["personal-project"],
    authorship: { kind: "solo" },
    caseStudy: false,
    text: untranslated({
      name: "Mawid Reminders",
      pitch: "Keep the next important step in sight.",
      summary:
        "A reminder workspace for consultation follow-ups, visa preparation, employee handoffs, and everyday priorities.",
      features: [
        "A JavaScript progressive web app",
        "Runs on Cloudflare Workers with D1 (SQLite)",
        "Scheduled reminders with Cron Triggers",
        "Notifications through Web Push",
      ],
    }),
  },
  {
    slug: "qr-studio",
    tier: "further",
    order: 7,
    repo: "https://github.com/hassan-912/queue-r-code-",
    liveUrl: "https://queue-r-code.vercel.app",
    embeddable: true,
    demo: null,
    stack: ["nextjs", "react", "typescript", "tailwind", "framer-motion", "supabase", "qr-code-styling"],
    status: ["personal-project", "public-site"],
    authorship: { kind: "solo" },
    caseStudy: false,
    text: untranslated({
      name: "QR Studio / Dynamic Bio",
      pitch: "One scan. A more useful connection.",
      summary:
        "Customized QR-code creation and personal link pages, including visual styling, downloadable assets, and engagement tracking.",
      features: [
        "QR codes with custom visual styling",
        "Downloadable QR assets",
        "Personal link pages",
        "Engagement tracking",
      ],
    }),
  },
  {
    slug: "voclio",
    tier: "further",
    order: 8,
    repo: null,
    liveUrl: null,
    embeddable: false,
    demo: null,
    stack: ["nodejs", "typescript", "nextjs", "github", "vercel"],
    status: ["graduation-project", "team-project"],
    authorship: { kind: "shared", note: untranslated("Graduation project with a team of eight") },
    caseStudy: false,
    text: untranslated({
      name: "Voclio",
      pitch: "Exploring voice-to-productivity workflows.",
      summary:
        "A collaborative graduation project developed with an eight-person team, exploring voice-to-productivity workflows.",
      features: [
        "My contributions: authentication, backend APIs, task management, calendar syncing, and focus sessions",
      ],
    }),
  },
  {
    slug: "femine-eg",
    tier: "further",
    order: 9,
    repo: null,
    liveUrl: null,
    embeddable: false,
    demo: null,
    stack: ["shopify"],
    status: ["client-store"],
    authorship: { kind: "solo" },
    caseStudy: false,
    text: untranslated({
      name: "Femine-EG",
      pitch: "A Shopify store, developed and maintained.",
      summary:
        "A Shopify e-commerce store I developed and maintained from March to November 2025, including frontend improvements and issue resolution.",
    }),
  },
  {
    slug: "treasure-hunt",
    tier: "further",
    order: 10,
    repo: null,
    liveUrl: null,
    embeddable: false,
    demo: null,
    stack: ["python"],
    status: ["study-project"],
    authorship: { kind: "solo" },
    caseStudy: false,
    text: untranslated({
      name: "Treasure Hunt AI Game",
      pitch: "Search algorithms, played out on a grid.",
      summary: "A Python project exploring A* and Greedy Search through a grid-based treasure hunt.",
    }),
  },
  {
    slug: "muscle-generator",
    tier: "further",
    order: 11,
    repo: "https://github.com/hassan-912/grow-muscle",
    liveUrl: null,
    embeddable: false,
    demo: null,
    stack: ["javascript", "tailwind"],
    status: ["team-project"],
    authorship: { kind: "shared", note: untranslated("Built with a team") },
    caseStudy: false,
    text: untranslated({
      name: "Muscle Generator",
      pitch: "A fitness website, built as a team.",
      summary: "A fitness website offering workout routines, nutrition information, and training tools.",
    }),
  },
];
