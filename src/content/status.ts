import { untranslated, type Localized, type StatusKey } from "./types";

/** Status keys → localized labels, shown as status pills. */
export const status: Record<StatusKey, Localized<string>> = {
  "internal-tool": untranslated("Internal tool"),
  "public-site": untranslated("Public site"),
  "in-development": untranslated("In development"),
  "not-released": untranslated("Not released"),
  "graduation-project": untranslated("Graduation project"),
  "team-project": untranslated("Team project"),
};
