"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { Progress } from "@internium/ui/components/progress";
import { ChalkboardTeacherIcon, ChatCircleIcon, DotsThreeIcon, UserIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { AdminPage, AdminTable, CELL } from "@/components/admin/admin-table";
import { NoStudents } from "@/components/business-mentor/mentor-attendance";
import { MentorStudentSheet } from "@/components/business-mentor/mentor-student-sheet";
import { useMentorMessage } from "@/components/business-mentor/use-mentor-message";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { MENTOR_STUDENTS, SCHOOL_TEACHER, attendanceSummary } from "@/constants/business-mentor";
import { TEACHER_DOC_TYPES, type TeacherStudent, classOf, docsApproved } from "@/constants/teacher";
import { useRetained } from "@/hooks/use-retained";
import { useAttendance } from "@/lib/attendance-store";
import type { ViewerFile } from "@/lib/document-files";
import { cn } from "@/lib/utils";

export function MentorStudents() {
  const book = useAttendance();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState("info");
  const [viewing, setViewing] = useState<ViewerFile | null>(null);
  const message = useMentorMessage();
  const openStudent = MENTOR_STUDENTS.find((s) => s.id === openId) ?? null;
  const shown = useRetained(openStudent);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const student = params.get("student");
    if (student) {
      setTab(params.get("tab") ?? "info");
      setOpenId(student);
    }
  }, []);

  function open(s: TeacherStudent, nextTab = "info") {
    setTab(nextTab);
    setOpenId(s.id);
  }

  return (
    <AdminPage title="My Students" description="Interns placed at your company this school year.">
      <AdminTable
        head={[
          { label: "Name" },
          { label: "Class" },
          { label: "School mentor teacher" },
          { label: "Documents" },
          { label: "Attendance" },
          { label: "", className: "w-8" },
        ]}
        empty={MENTOR_STUDENTS.length === 0 ? <NoStudents /> : undefined}
      >
        {MENTOR_STUDENTS.map((s) => {
          const done = docsApproved(s);
          const { present, total } = attendanceSummary(book, s.id);
          return (
            <tr key={s.id} onClick={() => open(s)} className="cursor-pointer transition-colors hover:bg-muted/40">
              <td className={cn(CELL, "font-medium")}>{s.name}</td>
              <td className={CELL}>{classOf(s.classId)?.name ?? "—"}</td>
              <td className={CELL}>{SCHOOL_TEACHER.name}</td>
              <td className={CELL}>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-muted-foreground tabular-nums">
                    {done}/{TEACHER_DOC_TYPES.length}
                  </span>
                  <Progress value={(done / TEACHER_DOC_TYPES.length) * 100} className="w-16" />
                </div>
              </td>
              <td className={cn(CELL, "tabular-nums")}>
                {present}/{total} <span className="text-muted-foreground">weeks</span>
              </td>
              <td className={CELL} onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" aria-label="Actions">
                        <DotsThreeIcon weight="bold" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => open(s)}>
                      <UserIcon weight={ICON_WEIGHT} />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => message(s.name)}>
                      <ChatCircleIcon weight={ICON_WEIGHT} />
                      Message student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => message(SCHOOL_TEACHER.name)}>
                      <ChalkboardTeacherIcon weight={ICON_WEIGHT} />
                      Message teacher
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {shown ? (
        <MentorStudentSheet
          open={openStudent !== null}
          student={shown}
          book={book}
          tab={tab}
          onTabChange={setTab}
          onClose={() => setOpenId(null)}
          onView={setViewing}
          onMessage={message}
        />
      ) : null}
      <DocumentViewer file={viewing} onClose={() => setViewing(null)} />
    </AdminPage>
  );
}
