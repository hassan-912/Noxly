// TODO(task 11): translate. Temporary copy of the English dictionary so the structure is complete.
import { en, type Dictionary } from "./en";

export const ar: Dictionary = structuredClone(en);

// Translated early (task 5): the MG Mobile demo shows an Arabic phone screen on every locale's
// page, so these strings are needed before the full translation. Digits stay Latin.
ar.demos.people = {
  applicantA: "متقدّم تجريبي أ",
  applicantB: "متقدّم تجريبي ب",
  applicantC: "متقدّم تجريبي ج",
  applicantD: "متقدّم تجريبي د",
  consultantA: "مستشار تجريبي أ",
  consultantB: "مستشار تجريبي ب",
  consultantC: "مستشار تجريبي ج",
  newcomerA: "موظف جديد تجريبي أ",
  company: "شركة تجريبية",
};

ar.demos.mobile = {
  title: "MG Mobile",
  appName: "MG Visa",
  screensLabel: "شاشات توضيحية للتطبيق",
  home: "الرئيسية",
  assessment: "التقييم",
  ticket: "التذكرة",
  staff: "الموظفون",
  nextConsultation: "الاستشارة القادمة",
  progress: "التقدّم",
  screenTabs: "شاشة التطبيق",
  language: "لغة الشاشة",
  greeting: "مرحباً، {name}",
  sampleDate: "الثلاثاء 13 يناير",
  withConsultant: "مع {name}",
  viewTicket: "عرض التذكرة",
  step: "الخطوة {current} من {total}",
  steps: {
    pathway: "المسار",
    details: "البيانات الشخصية",
    funding: "التمويل",
    review: "المراجعة",
  },
  continue: "متابعة",
  ticketTitle: "تذكرتك",
  ticketNote: "تذكرة تجريبية",
  todaySchedule: "جدول اليوم",
  schedule: "الجدول",
  scan: "مسح التذكرة",
  statusUpcoming: "قادمة",
  statusCheckedIn: "تم الحضور",
};
