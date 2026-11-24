import type { ContactFormCopy } from "@/content/contact-form";

/** Build the message the visitor reviews in WhatsApp before sending. */
export function composeContactMessage(data: FormData, copy: ContactFormCopy): string {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const option = (key: string, options: string[]) => {
    const index = Number(value(key));
    return value(key) !== "" && Number.isInteger(index) ? options[index] ?? "" : "";
  };
  const kinds = data.getAll("kind").map((raw) => copy.kindOptions[Number(raw)]).filter(Boolean);
  const lines = [
    `${copy.about}: ${option("about", copy.aboutOptions)}`,
    kinds.length ? `${copy.kind}: ${kinds.join(", ")}` : "",
    option("budget", copy.budgetOptions) ? `${copy.budget}: ${option("budget", copy.budgetOptions)}` : "",
    option("timeline", copy.timelineOptions) ? `${copy.timeline}: ${option("timeline", copy.timelineOptions)}` : "",
    `${copy.name}: ${value("name")}`,
    `${copy.email}: ${value("email")}`,
    "",
    `${copy.message}:`,
    value("message"),
    option("referral", copy.referralOptions) ? `${copy.referral}: ${option("referral", copy.referralOptions)}` : "",
  ];
  return lines.filter((line, index) => line !== "" || index === 6).join("\n");
}
