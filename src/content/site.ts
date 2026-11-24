import type { Localized } from "./types";
import { localized } from "./localized";

export const site: {
  name: string;
  url: string;
  location: Localized<string>;
  contacts: {
    whatsapp: { e164: "+201023174210"; href: "https://wa.me/201023174210" };
    email: string;
    linkedin: string;
    github: string;
  };
  cvUrl: null;
  portrait: null;
} = {
  name: "Hassan Azab",
  // Placeholder until the domain is decided; `npm run build` warns while it is unchanged.
  url: "https://azab.dev",
  location: localized("New Cairo, Cairo, Egypt"),
  contacts: {
    whatsapp: { e164: "+201023174210", href: "https://wa.me/201023174210" },
    email: "hassanazb.56@gmail.com",
    linkedin: "https://www.linkedin.com/in/hassan-azb-b60587246/",
    github: "https://github.com/hassan-912",
  },
  cvUrl: null,
  portrait: null,
};
