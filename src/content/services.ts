import { untranslated, type Localized } from "./types";

export interface ServiceOutcome {
  id: "full-stack" | "dashboards" | "integrations" | "automation" | "maintenance";
  title: Localized<string>;
  body: Localized<string>;
}

export interface ServiceStep {
  id: "understand" | "build" | "improve";
  title: Localized<string>;
  body: Localized<string>;
}

/** TODO(task 11): replace each `untranslated(...)` with real de/fr/ar text. */
export const services: { outcomes: ServiceOutcome[]; steps: ServiceStep[] } = {
  outcomes: [
    {
      id: "full-stack",
      title: untranslated("Full-stack applications"),
      body: untranslated(
        "Complete web applications, from the interface people use to the data and services behind it.",
      ),
    },
    {
      id: "dashboards",
      title: untranslated("Dashboards and internal tools"),
      body: untranslated("Tools that give your team a clear view of the work and fewer steps to get it done."),
    },
    {
      id: "integrations",
      title: untranslated("API integrations"),
      body: untranslated(
        "Connect the services you already rely on, like payments, email, and data lookups, so information moves without copy and paste.",
      ),
    },
    {
      id: "automation",
      title: untranslated("Workflow automation"),
      body: untranslated("Turn repetitive checks, reminders, and handoffs into steps that run on their own."),
    },
    {
      id: "maintenance",
      title: untranslated("Maintenance and ongoing improvement"),
      body: untranslated("Keep what you've built working well, and keep improving it as your needs change."),
    },
  ],
  steps: [
    {
      id: "understand",
      title: untranslated("Understand the workflow"),
      body: untranslated(
        "I start with the people doing the work: what they do, where it slows down, and what would actually help.",
      ),
    },
    {
      id: "build",
      title: untranslated("Build the solution"),
      body: untranslated("I design and build a focused tool around that workflow, and share progress as it takes shape."),
    },
    {
      id: "improve",
      title: untranslated("Improve it after delivery"),
      body: untranslated("Launch is a beginning. I keep refining the tool as real use shows what matters next."),
    },
  ],
};
