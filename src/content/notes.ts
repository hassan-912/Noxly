import type { Locale } from "./types";

/** Interface text for the Notes index and article pages. Post text lives in `src/content/posts/`. */
export type NotesCopy = {
  title: string;
  description: string;
  rssLabel: string;
  featuredLabel: string;
  allNotes: string;
  emptyTitle: string;
  emptyBody: string;
  readTimeLabel: string;
  backToNotes: string;
  onThisPage: string;
  keepReading: string;
  contactTitle: string;
  contactBody: string;
  contactAction: string;
};

export const notesCopy: Record<Locale, NotesCopy> = {
  en: {
    title: "Notes",
    description: "On the things I build and learn, and how I fix what breaks.",
    rssLabel: "Subscribe via RSS",
    featuredLabel: "Featured",
    allNotes: "All notes",
    emptyTitle: "The first note is on its way",
    emptyBody: "Subscribe via RSS to read it when it's published.",
    readTimeLabel: "{minutes} min read",
    backToNotes: "All notes",
    onThisPage: "In this note",
    keepReading: "Keep reading",
    contactTitle: "Have something to build or fix?",
    contactBody: "Tell me about your project. The contact section has a short form and direct ways to reach me.",
    contactAction: "Go to contact",
  },
  de: {
    title: "Notizen",
    description: "Über das, was ich entwickle und lerne – und wie ich Fehler behebe.",
    rssLabel: "Per RSS abonnieren",
    featuredLabel: "Empfohlen",
    allNotes: "Alle Notizen",
    emptyTitle: "Die erste Notiz ist unterwegs",
    emptyBody: "Abonnieren Sie den RSS-Feed, um sie nach der Veröffentlichung zu lesen.",
    readTimeLabel: "{minutes} Min. Lesezeit",
    backToNotes: "Alle Notizen",
    onThisPage: "In dieser Notiz",
    keepReading: "Weiterlesen",
    contactTitle: "Möchten Sie etwas entwickeln oder reparieren?",
    contactBody: "Erzählen Sie mir von Ihrem Projekt. Im Kontaktbereich finden Sie ein kurzes Formular und direkte Kontaktmöglichkeiten.",
    contactAction: "Zum Kontakt",
  },
  fr: {
    title: "Notes",
    description: "Sur ce que je crée et apprends, et sur la façon dont je corrige ce qui ne fonctionne pas.",
    rssLabel: "S'abonner par RSS",
    featuredLabel: "À la une",
    allNotes: "Toutes les notes",
    emptyTitle: "La première note arrive bientôt",
    emptyBody: "Abonnez-vous au flux RSS pour la lire dès sa publication.",
    readTimeLabel: "{minutes} min de lecture",
    backToNotes: "Toutes les notes",
    onThisPage: "Dans cette note",
    keepReading: "À lire aussi",
    contactTitle: "Un projet à créer ou à corriger ?",
    contactBody: "Parlez-moi de votre projet. La section Contact propose un court formulaire et des moyens de me joindre directement.",
    contactAction: "Aller au contact",
  },
  ar: {
    title: "ملاحظات",
    description: "حول ما أبنيه وأتعلمه، وكيف أصلح ما يتعطل.",
    rssLabel: "اشترك عبر RSS",
    featuredLabel: "مميزة",
    allNotes: "كل الملاحظات",
    emptyTitle: "الملاحظة الأولى في الطريق",
    emptyBody: "اشترك عبر RSS لتقرأها فور نشرها.",
    readTimeLabel: "قراءة {minutes} دقيقة",
    backToNotes: "كل الملاحظات",
    onThisPage: "في هذه الملاحظة",
    keepReading: "تابع القراءة",
    contactTitle: "لديك مشروع تريد بناءه أو إصلاحه؟",
    contactBody: "أخبرني عن مشروعك. في قسم التواصل نموذج مختصر وطرق مباشرة للوصول إليّ.",
    contactAction: "الذهاب إلى التواصل",
  },
};

export function readTime(locale: Locale, minutes: number): string {
  return notesCopy[locale].readTimeLabel.replace("{minutes}", String(minutes));
}
