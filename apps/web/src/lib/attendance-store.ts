"use client";

import { useSyncExternalStore } from "react";
import {
  type AttendanceBook,
  type AttendanceEntry,
  MENTOR_ME,
  SEED_ATTENDANCE,
  weekOf,
} from "@/constants/business-mentor";
import type { TeacherAbsence, TeacherStudent } from "@/constants/teacher";

/**
 * Session-wide mock store for weekly attendance. The mentor dashboard and attendance page read
 * the same book, and absences recorded here show up in the teacher's My Students (mock "notify").
 * Nothing persists across reloads.
 */
let book: AttendanceBook = SEED_ATTENDANCE;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getBook = () => book;
const getSeed = () => SEED_ATTENDANCE;

export function useAttendance() {
  return useSyncExternalStore(subscribe, getBook, getSeed);
}

export function setAttendance(changes: { studentId: string; week: string; entry: AttendanceEntry }[]) {
  const next = { ...book };
  for (const { studentId, week, entry } of changes) next[studentId] = { ...next[studentId], [week]: entry };
  book = next;
  for (const l of listeners) l();
}

/**
 * The teacher's students with this session's mentor changes applied: new absences are added,
 * and seeded mentor absences for a week the mentor has since corrected are dropped.
 */
export function withSessionAbsences(students: TeacherStudent[], current: AttendanceBook): TeacherStudent[] {
  if (current === SEED_ATTENDANCE) return students;
  return students.map((s) => {
    const weeks = current[s.id];
    if (!weeks) return s;
    const changed = Object.keys(weeks).filter((w) => weeks[w] !== SEED_ATTENDANCE[s.id]?.[w]);
    if (changed.length === 0) return s;
    const kept = s.absences.filter(
      (a) => !(a.recordedBy === "Business mentor" && a.recorder === MENTOR_ME.name && changed.includes(weekOf(a.date))),
    );
    const added: TeacherAbsence[] = changed
      .filter((w) => weeks[w]?.status === "absent")
      .map((w) => ({
        id: `bm-${w}`,
        date: w,
        reason: weeks[w]?.reason ?? "",
        recordedBy: "Business mentor",
        recorder: MENTOR_ME.name,
      }));
    return { ...s, absences: [...added, ...kept].sort((a, b) => b.date.localeCompare(a.date)) };
  });
}
