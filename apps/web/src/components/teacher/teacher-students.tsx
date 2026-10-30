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
import { Input } from "@internium/ui/components/input";
import { Progress } from "@internium/ui/components/progress";
import {
  BriefcaseIcon,
  ChatCircleIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UserMinusIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminDropdown, AdminPage, AdminTable, AdminTableEmpty, CELL, formatDate } from "@/components/admin/admin-table";
import { CHAT_PATH } from "@/constants/chat";
import {
  ABSENCE_THRESHOLD,
  addAbsence,
  applyReview,
  docTypeLabel,
  reviewKey,
  TEACHER_CLASSES,
  TEACHER_COMPANIES,
  TEACHER_DOC_TYPES,
  TEACHER_STUDENTS,
  type TeacherDocType,
  type TeacherStudent,
  classOf,
  companyOf,
  docsApproved,
} from "@/constants/teacher";
import { ReviewSheet } from "@/components/teacher/review-sheet";
import { AddAbsenceDialog } from "@/components/teacher/add-absence-dialog";
import { StudentSheet } from "@/components/teacher/student-sheet";
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

type AbsenceFilter = "all" | "some" | "above";

/** Messaging hands off to Chat; the conversation itself lives there. */
export function useMessage() {
  const router = useRouter();
  return (name: string) => {
    toast(`Opening chat with ${name}`);
    router.push(getRoleHref("teacher", CHAT_PATH));
  };
}

export function TeacherStudents() {
  const [students, setStudents] = useState(TEACHER_STUDENTS);
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("all");
  const [companyId, setCompanyId] = useState("all");
  const [absences, setAbsences] = useState<AbsenceFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState("info");
  const [absenceFor, setAbsenceFor] = useState<string | null>(null);
  const [docType, setDocType] = useState<TeacherDocType | null>(null);
  const message = useMessage();
  const openStudent = students.find((s) => s.id === openId) ?? null;
  const shown = useRetained(openStudent);
  const absenceStudent = students.find((s) => s.id === absenceFor) ?? null;
  const shownAbsence = useRetained(absenceStudent);

  // Review from the student sheet: prev/next steps through this student's submitted documents.
  const docItems = shown
    ? TEACHER_DOC_TYPES.filter((t) => shown.documents[t.id].versions.length > 0).map((t) => ({
        key: reviewKey(shown.id, t.id),
        student: shown,
        type: t.id,
        doc: shown.documents[t.id],
      }))
    : [];
  const reviewing = docItems.find((i) => i.type === docType) ?? null;
  const shownReview = useRetained(reviewing);
  const reviewIndex = shownReview ? docItems.findIndex((i) => i.type === shownReview.type) : -1;
  const prevDoc = docItems[reviewIndex - 1];
  const nextDoc = reviewIndex >= 0 ? docItems[reviewIndex + 1] : undefined;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("absences") === "above") setAbsences("above");
    const student = params.get("student");
    if (student) {
      setTab(params.get("tab") ?? "info");
      setOpenId(student);
    }
  }, []);

  const visible = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (classId === "all" || s.classId === classId) &&
      (companyId === "all" || s.companyId === companyId) &&
      (absences === "all" ||
        (absences === "some" ? s.absences.length > 0 : s.absences.length > ABSENCE_THRESHOLD)),
  );

  function open(s: TeacherStudent, nextTab = "info") {
    setTab(nextTab);
    setOpenId(s.id);
  }

  return (
    <AdminPage title="My Students" description="Placements, document progress, and absences.">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <MagnifyingGlassIcon
            weight={ICON_WEIGHT}
            className="-translate-y-1/2 absolute top-1/2 left-2.5 size-3.5 text-muted-foreground"
          />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students" className="pl-8" />
        </div>
        <AdminDropdown
          label="Class"
          value={classId}
          onChange={setClassId}
          items={[{ value: "all", label: "All classes" }, ...TEACHER_CLASSES.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <AdminDropdown
          label="Company"
          value={companyId}
          onChange={setCompanyId}
          items={[
            { value: "all", label: "All companies" },
            ...TEACHER_COMPANIES.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <AdminDropdown<AbsenceFilter>
          label="Absences"
          value={absences}
          onChange={setAbsences}
          items={[
            { value: "all", label: "Any absences" },
            { value: "some", label: "Has absences" },
            { value: "above", label: `Above threshold (${ABSENCE_THRESHOLD})` },
          ]}
        />
      </div>

      <AdminTable
        head={[
          { label: "Name" },
          { label: "Class" },
          { label: "Company" },
          { label: "Business mentor" },
          { label: "Documents" },
          { label: "Absences" },
          { label: "", className: "w-8" },
        ]}
        empty={visible.length === 0 ? <AdminTableEmpty>No students match these filters.</AdminTableEmpty> : undefined}
      >
        {visible.map((s) => {
          const done = docsApproved(s);
          const company = companyOf(s.companyId);
          const over = s.absences.length > ABSENCE_THRESHOLD;
          return (
            <tr key={s.id} onClick={() => open(s)} className="cursor-pointer transition-colors hover:bg-muted/40">
              <td className={cn(CELL, "font-medium")}>{s.name}</td>
              <td className={CELL}>{classOf(s.classId)?.name ?? "—"}</td>
              <td className={CELL}>{company?.name ?? "—"}</td>
              <td className={CELL}>{company?.mentor.name ?? "—"}</td>
              <td className={CELL}>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-muted-foreground tabular-nums">
                    {done}/{TEACHER_DOC_TYPES.length}
                  </span>
                  <Progress value={(done / TEACHER_DOC_TYPES.length) * 100} className="w-16" />
                </div>
              </td>
              <td className={cn(CELL, "tabular-nums", s.absences.length === 0 && "text-muted-foreground")}>
                <span className="inline-flex items-center gap-1.5">
                  {s.absences.length}
                  {over ? (
                    <span className="size-1.5 rounded-full bg-amber-500" title={`Above ${ABSENCE_THRESHOLD}`} />
                  ) : null}
                </span>
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
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => open(s)}>
                      <UserIcon weight={ICON_WEIGHT} />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAbsenceFor(s.id)}>
                      <UserMinusIcon weight={ICON_WEIGHT} />
                      Add absence
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => message(s.name)}>
                      <ChatCircleIcon weight={ICON_WEIGHT} />
                      Message student
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!company} onClick={() => company && message(company.mentor.name)}>
                      <BriefcaseIcon weight={ICON_WEIGHT} />
                      Message business mentor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {shown ? (
        <StudentSheet
          open={openStudent !== null}
          student={shown}
          tab={tab}
          onTabChange={setTab}
          onClose={() => {
            setOpenId(null);
            setDocType(null);
          }}
          onOpenDocument={setDocType}
          onAddAbsence={() => setAbsenceFor(shown.id)}
          onMessage={message}
        />
      ) : null}
      {shownReview ? (
        <ReviewSheet
          open={reviewing !== null && openStudent !== null}
          item={shownReview}
          index={Math.max(reviewIndex, 0)}
          total={docItems.length}
          onPrev={prevDoc ? () => setDocType(prevDoc.type) : undefined}
          onNext={nextDoc ? () => setDocType(nextDoc.type) : undefined}
          onClose={() => setDocType(null)}
          onReview={(action, comment) => {
            setStudents((cur) => applyReview(cur, shownReview.key, action, comment));
            toast.success(action === "approved" ? "Approved" : "Returned", {
              description: `${docTypeLabel(shownReview.type)} · ${shownReview.student.name}`,
            });
          }}
        />
      ) : null}

      <AddAbsenceDialog
        open={absenceStudent !== null}
        studentName={shownAbsence?.name ?? ""}
        onClose={() => setAbsenceFor(null)}
        onAdd={(date, reason) => {
          if (!absenceFor) return;
          setStudents((cur) => addAbsence(cur, absenceFor, date, reason));
          toast.success("Absence added", { description: `${shownAbsence?.name} · ${formatDate(date)}` });
          setAbsenceFor(null);
        }}
      />
    </AdminPage>
  );
}
