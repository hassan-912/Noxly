import type { Localized } from "./types";
import { localized } from "./localized";

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

/** Service copy resolves through the checked-in locale maps. */
export const services: { outcomes: ServiceOutcome[]; steps: ServiceStep[] } = {
  outcomes: [
    {
      id: "full-stack",
      title: localized("Full-stack applications"),
      body: localized(
        "Complete web applications, from the interface people use to the data and services behind it.",
      ),
    },
    {
      id: "dashboards",
      title: localized("Dashboards and internal tools"),
      body: localized("Tools that give your team a clear view of the work and fewer steps to get it done."),
    },
    {
      id: "integrations",
      title: localized("API integrations"),
      body: localized(
        "Connect the services you already rely on, like payments, email, and data lookups, so information moves without copy and paste.",
      ),
    },
    {
      id: "automation",
      title: localized("Workflow automation"),
      body: localized("Turn repetitive checks, reminders, and handoffs into steps that run on their own."),
    },
    {
      id: "maintenance",
      title: localized("Maintenance and ongoing improvement"),
      body: localized("Keep what you've built working well, and keep improving it as your needs change."),
    },
  ],
  steps: [
    {
      id: "understand",
      title: localized("Understand the workflow"),
      body: localized(
        "I start with the people doing the work: what they do, where it slows down, and what would actually help.",
      ),
    },
    {
      id: "build",
      title: localized("Build the solution"),
      body: localized("I design and build a focused tool around that workflow, and share progress as it takes shape."),
    },
    {
      id: "improve",
      title: localized("Improve it after delivery"),
      body: localized("Launch is a beginning. I keep refining the tool as real use shows what matters next."),
    },
  ],
};
