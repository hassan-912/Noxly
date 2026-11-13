import { untranslated, type Localized } from "./types";

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
 * TODO(task 11): replace each `untranslated(...)` with real de/fr/ar text.
 */
export const story: { chapters: StoryChapter[]; quote: Localized<string> } = {
  chapters: [
    {
      id: "curiosity",
      marker: untranslated("Curiosity"),
      title: untranslated("How do ideas become products?"),
      body: untranslated(
        "I've always been fascinated by the people who create products used around the world. I wanted to understand how an idea becomes a product, and how software can change everyday life.",
      ),
    },
    {
      id: "learning",
      marker: untranslated("Learning"),
      title: untranslated("Turning curiosity into practice"),
      body: untranslated(
        "Over roughly the past year, I've been turning that curiosity into practical software development. I keep learning, and solving problems has taught me discipline.",
      ),
    },
    {
      id: "operations",
      marker: untranslated("MG Visa operations"),
      title: untranslated("Learning the work from the inside"),
      body: untranslated(
        "At MG Visa, I worked in tourism and business visa operations for around ten months. It wasn't engineering work. It was the work itself, and it shapes how I think about the software I build.",
      ),
    },
    {
      id: "month-seven",
      marker: untranslated("Month seven"),
      title: untranslated("Pitching a better way"),
      body: untranslated(
        "By my seventh month, I'd started spotting opportunities to improve how we worked. I pitched my ideas to management and began building them.",
      ),
    },
    {
      id: "now",
      marker: untranslated("Now"),
      title: untranslated("Software engineer at MG Visa"),
      body: untranslated(
        "Today I build tools for document review, assessments, and consultations, along with a mobile app that's still in development. I want better service for customers, simpler work for my colleagues, and AI used where it's genuinely useful.",
      ),
    },
  ],
  // The brief's exact line.
  quote: untranslated(
    "I want to leave a place better than I found it—with clearer systems, easier work, and something useful that continues to make a difference.",
  ),
};
