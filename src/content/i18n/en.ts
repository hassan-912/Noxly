/**
 * English UI strings. This object defines the `Dictionary` type; de/fr/ar must match it exactly.
 * Placeholders in braces (e.g. {current}) are filled in by components.
 * Project, story, services and diagram copy live in their own content files.
 */
export const en = {
  meta: {
    title: "Hassan Azab — Software Engineer",
    description:
      "Hassan Azab is a software engineer at MG Visa in New Cairo. He builds full-stack applications, dashboards, and automations that make work simpler.",
    ogAlt: "Hassan Azab, Software Engineer at MG Visa · Problem Solver",
  },
  identity: {
    role: "Software Engineer at MG Visa · Problem Solver",
    valueProp: "I understand the work behind the software—and build tools that make it easier.",
  },
  nav: {
    label: "Main",
    home: "Hassan Azab, home",
    skipToContent: "Skip to content",
    work: "Work",
    systems: "System Architecture",
    services: "Services",
    story: "Story",
    projects: "Projects",
    notes: "Notes",
    building: "Building now",
    contact: "Contact",
    letsTalk: "Let's talk",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
  language: {
    label: "Language",
    current: "Current language",
    en: "English",
    de: "Deutsch",
    fr: "Français",
    ar: "العربية",
  },
  hero: {
    eyebrow: "Software Engineer at MG Visa · Problem Solver",
    headline: "Software that makes work feel simpler.",
    /** Must appear verbatim inside `headline`; it is the one fragment that scrambles. */
    scrambleWord: "simpler",
    intro:
      "I'm Hassan Azab, a software engineer at MG Visa based in New Cairo. I build full-stack applications, dashboards, and automations that turn complicated workflows into clear, useful experiences. My starting point is understanding the people doing the work—and finding a better way to help them do it.",
    ctaPrimary: "Let's talk about your project.",
    ctaSecondary: "Explore my work.",
    /** Names the layered screenshots and is shown under them. */
    compositionLabel: "Screenshots of my live projects' public pages",
  },
  sections: {
    work: {
      counter: "01",
      title: "Featured work",
      intro:
        "Explore the websites and tools I've built. Choose a project and preview size, or open the website to try it yourself.",
    },
    systems: {
      counter: "02",
      title: "How the systems fit together",
      intro: "Each project has its own architecture. Pick one and select a step to see what it does.",
    },
    services: {
      counter: "03",
      title: "What I can build for you",
      intro:
        "Understanding the workflow comes first. It's how the solution ends up fitting the work, and why it keeps improving after delivery.",
    },
    story: {
      counter: "04",
      title: "From operations to engineering",
      intro: "How curiosity about products turned into building them.",
    },
    projects: {
      counter: "05",
      title: "Further projects",
      intro: "Other things I've built, on my own and with teams.",
    },
    building: {
      counter: "06",
      title: "Currently building",
      intro: "Two projects in active development. Neither is finished, and both are shown that way.",
    },
    contact: {
      counter: "07",
      title: "Let's talk about your project.",
      intro: "Tell me about the work you want to make easier. WhatsApp is the best way to reach me, and email works too.",
    },
  },
  viewer: {
    railLabel: "Featured projects",
    /** The stage's kicker, by what it shows. */
    previewLive: "Live website",
    previewScreenshot: "Screenshot of the public page",
    previewOverview: "Project overview",
    counter: "{current} / {total}",
    devicesLabel: "Preview size",
    pathwaysLabel: "Calculator pathway",
    reload: "Reload preview",
    desktop: "Desktop",
    tablet: "Tablet",
    phone: "Phone",
    stack: "Built with",
    status: "Status",
    repo: "View the code",
    openWebsite: "Open website",
    caseStudy: "Read the case study",
    loadLive: "Load live site",
    liveTitle: "Live preview of {name}",
    liveLoading: "Loading the live site…",
    livePoster: "Screenshot of {name}",
    liveFallback: "The live preview isn't available right now. You can open the site in a new tab.",
    /** Shown when the site's own headers forbid showing it inside another page. */
    blockedNote: "This site's security settings don't allow it to be shown inside another page.",
    internalNote: "Internal tool — not publicly accessible",
    opensNewTab: "(opens in a new tab)",
  },
  diagram: {
    tablistLabel: "Choose a project",
    caption: "Illustrative animation — not live traffic",
    hint: "Select a step to see what it does.",
    technologies: "Technologies",
    close: "Close",
    /** Accessible name of a project's list of steps. */
    stepsLabel: "{project}: steps of the system",
    /** Shown with every view: the diagram is the real system, not a generic architecture. */
    note: "Each view shows how that project is actually built, simplified to its main parts.",
    connections: "Connections",
    comesFrom: "Comes from",
    leadsTo: "Leads to",
    tabs: {
      review: "Review",
      consultation: "Consultation",
      calculator: "Calculator",
      mobile: "Mobile",
    },
  },
  services: {
    outcomesLabel: "Outcomes",
    stepsTitle: "How I work",
  },
  story: {
    timelineLabel: "My path so far",
    portraitLabel: "Hassan Azab",
  },
  projects: {
    showDetails: "Show details",
    hideDetails: "Hide details",
    noPublicLink: "No public link",
    repo: "Repository",
    liveSite: "Live site",
  },
  building: {
    mobileStatus: "In development · not released",
    crewStatus: "In development",
    repoOnly: "Repository",
  },
  contact: {
    whatsapp: "WhatsApp",
    whatsappAction: "Message me on WhatsApp",
    email: "Email",
    copyEmail: "Copy email address",
    copied: "Copied",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Based in",
  },
  caseStudy: {
    back: "Back to work",
    problem: "The problem",
    contribution: "My contribution",
    approach: "The approach",
    features: "Key features",
    stack: "Technology",
    status: "Status",
    outcomes: "Outcomes",
    architecture: "How it fits together",
    links: "Links",
    cta: "Have a workflow like this?",
  },
  authorship: {
    solo: "Designed and built by me",
    shared: "Team project",
  },
  root: {
    title: "Choose a language",
    noscript: "JavaScript is off, so pick your language from the list.",
  },
  footer: {
    privacy: "This site sets no cookies and no tracking.",
    copyright: "© {year} Hassan Azab",
    backToTop: "Back to top",
  },
};

/** The shape every locale must satisfy (strings widened). */
export type Dictionary = typeof en;
