"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { CaretLeftIcon, CaretRightIcon, CheckCircleIcon, LockSimpleIcon, StudentIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPage, AdminTable, CELL, PRESS } from "@/components/admin/admin-table";
import { AttendanceButtons, useMarkAttendance, weekLabel } from "@/components/business-mentor/attendance-controls";
import { StatusBadge } from "@/components/status-badge";
import {
  ATTENDANCE_EDIT_WEEKS,
  CURRENT_WEEK,
  MENTOR_STUDENTS,
  WEEKS,
  entryFor,
  isEditableWeek,
} from "@/constants/business-mentor";
import { classOf } from "@/constants/teacher";
import { setAttendance, useAttendance } from "@/lib/attendance-store";
import { cn } from "@/lib/utils";

export function NoStudents() {
  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-10 text-center text-xs">
      <StudentIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground" />
      <span className="font-medium">No students assigned to your company yet.</span>
      <span className="text-muted-foreground">They show up here once the school places them with you.</span>
    </div>
  );
}

export function MentorAttendance() {
  const book = useAttendance();
  const [index, setIndex] = useState(WEEKS.length - 1);
  const week = WEEKS[index] ?? CURRENT_WEEK;
  const editable = isEditableWeek(week);
  const { markPresent, askAbsent, dialog } = useMarkAttendance();

  const rows = MENTOR_STUDENTS.map((s) => ({ student: s, entry: entryFor(book, s.id, week) }));
  const pending = rows.filter((r) => r.entry.status === "pending");
  const counts = {
    present: rows.filter((r) => r.entry.status === "present").length,
    absent: rows.filter((r) => r.entry.status === "absent").length,
  };

  function confirmAll() {
    const ids = pending.map((r) => r.student.id);
    setAttendance(ids.map((studentId) => ({ studentId, week, entry: { status: "present" } })));
    toast.success(`${ids.length} marked present`, {
      description: weekLabel(week),
      action: {
        label: "Undo",
        onClick: () => setAttendance(ids.map((studentId) => ({ studentId, week, entry: { status: "pending" } }))),
      },
    });
  }

  return (
    <AdminPage
      title="Attendance"
      description="Confirm each student once a week. Absences notify their teacher."
      actions={
        <Button className={PRESS} disabled={!editable || pending.length === 0} onClick={confirmAll}>
          <CheckCircleIcon weight={ICON_WEIGHT} />
          Confirm all present
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous week"
            className={PRESS}
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <CaretLeftIcon weight={ICON_WEIGHT} />
          </Button>
          <span className="min-w-40 px-1 text-center text-xs font-medium tabular-nums">{weekLabel(week)}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next week"
            className={PRESS}
            disabled={index === WEEKS.length - 1}
            onClick={() => setIndex((i) => Math.min(WEEKS.length - 1, i + 1))}
          >
            <CaretRightIcon weight={ICON_WEIGHT} />
          </Button>
        </div>
        {week !== CURRENT_WEEK ? (
          <Button variant="ghost" size="sm" className={PRESS} onClick={() => setIndex(WEEKS.length - 1)}>
            This week
          </Button>
        ) : null}
        {!editable ? (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LockSimpleIcon weight={ICON_WEIGHT} className="size-3" />
            Read-only. Only the last {ATTENDANCE_EDIT_WEEKS} weeks can be changed.
          </span>
        ) : null}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {counts.present} present · {counts.absent} absent · {pending.length} pending
        </span>
      </div>

      <AdminTable
        head={[
          { label: "Student" },
          { label: "Class" },
          { label: "Status" },
          { label: "Reason" },
          { label: "", className: "w-44" },
        ]}
        empty={MENTOR_STUDENTS.length === 0 ? <NoStudents /> : undefined}
      >
        {rows.map(({ student: s, entry }) => (
          <tr key={s.id} className="transition-colors hover:bg-muted/40">
            <td className={cn(CELL, "font-medium")}>{s.name}</td>
            <td className={CELL}>{classOf(s.classId)?.name ?? "—"}</td>
            <td className={CELL}>
              <StatusBadge status={entry.status} />
            </td>
            <td className={cn(CELL, "max-w-64 truncate text-muted-foreground")}>{entry.reason ?? "—"}</td>
            <td className={cn(CELL, "py-1")}>
              {editable ? (
                <AttendanceButtons
                  entry={entry}
                  onPresent={() => markPresent(s.id, s.name, week, entry)}
                  onAbsent={() => askAbsent({ studentId: s.id, name: s.name, week, reason: entry.reason })}
                />
              ) : null}
            </td>
          </tr>
        ))}
      </AdminTable>
      {dialog}
    </AdminPage>
  );
}
