export type StudentDocStatus =
  | "missing"
  | "generated"
  | "uploaded"
  | "approved"
  | "returned";

export const STUDENT_STATUS_LABELS: Record<StudentDocStatus, string> = {
  missing: "Missing",
  generated: "Generated",
  uploaded: "Uploaded",
  approved: "Approved",
  returned: "Returned",
};

export type DocVersion = { id: string; file: string; size: string; date: string; /** Blob or public URL; mock versions fall back to a sample. */ url?: string };

export type DocEntry = {
  id: string;
  label: string;
  status: StudentDocStatus;
  updatedAt?: string;
  comment?: string;
  versions: DocVersion[];
};

export type StudentDocument = {
  id: "contract" | "monthly-notebook" | "yearly-program" | "weekly-report" | "mou";
  label: string;
  description: string;
  status: StudentDocStatus;
  updatedAt?: string;
  deadline?: string;
  hasGenerated: boolean;
  comment?: string;
  versions: DocVersion[];
  /** Repeating documents list one entry per week or month. */
  entries?: DocEntry[];
};

export const ME = {
  name: "Noah Keller",
  email: "noah.keller@internium.app",
  className: "12A",
  schoolYear: "2026/27",
};

export type Person = {
  role: string;
  name: string;
  email: string;
  phone: string;
};

export const MY_PEOPLE: Person[] = [
  {
    role: "Mentor teacher",
    name: "Mira Santos",
    email: "mira.santos@internium.app",
    phone: "+49 30 900 1122",
  },
  {
    role: "Business mentor",
    name: "Tom Richter",
    email: "tom@acmementors.com",
    phone: "+49 151 111 222",
  },
];

export type MyCompany = {
  name: string;
  address: string;
  contact: string;
  email: string;
  phone: string;
};

/** Set to null to preview the unassigned empty state. */
export const MY_COMPANY: MyCompany | null = {
  name: "Acme Mentors",
  address: "Torstraße 12, 10119 Berlin",
  contact: "Tom Richter",
  email: "hello@acmementors.com",
  phone: "+49 30 1234 567",
};

export const MY_DOCUMENTS: StudentDocument[] = [
  {
    id: "contract",
    label: "Contract",
    description: "Three-party internship contract",
    status: "approved",
    updatedAt: "2026-09-18",
    hasGenerated: true,
    versions: [
      { id: "v-2", file: "contract-signed.pdf", size: "412 KB", date: "2026-09-18" },
      { id: "v-1", file: "contract.pdf", size: "398 KB", date: "2026-09-12" },
    ],
  },
  {
    id: "monthly-notebook",
    label: "Monthly Notebook",
    description: "One notebook per month of practice",
    status: "returned",
    updatedAt: "2026-10-24",
    deadline: "2026-11-05",
    hasGenerated: true,
    comment: "Please add the hours for each day and have your mentor sign page 2.",
    versions: [
      { id: "v-1", file: "notebook-october.docx", size: "88 KB", date: "2026-10-22" },
    ],
    entries: [
      {
        id: "sep",
        label: "September",
        status: "approved",
        updatedAt: "2026-10-02",
        versions: [{ id: "v-1", file: "notebook-september.pdf", size: "120 KB", date: "2026-10-01" }],
      },
      {
        id: "oct",
        label: "October",
        status: "returned",
        updatedAt: "2026-10-24",
        comment: "Please add the hours for each day and have your mentor sign page 2.",
        versions: [{ id: "v-1", file: "notebook-october.docx", size: "88 KB", date: "2026-10-22" }],
      },
      { id: "nov", label: "November", status: "generated", updatedAt: "2026-10-28", versions: [] },
    ],
  },
  {
    id: "yearly-program",
    label: "Yearly Program",
    description: "Goals and tasks for the school year",
    status: "generated",
    updatedAt: "2026-10-27",
    deadline: "2026-11-10",
    hasGenerated: true,
    versions: [],
  },
  {
    id: "weekly-report",
    label: "Weekly Report",
    description: "A short report every week",
    status: "uploaded",
    updatedAt: "2026-10-26",
    deadline: "2026-11-02",
    hasGenerated: false,
    versions: [
      { id: "v-1", file: "week-43.pdf", size: "64 KB", date: "2026-10-26" },
    ],
    entries: [
      {
        id: "w41",
        label: "Week 41 · 5–9 Oct",
        status: "approved",
        updatedAt: "2026-10-12",
        versions: [{ id: "v-1", file: "week-41.pdf", size: "61 KB", date: "2026-10-11" }],
      },
      {
        id: "w42",
        label: "Week 42 · 12–16 Oct",
        status: "returned",
        updatedAt: "2026-10-20",
        comment: "Describe what you learned, not only the tasks.",
        versions: [{ id: "v-1", file: "week-42.pdf", size: "58 KB", date: "2026-10-18" }],
      },
      {
        id: "w43",
        label: "Week 43 · 19–23 Oct",
        status: "uploaded",
        updatedAt: "2026-10-26",
        versions: [{ id: "v-1", file: "week-43.pdf", size: "64 KB", date: "2026-10-26" }],
      },
      { id: "w44", label: "Week 44 · 26–30 Oct", status: "missing", versions: [] },
    ],
  },
  {
    id: "mou",
    label: "MoU",
    description: "Memorandum of understanding",
    status: "missing",
    deadline: "2026-11-15",
    hasGenerated: false,
    versions: [],
  },
];

export type StudentAbsence = {
  id: string;
  date: string;
  reason: string;
  recordedBy: "Teacher" | "Business mentor";
  recorder: string;
};

export const MY_ABSENCES: StudentAbsence[] = [
  { id: "a-5", date: "2027-02-10", reason: "Public transport strike", recordedBy: "Business mentor", recorder: "Tom Richter" },
  { id: "a-4", date: "2027-01-15", reason: "Sick", recordedBy: "Teacher", recorder: "Mira Santos" },
  { id: "a-3", date: "2026-12-18", reason: "Family matter", recordedBy: "Business mentor", recorder: "Tom Richter" },
  { id: "a-2", date: "2026-12-02", reason: "Doctor appointment", recordedBy: "Business mentor", recorder: "Tom Richter" },
  { id: "a-1", date: "2026-11-13", reason: "Sick", recordedBy: "Teacher", recorder: "Mira Santos" },
];

/** First session: the first Wednesday of November. */
export const INTERNSHIP_START = "2026-11-04";
/** Mock "today" for the internship timeline, so past sessions show a mix of states. */
export const INTERNSHIP_TODAY = "2027-02-19";
/** Last day of the internship; the absences timeline runs until here. */
export const INTERNSHIP_END = "2027-04-30";

/** Days the internship actually meets (Wednesdays and Fridays), start to end. Absences fall on these. */
export const INTERNSHIP_SESSIONS: string[] = (() => {
  const out: string[] = [];
  const end = new Date(INTERNSHIP_END + "T12:00:00Z");
  for (let d = new Date(INTERNSHIP_START + "T12:00:00Z"); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.getUTCDay();
    if (day === 3 || day === 5) out.push(d.toISOString().slice(0, 10));
  }
  return out;
})();

export const UPLOAD_HINT = "PDF or Word (.pdf, .doc, .docx), up to 10 MB";
