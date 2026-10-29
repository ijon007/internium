import type { StudentDocument } from "@/constants/student";

/** One fillable blank on a generated document. Rendered inline on the paper, payment-tracking style. */
export type DocField =
  | { id: string; label: string; type: "text"; placeholder?: string; required?: boolean; width?: "sm" | "md" | "full" }
  | { id: string; label: string; type: "textarea"; placeholder?: string; required?: boolean }
  | { id: string; label: string; type: "dropdown"; options: readonly string[]; required?: boolean }
  | { id: string; label: string; type: "date"; required?: boolean }
  | { id: string; label: string; type: "checkbox"; required?: boolean }
  | { id: string; label: string; type: "signature"; required?: boolean };

export type DocFieldSection = { title: string; intro?: string; fields: readonly DocField[] };

export type DocSchema = { title: string; subtitle: string; sections: readonly DocFieldSection[] };

export type FieldValue = string | boolean;
export type FieldValues = Record<string, FieldValue>;

const SIGNATURES: DocFieldSection = {
  title: "Signatures",
  fields: [
    { id: "signedOn", label: "Signed on", type: "date", required: true },
    { id: "studentSignature", label: "Student signature", type: "signature", required: true },
  ],
};

const RATING = ["Excellent", "Good", "Satisfactory", "Needs improvement"] as const;

export const DOCUMENT_FIELDS: Record<StudentDocument["id"], DocSchema> = {
  contract: {
    title: "Internship Contract",
    subtitle: "Agreement between the student, the school and the host company.",
    sections: [
      {
        title: "Student",
        fields: [
          { id: "studentName", label: "Full name", type: "text", required: true },
          { id: "studentId", label: "Student ID", type: "text", width: "sm", required: true },
          { id: "birthDate", label: "Date of birth", type: "date", required: true },
          { id: "programme", label: "Programme", type: "dropdown", options: ["Software Engineering", "Business Informatics", "Graphic Design", "Economics"], required: true },
        ],
      },
      {
        title: "Placement",
        fields: [
          { id: "position", label: "Position", type: "text", required: true },
          { id: "startDate", label: "Start date", type: "date", required: true },
          { id: "endDate", label: "End date", type: "date", required: true },
          { id: "hours", label: "Weekly hours", type: "dropdown", options: ["20 hours", "30 hours", "40 hours"], required: true },
          { id: "paid", label: "This internship is paid", type: "checkbox" },
        ],
      },
      {
        title: "Terms",
        intro: "The student agrees to follow the company's rules, keep confidential information private and report weekly to the mentor teacher.",
        fields: [{ id: "agree", label: "I have read and accept the terms above", type: "checkbox", required: true }],
      },
      SIGNATURES,
    ],
  },
  "monthly-notebook": {
    title: "Monthly Notebook",
    subtitle: "A summary of the work done this month.",
    sections: [
      {
        title: "Period",
        fields: [
          { id: "month", label: "Month", type: "dropdown", options: ["October", "November", "December", "January", "February", "March", "April", "May"], required: true },
          { id: "daysPresent", label: "Days present", type: "text", width: "sm", required: true },
        ],
      },
      {
        title: "Work",
        fields: [
          { id: "tasks", label: "Main tasks", type: "textarea", placeholder: "What did you work on?", required: true },
          { id: "skills", label: "Skills learned", type: "textarea", placeholder: "Tools, techniques, soft skills…" },
          { id: "challenges", label: "Challenges", type: "textarea" },
        ],
      },
      SIGNATURES,
    ],
  },
  "yearly-program": {
    title: "Yearly Program",
    subtitle: "Learning goals and plan for the internship year.",
    sections: [
      {
        title: "Programme",
        fields: [
          { id: "schoolYear", label: "School year", type: "dropdown", options: ["2025/2026", "2026/2027"], required: true },
          { id: "department", label: "Department", type: "text", required: true },
        ],
      },
      {
        title: "Goals",
        fields: [
          { id: "goals", label: "Learning goals", type: "textarea", required: true },
          { id: "milestones", label: "Milestones", type: "textarea", placeholder: "Term 1, Term 2, Term 3…" },
        ],
      },
      SIGNATURES,
    ],
  },
  "weekly-report": {
    title: "Weekly Report",
    subtitle: "What happened this week at the placement.",
    sections: [
      {
        title: "Week",
        fields: [
          { id: "weekStart", label: "Week starting", type: "date", required: true },
          { id: "hoursWorked", label: "Hours worked", type: "text", width: "sm", required: true },
        ],
      },
      {
        title: "Report",
        fields: [
          { id: "done", label: "Activities", type: "textarea", required: true },
          { id: "next", label: "Plan for next week", type: "textarea" },
          { id: "rating", label: "How did it go?", type: "dropdown", options: RATING, required: true },
        ],
      },
      SIGNATURES,
    ],
  },
  mou: {
    title: "Memorandum of Understanding",
    subtitle: "Cooperation between the school and the host company.",
    sections: [
      {
        title: "Parties",
        fields: [
          { id: "company", label: "Company", type: "text", required: true },
          { id: "representative", label: "Company representative", type: "text", required: true },
          { id: "school", label: "School", type: "text", required: true },
        ],
      },
      {
        title: "Duration",
        fields: [
          { id: "from", label: "Valid from", type: "date", required: true },
          { id: "until", label: "Valid until", type: "date", required: true },
          { id: "insurance", label: "Company provides insurance", type: "checkbox" },
        ],
      },
      SIGNATURES,
    ],
  },
};

export function isFilled(field: DocField, v: FieldValue | undefined) {
  return field.type === "checkbox" ? v === true : typeof v === "string" && v.trim() !== "";
}
