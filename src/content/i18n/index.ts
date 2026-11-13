import type { Locale } from "../types";
import { en, type Dictionary } from "./en";
import { de } from "./de";
import { fr } from "./fr";
import { ar } from "./ar";

export type { Dictionary };

/** Typed `Record<Locale, Dictionary>`: a missing or incomplete locale fails the build. */
export const dictionaries: Record<Locale, Dictionary> = { en, de, fr, ar };
