export type TechCategory = "language" | "framework" | "database" | "integration" | "platform";

export interface Tech {
  /** Readable name, shown as-is in every locale. */
  name: string;
  /** Simple Icons slug, or null when Simple Icons has no glyph for it. */
  simpleIcon: string | null;
  /** Lucide icon export name, used only when `simpleIcon` is null. */
  lucide: string | null;
  category: TechCategory;
}

const si = (name: string, simpleIcon: string, category: TechCategory): Tech =>
  ({ name, simpleIcon, lucide: null, category });
const lu = (name: string, lucide: string, category: TechCategory): Tech =>
  ({ name, simpleIcon: null, lucide, category });

/** Every technology named in the brief. Keys are the `TechId`s used in projects and diagrams. */
export const tech: Record<string, Tech> = {
  // Languages
  python: si("Python", "python", "language"),
  typescript: si("TypeScript", "typescript", "language"),
  javascript: si("JavaScript", "javascript", "language"),
  dart: si("Dart", "dart", "language"),

  // Frameworks and libraries
  streamlit: si("Streamlit", "streamlit", "framework"),
  pydantic: si("Pydantic", "pydantic", "framework"),
  pymupdf: lu("PyMuPDF", "FileText", "framework"),
  nextjs: si("Next.js", "nextdotjs", "framework"),
  react: si("React", "react", "framework"),
  vite: si("Vite", "vite", "framework"),
  tailwind: si("Tailwind CSS", "tailwindcss", "framework"),
  zustand: lu("Zustand", "Boxes", "framework"),
  "framer-motion": si("Framer Motion", "framer", "framework"),
  flutter: si("Flutter", "flutter", "framework"),
  riverpod: lu("Riverpod", "Waypoints", "framework"),
  gorouter: lu("GoRouter", "Route", "framework"),
  dio: lu("Dio", "ArrowLeftRight", "framework"),
  "qr-code-styling": lu("qr-code-styling", "QrCode", "framework"),
  pwa: si("Progressive Web App", "pwa", "framework"),
  nodejs: si("Node.js", "nodedotjs", "framework"),

  // Databases and backend services
  supabase: si("Supabase", "supabase", "database"),
  postgresql: si("PostgreSQL", "postgresql", "database"),
  "supabase-auth": lu("Supabase Auth", "KeyRound", "database"),
  "supabase-storage": lu("Supabase Storage", "HardDrive", "database"),
  "supabase-edge-functions": lu("Supabase Edge Functions", "Zap", "database"),
  d1: si("D1 / SQLite", "sqlite", "database"),

  // Integrations and processing
  ocr: lu("OCR", "ScanText", "integration"),
  "pdf-reporting": lu("PDF reporting", "FileOutput", "integration"),
  gemini: si("Google Gemini API", "googlegemini", "integration"),
  "exchangerate-api": lu("ExchangeRate-API", "Banknote", "integration"),
  anabin: lu("Anabin", "GraduationCap", "integration"),
  easykash: lu("EasyKash", "CreditCard", "integration"),
  resend: si("Resend", "resend", "integration"),
  "cron-triggers": lu("Cron Triggers", "CalendarClock", "integration"),
  "web-push": lu("Web Push", "BellRing", "integration"),

  // Platforms
  "cloudflare-workers": si("Cloudflare Workers", "cloudflareworkers", "platform"),
  vercel: si("Vercel", "vercel", "platform"),
  github: si("Git & GitHub", "github", "platform"),
  shopify: si("Shopify", "shopify", "platform"),
};
