import type { Localized } from "./types";
import { localized } from "./localized";

export interface StoryChapter {
  id: "curiosity" | "learning" | "operations" | "month-seven" | "now";
  /** Short timeline marker. No dates or durations beyond what the brief states. */
  marker: Localized<string>;
  title: Localized<string>;
  body: Localized<string>;
}

/**
 * Spec §7.6: curiosity → learning → MG Visa operations → pitching improvements in month seven
 * → software engineer now → the brief's "leave a place better" line (the pull quote).
 * The operations months are industry experience, never engineering experience.
 * Chapter copy resolves through the checked-in locale maps.
 */
export const story: { chapters: StoryChapter[]; quote: Localized<string> } = {
  chapters: [
    {
      id: "curiosity",
      marker: localized("Curiosity"),
      title: localized("How do ideas become products?"),
      body: localized(
        "I've always been fascinated by the people who create products used around the world. I wanted to understand how an idea becomes a product, and how software can change everyday life.",
      ),
    },
    {
      id: "learning",
      marker: localized("Learning"),
      title: localized("Turning curiosity into practice"),
      body: localized(
        "Over roughly the past year, I've been turning that curiosity into practical software development. I keep learning, and solving problems has taught me discipline.",
      ),
    },
    {
      id: "operations",
      marker: localized("MG Visa operations"),
      title: localized("Learning the work from the inside"),
      body: localized(
        "At MG Visa, I worked in tourism and business visa operations for around ten months. It wasn't engineering work. It was the work itself, and it shapes how I think about the software I build.",
      ),
    },
    {
      id: "month-seven",
      marker: localized("Month seven"),
      title: localized("Pitching a better way"),
      body: localized(
        "By my seventh month, I'd started spotting opportunities to improve how we worked. I pitched my ideas to management and began building them.",
      ),
    },
    {
      id: "now",
      marker: localized("Now"),
      title: localized("Software engineer at MG Visa"),
      body: localized(
        "Today I build tools for document review, assessments, and consultations, along with a mobile app that's still in development. I want better service for customers, simpler work for my colleagues, and AI used where it's genuinely useful.",
      ),
    },
  ],
  // The brief's exact line.
  quote: localized(
    "I want to leave a place better than I found it—with clearer systems, easier work, and something useful that continues to make a difference.",
  ),
};
