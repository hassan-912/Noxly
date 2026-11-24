import type { Locale } from "./types";

export type ContactFormCopy = {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  intro: string;
  skip: string;
  about: string;
  aboutOptions: string[];
  kind: string;
  kindOptions: string[];
  budget: string;
  budgetOptions: string[];
  timeline: string;
  timelineOptions: string[];
  name: string;
  email: string;
  message: string;
  messagePlaceholder: string;
  referral: string;
  referralOptions: string[];
  send: string;
  sendNote: string;
};

export const contactFormCopy: Record<Locale, ContactFormCopy> = {
  en: {
    eyebrow: "Contact",
    headlineLead: "Tell me what",
    headlineAccent: "you're building.",
    intro: "A project, a role, or a question about something else? Tell me a little about it and I'll get back to you.",
    skip: "Or skip the form",
    about: "This is about",
    aboutOptions: ["A project", "A role / hiring", "Something else"],
    kind: "What kind of thing",
    kindOptions: ["Web app", "API / backend", "Website + CMS", "E-commerce", "Integration / automation", "Not sure yet"],
    budget: "Budget (USD, optional)",
    budgetOptions: ["Under $2k", "$2k–5k", "$5k–15k", "$15k+", "Let's discuss"],
    timeline: "Timeline (optional)",
    timelineOptions: ["ASAP", "This month", "1–3 months", "Flexible"],
    name: "Name",
    email: "Email",
    message: "What are you building?",
    messagePlaceholder: "A few lines is plenty. What does it do, who is it for, and what exists today?",
    referral: "How did you find me? (optional)",
    referralOptions: ["LinkedIn", "GitHub", "Referral", "Search", "Other"],
    send: "Continue on WhatsApp",
    sendNote: "Your message opens in WhatsApp. Review it and press send there.",
  },
  de: {
    eyebrow: "Kontakt",
    headlineLead: "Erzählen Sie mir,",
    headlineAccent: "was Sie bauen.",
    intro: "Ein Projekt, eine Stelle oder eine andere Frage? Beschreiben Sie kurz Ihr Anliegen und ich melde mich bei Ihnen.",
    skip: "Oder überspringen Sie das Formular",
    about: "Es geht um",
    aboutOptions: ["Ein Projekt", "Eine Stelle / Bewerbung", "Etwas anderes"],
    kind: "Was für ein Vorhaben?",
    kindOptions: ["Web-App", "API / Backend", "Website + CMS", "Online-Shop", "Integration / Automatisierung", "Noch nicht sicher"],
    budget: "Budget (USD, optional)",
    budgetOptions: ["Unter $2k", "$2k–5k", "$5k–15k", "$15k+", "Besprechen wir es"],
    timeline: "Zeitrahmen (optional)",
    timelineOptions: ["Sofort", "Diesen Monat", "1–3 Monate", "Flexibel"],
    name: "Name",
    email: "E-Mail",
    message: "Was möchten Sie entwickeln?",
    messagePlaceholder: "Ein paar Zeilen reichen. Worum geht es, für wen ist es und was gibt es schon?",
    referral: "Wie haben Sie mich gefunden? (optional)",
    referralOptions: ["LinkedIn", "GitHub", "Empfehlung", "Suche", "Andere"],
    send: "In WhatsApp fortfahren",
    sendNote: "Ihre Nachricht öffnet sich in WhatsApp. Prüfen Sie sie und senden Sie sie dort ab.",
  },
  fr: {
    eyebrow: "Contact",
    headlineLead: "Parlez-moi de ce",
    headlineAccent: "que vous créez.",
    intro: "Un projet, un poste ou une autre question ? Dites-m'en quelques mots et je vous répondrai.",
    skip: "Ou passer le formulaire",
    about: "Il s'agit de",
    aboutOptions: ["Un projet", "Un poste / recrutement", "Autre chose"],
    kind: "Quel type de projet ?",
    kindOptions: ["Application web", "API / backend", "Site web + CMS", "E-commerce", "Intégration / automatisation", "Pas encore sûr"],
    budget: "Budget (USD, facultatif)",
    budgetOptions: ["Moins de $2k", "$2k–5k", "$5k–15k", "$15k+", "À discuter"],
    timeline: "Délai (facultatif)",
    timelineOptions: ["Dès que possible", "Ce mois-ci", "1 à 3 mois", "Flexible"],
    name: "Nom",
    email: "E-mail",
    message: "Que souhaitez-vous créer ?",
    messagePlaceholder: "Quelques lignes suffisent. À quoi cela sert-il, pour qui, et qu'existe-t-il déjà ?",
    referral: "Comment m'avez-vous trouvé ? (facultatif)",
    referralOptions: ["LinkedIn", "GitHub", "Recommandation", "Recherche", "Autre"],
    send: "Continuer sur WhatsApp",
    sendNote: "Votre message s'ouvre dans WhatsApp. Vérifiez-le et envoyez-le là-bas.",
  },
  ar: {
    eyebrow: "تواصل",
    headlineLead: "أخبرني عمّا",
    headlineAccent: "تريد بناءه.",
    intro: "لديك مشروع أو فرصة عمل أو سؤال آخر؟ أخبرني بالتفاصيل وسأرد عليك.",
    skip: "أو تواصل مباشرةً",
    about: "الموضوع",
    aboutOptions: ["مشروع", "وظيفة / توظيف", "شيء آخر"],
    kind: "ما نوع المشروع؟",
    kindOptions: ["تطبيق ويب", "واجهة API / خلفية", "موقع + نظام محتوى", "متجر إلكتروني", "تكامل / أتمتة", "لست متأكدًا بعد"],
    budget: "الميزانية (بالدولار، اختياري)",
    budgetOptions: ["أقل من ٢ ألف", "٢–٥ آلاف", "٥–١٥ ألفًا", "أكثر من ١٥ ألفًا", "لنتحدث عنها"],
    timeline: "الموعد المتوقع (اختياري)",
    timelineOptions: ["في أقرب وقت", "هذا الشهر", "خلال ١–٣ أشهر", "مرن"],
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "ما الذي تريد بناءه؟",
    messagePlaceholder: "تكفي بضعة أسطر. ما فكرته، ولمن هو، وما الموجود حاليًا؟",
    referral: "كيف عرفت عني؟ (اختياري)",
    referralOptions: ["LinkedIn", "GitHub", "ترشيح", "بحث", "أخرى"],
    send: "المتابعة عبر واتساب",
    sendNote: "ستفتح رسالتك في واتساب. راجعها ثم اضغط إرسال هناك.",
  },
};
