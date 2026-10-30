import type { StatusKey } from "@/components/status-badge";

/** The signed-in teacher (mock). */
export const TEACHER_ME = { name: "Mira Santos", email: "mira.santos@internium.app" };

/** Students with more absences than this are flagged on the dashboard and in filters. */
export const ABSENCE_THRESHOLD = 3;

export type TeacherDocType = "contract" | "monthly-notebook" | "yearly-program" | "weekly-report" | "mou";

export const TEACHER_DOC_TYPES: { id: TeacherDocType; label: string }[] = [
  { id: "contract", label: "Contract" },
  { id: "monthly-notebook", label: "Monthly Notebook" },
  { id: "yearly-program", label: "Yearly Program" },
  { id: "weekly-report", label: "Weekly Report" },
  { id: "mou", label: "MoU" },
];

export const docTypeLabel = (id: TeacherDocType) => TEACHER_DOC_TYPES.find((t) => t.id === id)?.label ?? id;

export type TeacherClass = { id: string; name: string; year: string };

export const TEACHER_CLASSES: TeacherClass[] = [
  { id: "c-1", name: "12A", year: "2026/27" },
  { id: "c-2", name: "12B", year: "2026/27" },
  { id: "c-3", name: "13A", year: "2026/27" },
];

export type BusinessMentor = { name: string; email: string; phone: string };

export type TeacherCompany = { id: string; name: string; address: string; mentor: BusinessMentor };

export const TEACHER_COMPANIES: TeacherCompany[] = [
  {
    id: "co-1",
    name: "Acme Mentors",
    address: "Torstraße 12, 10119 Berlin",
    mentor: { name: "Tom Richter", email: "tom@acmementors.com", phone: "+49 151 111 222" },
  },
  {
    id: "co-2",
    name: "Nordlicht Studio",
    address: "Oranienstraße 40, 10999 Berlin",
    mentor: { name: "Lena Brandt", email: "lena@nordlicht.studio", phone: "+49 152 333 444" },
  },
  {
    id: "co-3",
    name: "Spree Logistics",
    address: "Am Ostbahnhof 5, 10243 Berlin",
    mentor: { name: "Karim Haddad", email: "k.haddad@spree-logistics.de", phone: "+49 160 555 666" },
  },
  {
    id: "co-4",
    name: "Brightside Health",
    address: "Friedrichstraße 88, 10117 Berlin",
    mentor: { name: "Sofia Weber", email: "s.weber@brightside.health", phone: "+49 171 777 888" },
  },
];

export const companyOf = (id: string) => TEACHER_COMPANIES.find((c) => c.id === id);
export const classOf = (id: string) => TEACHER_CLASSES.find((c) => c.id === id);

export type TeacherAbsence = {
  id: string;
  date: string;
  reason: string;
  recordedBy: "Teacher" | "Business mentor";
  recorder: string;
};

export type ReviewVersion = { id: string; file: string; size: string; date: string };

export type ReviewComment = {
  id: string;
  author: string;
  date: string;
  body: string;
  /** What the review did; comments are shown neutrally either way. */
  action: "returned" | "approved";
};

export type TeacherDoc = {
  status: StatusKey;
  /** Latest upload; the review queue sorts by this, oldest first. */
  uploadedAt?: string;
  versions: ReviewVersion[];
  comments: ReviewComment[];
};

export type TeacherStudent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  companyId: string;
  /** Students this teacher follows closely (a dashboard count). */
  followed: boolean;
  documents: Record<TeacherDocType, TeacherDoc>;
  absences: TeacherAbsence[];
};

const FILE: Record<TeacherDocType, string> = {
  contract: "contract",
  "monthly-notebook": "notebook-october",
  "yearly-program": "yearly-program",
  "weekly-report": "week-43",
  mou: "mou",
};

const missing = (): TeacherDoc => ({ status: "missing", versions: [], comments: [] });
const generated = (): TeacherDoc => ({ status: "generated", versions: [], comments: [] });

/** A document with uploads on the given dates (oldest first); the last one is the current file. */
function doc(type: TeacherDocType, status: StatusKey, dates: string[], comments: ReviewComment[] = []): TeacherDoc {
  const versions = dates
    .map((date, i) => ({
      id: `v-${i + 1}`,
      file: `${FILE[type]}${i ? `-v${i + 1}` : ""}.${type === "monthly-notebook" ? "docx" : "pdf"}`,
      size: `${60 + ((date.charCodeAt(9) * 37 + i * 53) % 380)} KB`,
      date,
    }))
    .reverse();
  return { status, uploadedAt: dates.at(-1), versions, comments };
}

const returnedBy = (id: string, date: string, body: string): ReviewComment => ({
  id,
  author: TEACHER_ME.name,
  date,
  body,
  action: "returned",
});

const approvedBy = (id: string, date: string, body: string): ReviewComment => ({
  id,
  author: TEACHER_ME.name,
  date,
  body,
  action: "approved",
});

const absence = (
  id: string,
  date: string,
  reason: string,
  by: "Teacher" | "Business mentor",
  recorder: string,
): TeacherAbsence => ({ id, date, reason, recordedBy: by, recorder });

export const TEACHER_STUDENTS: TeacherStudent[] = [
  {
    id: "s-1",
    name: "Noah Keller",
    email: "noah.keller@internium.app",
    phone: "+49 176 100 2001",
    classId: "c-1",
    companyId: "co-1",
    followed: true,
    documents: {
      contract: doc("contract", "approved", ["2026-09-12", "2026-09-18"], [
        returnedBy("cm-1", "2026-09-14", "The company stamp is missing on page 3."),
        approvedBy("cm-2", "2026-09-19", "All signatures are in. Thanks!"),
      ]),
      "monthly-notebook": doc("monthly-notebook", "returned", ["2026-10-22"], [
        returnedBy("cm-3", "2026-10-24", "Please add the hours for each day and have your mentor sign page 2."),
      ]),
      "yearly-program": generated(),
      "weekly-report": doc("weekly-report", "uploaded", ["2026-10-26"]),
      mou: missing(),
    },
    absences: [
      absence("a-1", "2026-10-21", "Doctor appointment", "Business mentor", "Tom Richter"),
      absence("a-2", "2026-10-14", "Sick", "Teacher", TEACHER_ME.name),
      absence("a-3", "2026-09-30", "Family matter", "Business mentor", "Tom Richter"),
    ],
  },
  {
    id: "s-2",
    name: "Ella Fischer",
    email: "ella.fischer@internium.app",
    phone: "+49 176 100 2002",
    classId: "c-1",
    companyId: "co-2",
    followed: false,
    documents: {
      contract: doc("contract", "approved", ["2026-09-10"], [approvedBy("cm-1", "2026-09-11", "Looks good.")]),
      "monthly-notebook": doc("monthly-notebook", "uploaded", ["2026-10-02", "2026-10-19"], [
        returnedBy("cm-2", "2026-10-05", "September is missing the weekly summaries."),
      ]),
      "yearly-program": doc("yearly-program", "approved", ["2026-09-25"]),
      "weekly-report": doc("weekly-report", "approved", ["2026-10-23"]),
      mou: doc("mou", "uploaded", ["2026-10-28"]),
    },
    absences: [absence("a-1", "2026-10-09", "Sick", "Teacher", TEACHER_ME.name)],
  },
  {
    id: "s-3",
    name: "Liam Brooks",
    email: "liam.brooks@internium.app",
    phone: "+49 176 100 2003",
    classId: "c-1",
    companyId: "co-3",
    followed: true,
    documents: {
      contract: doc("contract", "uploaded", ["2026-10-08"]),
      "monthly-notebook": missing(),
      "yearly-program": generated(),
      "weekly-report": doc("weekly-report", "returned", ["2026-10-16"], [
        returnedBy("cm-1", "2026-10-18", "Describe what you learned, not only the tasks."),
      ]),
      mou: missing(),
    },
    absences: [
      absence("a-1", "2026-10-28", "Sick", "Business mentor", "Karim Haddad"),
      absence("a-2", "2026-10-23", "Sick", "Business mentor", "Karim Haddad"),
      absence("a-3", "2026-10-16", "Missed the train", "Business mentor", "Karim Haddad"),
      absence("a-4", "2026-10-07", "Unexcused", "Teacher", TEACHER_ME.name),
      absence("a-5", "2026-09-23", "Dentist", "Teacher", TEACHER_ME.name),
    ],
  },
  {
    id: "s-4",
    name: "Mia Novak",
    email: "mia.novak@internium.app",
    phone: "+49 176 100 2004",
    classId: "c-2",
    companyId: "co-4",
    followed: false,
    documents: {
      contract: doc("contract", "approved", ["2026-09-09"]),
      "monthly-notebook": doc("monthly-notebook", "approved", ["2026-10-01"]),
      "yearly-program": doc("yearly-program", "approved", ["2026-09-20"]),
      "weekly-report": doc("weekly-report", "uploaded", ["2026-10-27"]),
      mou: doc("mou", "approved", ["2026-09-30"]),
    },
    absences: [],
  },
  {
    id: "s-5",
    name: "Lucas Meyer",
    email: "lucas.meyer@internium.app",
    phone: "+49 176 100 2005",
    classId: "c-2",
    companyId: "co-1",
    followed: false,
    documents: {
      contract: doc("contract", "approved", ["2026-09-15"]),
      "monthly-notebook": doc("monthly-notebook", "uploaded", ["2026-10-12"]),
      "yearly-program": doc("yearly-program", "uploaded", ["2026-10-20"]),
      "weekly-report": generated(),
      mou: missing(),
    },
    absences: [
      absence("a-1", "2026-10-02", "Sick", "Teacher", TEACHER_ME.name),
      absence("a-2", "2026-09-25", "Family matter", "Business mentor", "Tom Richter"),
    ],
  },
  {
    id: "s-6",
    name: "Hannah Schulz",
    email: "hannah.schulz@internium.app",
    phone: "+49 176 100 2006",
    classId: "c-2",
    companyId: "co-2",
    followed: true,
    documents: {
      contract: doc("contract", "returned", ["2026-09-28"], [
        returnedBy("cm-1", "2026-09-30", "Your mentor's signature is missing on the last page."),
      ]),
      "monthly-notebook": missing(),
      "yearly-program": missing(),
      "weekly-report": doc("weekly-report", "uploaded", ["2026-10-14"]),
      mou: missing(),
    },
    absences: [
      absence("a-1", "2026-10-30", "Sick", "Business mentor", "Lena Brandt"),
      absence("a-2", "2026-10-21", "Sick", "Business mentor", "Lena Brandt"),
      absence("a-3", "2026-10-09", "Doctor appointment", "Teacher", TEACHER_ME.name),
      absence("a-4", "2026-09-18", "Unexcused", "Business mentor", "Lena Brandt"),
    ],
  },
  {
    id: "s-7",
    name: "Ben Wagner",
    email: "ben.wagner@internium.app",
    phone: "+49 176 100 2007",
    classId: "c-3",
    companyId: "co-3",
    followed: false,
    documents: {
      contract: doc("contract", "approved", ["2026-09-11"]),
      "monthly-notebook": doc("monthly-notebook", "approved", ["2026-10-03"]),
      "yearly-program": doc("yearly-program", "returned", ["2026-10-06"], [
        returnedBy("cm-1", "2026-10-08", "Add at least three measurable goals for the year."),
      ]),
      "weekly-report": doc("weekly-report", "uploaded", ["2026-10-25"]),
      mou: doc("mou", "uploaded", ["2026-10-05"]),
    },
    absences: [absence("a-1", "2026-10-28", "Public transport strike", "Business mentor", "Karim Haddad")],
  },
  {
    id: "s-8",
    name: "Sara Klein",
    email: "sara.klein@internium.app",
    phone: "+49 176 100 2008",
    classId: "c-3",
    companyId: "co-4",
    followed: false,
    documents: {
      contract: doc("contract", "approved", ["2026-09-10"]),
      "monthly-notebook": doc("monthly-notebook", "approved", ["2026-10-02"]),
      "yearly-program": doc("yearly-program", "approved", ["2026-09-22"]),
      "weekly-report": doc("weekly-report", "approved", ["2026-10-24"]),
      mou: doc("mou", "approved", ["2026-09-29"]),
    },
    absences: [],
  },
  {
    id: "s-9",
    name: "Jonas Becker",
    email: "jonas.becker@internium.app",
    phone: "+49 176 100 2009",
    classId: "c-3",
    companyId: "co-1",
    followed: true,
    documents: {
      contract: doc("contract", "approved", ["2026-09-16"]),
      "monthly-notebook": doc("monthly-notebook", "uploaded", ["2026-10-01", "2026-10-09"], [
        returnedBy("cm-1", "2026-10-04", "The October dates are in the wrong order."),
      ]),
      "yearly-program": doc("yearly-program", "uploaded", ["2026-10-29"]),
      "weekly-report": missing(),
      mou: generated(),
    },
    absences: [
      absence("a-1", "2026-10-27", "Sick", "Teacher", TEACHER_ME.name),
      absence("a-2", "2026-10-26", "Sick", "Teacher", TEACHER_ME.name),
      absence("a-3", "2026-10-02", "Driving test", "Business mentor", "Tom Richter"),
      absence("a-4", "2026-09-29", "Family matter", "Business mentor", "Tom Richter"),
    ],
  },
];

export const docsApproved = (s: TeacherStudent) =>
  TEACHER_DOC_TYPES.filter((t) => s.documents[t.id].status === "approved").length;
