import {
  TEACHER_COMPANIES,
  TEACHER_ME,
  TEACHER_STUDENTS,
  type TeacherStudent,
} from "@/constants/teacher";

/**
 * Mock "today" for the business mentor views. Fixed so prerender never calls `new Date()`
 * and the current week is stable across server and client.
 */
export const MENTOR_TODAY = "2026-10-30";

/** How many weeks the mentor may still change: the current week and the one before it. */
export const ATTENDANCE_EDIT_WEEKS = 2;

/** First Monday of the internship; attendance is tracked once per week from here. */
export const INTERNSHIP_START = "2026-08-31";

/** The signed-in business mentor (mock) and their company. Students are shared with the teacher mocks. */
export const MENTOR_COMPANY = TEACHER_COMPANIES.find((c) => c.id === "co-1") ?? TEACHER_COMPANIES[0]!;
export const MENTOR_ME = MENTOR_COMPANY.mentor;

export const MENTOR_STUDENTS: TeacherStudent[] = TEACHER_STUDENTS.filter((s) => s.companyId === MENTOR_COMPANY.id);

/** The school mentor teacher for each student (all of them are followed by the mock teacher). */
export const SCHOOL_TEACHER = { ...TEACHER_ME, phone: "+49 30 555 0142" };

export type AttendanceStatus = "pending" | "present" | "absent";
export type AttendanceEntry = { status: AttendanceStatus; reason?: string };
/** studentId → week (Monday, yyyy-mm-dd) → entry. Missing entries are pending. */
export type AttendanceBook = Record<string, Record<string, AttendanceEntry>>;

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** Monday of the week containing `day`. */
export function weekOf(day: string) {
  const d = utc(day);
  return iso(new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY));
}

export const addWeeks = (week: string, n: number) => iso(new Date(utc(week).getTime() + n * 7 * DAY));
export const weekEnd = (week: string) => iso(new Date(utc(week).getTime() + 4 * DAY));

export const CURRENT_WEEK = weekOf(MENTOR_TODAY);

/** Every internship week up to and including the current one, oldest first. */
export const WEEKS: string[] = (() => {
  const out: string[] = [];
  for (let w = INTERNSHIP_START; w <= CURRENT_WEEK; w = addWeeks(w, 1)) out.push(w);
  return out;
})();

/** Weeks the mentor can still edit; older weeks are read-only. */
export const isEditableWeek = (week: string) =>
  week <= CURRENT_WEEK && week > addWeeks(CURRENT_WEEK, -ATTENDANCE_EDIT_WEEKS);

/**
 * Seed: past weeks are confirmed; weeks with an absence the mentor already recorded (teacher mocks)
 * are absent with that reason. The current week is open, and one student is still pending last week.
 */
export const SEED_ATTENDANCE: AttendanceBook = Object.fromEntries(
  MENTOR_STUDENTS.map((s) => {
    const book: Record<string, AttendanceEntry> = {};
    for (const week of WEEKS) {
      if (week === CURRENT_WEEK) continue;
      const missed = s.absences.filter((a) => a.recordedBy === "Business mentor" && weekOf(a.date) === week);
      book[week] = missed.length
        ? { status: "absent", reason: missed.map((a) => a.reason).join(", ") }
        : { status: "present" };
    }
    if (s.id === "s-5") delete book[addWeeks(CURRENT_WEEK, -1)];
    return [s.id, book];
  }),
);

export const entryFor = (book: AttendanceBook, studentId: string, week: string): AttendanceEntry =>
  book[studentId]?.[week] ?? { status: "pending" };

/** Weeks present out of weeks so far (e.g. 8/9). */
export function attendanceSummary(book: AttendanceBook, studentId: string) {
  const present = WEEKS.filter((w) => entryFor(book, studentId, w).status === "present").length;
  return { present, total: WEEKS.length };
}

export const ABSENCE_REASONS = ["Sick", "Doctor appointment", "Family matter", "Unexcused"];
