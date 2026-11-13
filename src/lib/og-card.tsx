import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { getDictionary } from "@/lib/i18n";

/** Share card for `next/og`: name, role and value proposition on frost with the indigo accent. */
export function OgCard({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#F4F7F9",
        color: "#0E1A24",
      }}
    >
      <div style={{ display: "flex", width: 96, height: 8, borderRadius: 4, background: "#525AFF" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 600, letterSpacing: -3 }}>{site.name}</div>
        <div style={{ display: "flex", fontSize: 36, color: "#525AFF" }}>{dict.identity.role}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#4A6878", maxWidth: 960, lineHeight: 1.35 }}>
          {dict.identity.valueProp}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#4A6878" }}>{site.url.replace(/^https?:\/\//, "")}</div>
    </div>
  );
}
