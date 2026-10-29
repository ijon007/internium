"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@internium/ui/components/alert-dialog";
import { Button } from "@internium/ui/components/button";
import { Checkbox } from "@internium/ui/components/checkbox";
import { Switch } from "@internium/ui/components/switch";
import { BellRingingIcon, FilePlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminDropdown,
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  PRESS,
} from "@/components/admin/admin-table";
import { DOCUMENT_STATUS_STYLES } from "@/components/coordinator/document-status";
import { GenerateDocumentDialog } from "@/components/coordinator/generate-document-dialog";
import {
  CLASSES,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_TYPES,
  type DocumentStatus,
  STUDENTS,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";

const STATUSES = Object.keys(DOCUMENT_STATUS_LABELS) as DocumentStatus[];
const hasMissing = (s: (typeof STUDENTS)[number]) =>
  Object.values(s.documents).includes("missing");

export function CoordinatorDocuments() {
  const [classId, setClassId] = useState("all");
  const [status, setStatus] = useState<"all" | DocumentStatus>("all");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [reminding, setReminding] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("missing") === "1") {
      setOnlyMissing(true);
    }
  }, []);

  const visible = STUDENTS.filter(
    (s) =>
      (classId === "all" || s.classId === classId) &&
      (status === "all" || Object.values(s.documents).includes(status)) &&
      (!onlyMissing || hasMissing(s)),
  );
  const allChecked = visible.length > 0 && visible.every((s) => selected.includes(s.id));
  const targets = selected.length
    ? STUDENTS.filter((s) => selected.includes(s.id))
    : visible.filter(hasMissing);

  return (
    <AdminPage
      title="Documents"
      description="Every required document, per student."
      actions={
        <>
          <Button
            variant="outline"
            className={PRESS}
            disabled={targets.length === 0}
            onClick={() => setReminding(true)}
          >
            <BellRingingIcon weight={ICON_WEIGHT} />
            {selected.length ? `Remind ${selected.length}` : "Remind missing"}
          </Button>
          <Button className={PRESS} onClick={() => setGenerating(true)}>
            <FilePlusIcon weight={ICON_WEIGHT} />
            Generate
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <AdminDropdown
          label="Class"
          value={classId}
          onChange={setClassId}
          items={[
            { value: "all", label: "All classes" },
            ...CLASSES.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <AdminDropdown<"all" | DocumentStatus>
          label="Status"
          value={status}
          onChange={setStatus}
          items={[
            { value: "all", label: "Any status" },
            ...STATUSES.map((s) => ({ value: s, label: DOCUMENT_STATUS_LABELS[s] })),
          ]}
        />
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <Switch checked={onlyMissing} onCheckedChange={setOnlyMissing} />
          Only missing
        </label>
        <ul className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-sm", DOCUMENT_STATUS_STYLES[s])} />
              {DOCUMENT_STATUS_LABELS[s]}
            </li>
          ))}
        </ul>
      </div>

      <AdminTable
        head={[
          {
            label: (
              <Checkbox
                aria-label="Select all"
                checked={allChecked}
                onCheckedChange={(checked) =>
                  setSelected(checked ? visible.map((s) => s.id) : [])
                }
              />
            ),
            className: "w-8",
          },
          { label: "Student" },
          { label: "Class" },
          ...DOCUMENT_TYPES.map((d) => ({ label: d.label, className: "text-center" })),
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>Nothing matches these filters.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((s) => (
          <tr key={s.id} className="transition-colors hover:bg-muted/40">
            <td className={CELL}>
              <Checkbox
                aria-label={`Select ${s.name}`}
                checked={selected.includes(s.id)}
                onCheckedChange={(checked) =>
                  setSelected((cur) =>
                    checked ? [...cur, s.id] : cur.filter((id) => id !== s.id),
                  )
                }
              />
            </td>
            <td className={cn(CELL, "font-medium")}>{s.name}</td>
            <td className={cn(CELL, "text-muted-foreground")}>
              {CLASSES.find((c) => c.id === s.classId)?.name}
            </td>
            {DOCUMENT_TYPES.map((d) => {
              const st = s.documents[d.id];
              return (
                <td key={d.id} className={cn(CELL, "text-center")}>
                  <span
                    title={`${d.label}: ${DOCUMENT_STATUS_LABELS[st]}`}
                    className={cn(
                      "inline-flex h-5 min-w-16 items-center justify-center rounded-md px-1.5 text-[10px] font-medium",
                      DOCUMENT_STATUS_STYLES[st],
                      status !== "all" && st !== status && "opacity-30",
                    )}
                  >
                    {DOCUMENT_STATUS_LABELS[st]}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </AdminTable>

      <AlertDialog open={reminding} onOpenChange={setReminding}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send reminder?</AlertDialogTitle>
            <AlertDialogDescription>
              {targets.length} {targets.length === 1 ? "student" : "students"} will get an
              email listing their missing documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              className={PRESS}
              onClick={() => {
                toast.success(
                  `Reminder sent to ${targets.length} ${targets.length === 1 ? "student" : "students"}`,
                );
                setReminding(false);
                setSelected([]);
              }}
            >
              Send reminder
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GenerateDocumentDialog
        open={generating}
        onOpenChange={setGenerating}
        students={STUDENTS}
        initialStudentIds={selected}
      />
    </AdminPage>
  );
}
