import { expect, test } from "vitest";
import { contactFormCopy } from "@/content/contact-form";
import { composeContactMessage } from "@/lib/contact-message";

test("contact form includes chosen details in the WhatsApp draft", () => {
  const form = new FormData();
  form.set("about", "0");
  form.append("kind", "0");
  form.append("kind", "4");
  form.set("budget", "2");
  form.set("timeline", "3");
  form.set("name", "A Visitor");
  form.set("email", "visitor@example.com");
  form.set("message", "I need an appointment system.");
  form.set("referral", "2");

  const message = composeContactMessage(form, contactFormCopy.en);
  expect(message).toContain("A project");
  expect(message).toContain("Web app, Integration / automation");
  expect(message).toContain("$5k–15k");
  expect(message).toContain("Flexible");
  expect(message).toContain("A Visitor");
  expect(message).toContain("visitor@example.com");
  expect(message).toContain("I need an appointment system.");
  expect(message).toContain("Referral");
});

test("contact draft labels follow the selected language", () => {
  const form = new FormData();
  form.set("about", "0");
  form.set("name", "زائر");
  form.set("email", "visitor@example.com");
  form.set("message", "أريد موقعًا.");
  const message = composeContactMessage(form, contactFormCopy.ar);
  expect(message).toContain("الموضوع: مشروع");
  expect(message).toContain("الاسم: زائر");
  expect(message).toContain("أريد موقعًا.");
});
