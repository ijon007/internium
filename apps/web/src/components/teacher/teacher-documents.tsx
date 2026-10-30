"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { AdminDropdown, AdminPage, AdminTable, AdminTableEmpty, CELL, formatDate } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/status-badge";
import { DocTypeTile } from "@/components/student/student-documents";
import {
  TEACHER_CLASSES,
  TEACHER_DOC_TYPES,
  TEACHER_STUDENTS,
  allDocuments,
  classOf,
  docTypeLabel,
} from "@/constants/teacher";
import { cn } from "@/lib/utils";

type StatusFilter = "uploaded" | "returned" | "approved" | "all";

const STATUS_ITEMS: { value: StatusFilter; label: string }[] = [
  { value: "uploaded", label: "Waiting review" },
  { value: "returned", label: "Returned" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All submitted" },
];

export function TeacherDocuments() {
  const [students, setStudents] = useState(TEACHER_STUDENTS);
  const [status, setStatus] = useState<StatusFilter>("uploaded");
  const [type, setType] = useState("all");
  const [classId, setClassId] = useState("all");
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("review");
    if (key) setOpenKey(key);
  }, []);

  // Review queue: submitted documents only, oldest upload first.
  const visible = allDocuments(students)
    .filter(
      (i) =>
        i.doc.uploadedAt &&
        (status === "all" || i.doc.status === status) &&
        (type === "all" || i.type === type) &&
        (classId === "all" || i.student.classId === classId),
    )
    .sort((a, b) => (a.doc.uploadedAt ?? "").localeCompare(b.doc.uploadedAt ?? ""));

  return (
    <AdminPage title="Documents" description="Review submitted documents, oldest first.">
      <div className="flex flex-wrap items-center gap-2">
        <AdminDropdown<StatusFilter> label="Status" value={status} onChange={setStatus} items={STATUS_ITEMS} />
        <AdminDropdown
          label="Type"
          value={type}
          onChange={setType}
          items={[{ value: "all", label: "All types" }, ...TEACHER_DOC_TYPES.map((t) => ({ value: t.id, label: t.label }))]}
        />
        <AdminDropdown
          label="Class"
          value={classId}
          onChange={setClassId}
          items={[{ value: "all", label: "All classes" }, ...TEACHER_CLASSES.map((c) => ({ value: c.id, label: c.name }))]}
        />
        {status === "uploaded" ? (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">{visible.length} waiting</span>
        ) : null}
      </div>

      <AdminTable
        head={[
          { label: "Student" },
          { label: "Class" },
          { label: "Type" },
          { label: "Uploaded" },
          { label: "Status" },
        ]}
        empty={
          visible.length === 0 ? (
            status === "uploaded" ? (
              <div className="flex flex-col items-center gap-1.5 px-3 py-10 text-center text-xs">
                <CheckCircleIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground" />
                <span className="font-medium">Nothing waiting for review.</span>
                <span className="text-muted-foreground">New uploads from your students show up here.</span>
              </div>
            ) : (
              <AdminTableEmpty>No documents match these filters.</AdminTableEmpty>
            )
          ) : undefined
        }
      >
        {visible.map((i) => (
          <tr key={i.key} onClick={() => setOpenKey(i.key)} className="cursor-pointer transition-colors hover:bg-muted/40">
            <td className={cn(CELL, "font-medium")}>{i.student.name}</td>
            <td className={CELL}>{classOf(i.student.classId)?.name ?? "—"}</td>
            <td className={CELL}>
              <span className="flex items-center gap-2">
                <span className="[&>span]:size-6 [&>span]:rounded-[7px] [&_svg]:size-3.5">
                  <DocTypeTile id={i.type} />
                </span>
                {docTypeLabel(i.type)}
              </span>
            </td>
            <td className={cn(CELL, "text-muted-foreground tabular-nums")}>{formatDate(i.doc.uploadedAt ?? "")}</td>
            <td className={CELL}>
              <StatusBadge status={i.doc.status} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminPage>
  );
}
