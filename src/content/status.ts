import type { Localized, StatusKey } from "./types";
import { localized } from "./localized";

/** Status keys → localized labels, shown as status pills. */
export const status: Record<StatusKey, Localized<string>> = {
  "internal-tool": localized("Internal tool"),
  "public-site": localized("Public site"),
  "in-development": localized("In development"),
  "not-released": localized("Not released"),
  "graduation-project": localized("Graduation project"),
  "team-project": localized("Team project"),
};
