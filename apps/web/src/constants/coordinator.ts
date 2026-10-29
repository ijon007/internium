export const DOCUMENT_TYPES = [
  { id: "agreement", label: "Agreement", short: "AGR" },
  { id: "plan", label: "Training plan", short: "PLN" },
  { id: "diary", label: "Diary", short: "DIA" },
  { id: "evaluation", label: "Evaluation", short: "EVL" },
  { id: "certificate", label: "Certificate", short: "CRT" },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["id"];

export type DocumentStatus = "missing" | "uploaded" | "approved" | "returned";

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  missing: "Missing",
  uploaded: "Uploaded",
  approved: "Approved",
  returned: "Returned",
};

export type Teacher = { id: string; name: string; email: string };

export const TEACHERS: Teacher[] = [
  { id: "t-1", name: "Mira Santos", email: "mira.santos@internium.app" },
  { id: "t-2", name: "Anna Weiss", email: "anna.weiss@internium.app" },
  { id: "t-3", name: "Jonas Hart", email: "jonas.hart@internium.app" },
  { id: "t-4", name: "Clara Moss", email: "clara.moss@internium.app" },
];

export type ClassGroup = {
  id: string;
  name: string;
  year: string;
  teacherIds: string[];
  archived: boolean;
  /** Final-year (13th grade) class whose students have graduated. */
  graduated?: boolean;
};

export const CLASSES: ClassGroup[] = [
  { id: "c-1", name: "12A", year: "2026/27", teacherIds: ["t-1"], archived: false },
  { id: "c-2", name: "12B", year: "2026/27", teacherIds: ["t-2", "t-3"], archived: false },
  { id: "c-3", name: "13A", year: "2026/27", teacherIds: ["t-4"], archived: false },
  { id: "c-4", name: "13B", year: "2025/26", teacherIds: ["t-1"], archived: true, graduated: true },
  { id: "c-5", name: "13C", year: "2024/25", teacherIds: ["t-3"], archived: true, graduated: true },
];

export type Mentor = { id: string; name: string; email: string; phone: string };

export type Company = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  mentors: Mentor[];
};

export const COMPANIES: Company[] = [
  {
    id: "co-1",
    name: "Acme Mentors",
    contact: "Tom Richter",
    email: "hello@acmementors.com",
    phone: "+49 30 1234 567",
    address: "Torstraße 12, Berlin",
    mentors: [
      { id: "m-1", name: "Tom Richter", email: "tom@acmementors.com", phone: "+49 151 111 222" },
      { id: "m-2", name: "Ina Kraus", email: "ina@acmementors.com", phone: "+49 151 333 444" },
    ],
  },
  {
    id: "co-2",
    name: "Northwind",
    contact: "Paul Meier",
    email: "jobs@northwind.io",
    phone: "+49 40 555 0101",
    address: "Hafenweg 3, Hamburg",
    mentors: [
      { id: "m-3", name: "Paul Meier", email: "paul@northwind.io", phone: "+49 160 555 010" },
    ],
  },
  {
    id: "co-3",
    name: "Bluebird Labs",
    contact: "Sara Lind",
    email: "team@bluebird.dev",
    phone: "+49 89 777 2020",
    address: "Leopoldstraße 50, Munich",
    mentors: [
      { id: "m-4", name: "Sara Lind", email: "sara@bluebird.dev", phone: "+49 170 202 020" },
      { id: "m-5", name: "Max Weber", email: "max@bluebird.dev", phone: "+49 170 303 030" },
    ],
  },
];

export type Absence = { id: string; date: string; hours: number; excused: boolean; reason: string };

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  classId: string;
  companyId?: string;
  mentorId?: string;
  documents: Record<DocumentType, DocumentStatus>;
  absences: Absence[];
};

function docs(
  agreement: DocumentStatus,
  plan: DocumentStatus,
  diary: DocumentStatus,
  evaluation: DocumentStatus,
  certificate: DocumentStatus,
): Record<DocumentType, DocumentStatus> {
  return { agreement, plan, diary, evaluation, certificate };
}

export const STUDENTS: Student[] = [
  { id: "s-1", name: "Noah Keller", email: "noah.keller@internium.app", phone: "+49 151 100 001", birthDate: "2009-04-12", classId: "c-1", companyId: "co-1", mentorId: "m-1", documents: docs("approved", "approved", "uploaded", "missing", "missing"), absences: [{ id: "a-1", date: "2026-10-14", hours: 8, excused: true, reason: "Sick" }] },
  { id: "s-2", name: "Eli Marin", email: "eli.marin@internium.app", phone: "+49 151 100 002", birthDate: "2009-07-02", classId: "c-1", documents: docs("missing", "missing", "missing", "missing", "missing"), absences: [] },
  { id: "s-3", name: "Sofia Berg", email: "sofia.berg@internium.app", phone: "+49 151 100 003", birthDate: "2008-11-23", classId: "c-2", companyId: "co-2", mentorId: "m-3", documents: docs("approved", "approved", "approved", "uploaded", "missing"), absences: [{ id: "a-2", date: "2026-10-02", hours: 4, excused: false, reason: "Late" }, { id: "a-3", date: "2026-10-20", hours: 8, excused: true, reason: "Doctor" }] },
  { id: "s-4", name: "Liam Novak", email: "liam.novak@internium.app", phone: "+49 151 100 004", birthDate: "2009-01-30", classId: "c-2", companyId: "co-3", mentorId: "m-4", documents: docs("approved", "returned", "uploaded", "missing", "missing"), absences: [] },
  { id: "s-5", name: "Ava Schulz", email: "ava.schulz@internium.app", phone: "+49 151 100 005", birthDate: "2008-06-17", classId: "c-3", companyId: "co-3", mentorId: "m-5", documents: docs("approved", "approved", "approved", "approved", "uploaded"), absences: [{ id: "a-4", date: "2026-09-29", hours: 8, excused: true, reason: "Family" }] },
  { id: "s-6", name: "Ben Fischer", email: "ben.fischer@internium.app", phone: "+49 151 100 006", birthDate: "2008-09-05", classId: "c-3", documents: docs("uploaded", "missing", "missing", "missing", "missing"), absences: [] },
  { id: "s-7", name: "Emma Wolf", email: "emma.wolf@internium.app", phone: "+49 151 100 007", birthDate: "2009-03-08", classId: "c-1", companyId: "co-2", mentorId: "m-3", documents: docs("approved", "uploaded", "returned", "missing", "missing"), absences: [] },
  { id: "s-8", name: "Leo Brandt", email: "leo.brandt@internium.app", phone: "+49 151 100 008", birthDate: "2007-12-01", classId: "c-4", companyId: "co-1", mentorId: "m-2", documents: docs("approved", "approved", "approved", "approved", "approved"), absences: [] },
];

export const DOCUMENT_TEMPLATES = [
  { id: "agreement", label: "Internship agreement", description: "Three-party contract for school, student, and company." },
  { id: "plan", label: "Training plan", description: "Goals and tasks agreed with the business mentor." },
  { id: "certificate", label: "Certificate", description: "End-of-practice confirmation with hours." },
] as const;

export function docProgress(student: Student) {
  return Object.values(student.documents).filter((s) => s === "approved").length;
}

export function teacherName(id: string) {
  return TEACHERS.find((t) => t.id === id)?.name ?? "—";
}
