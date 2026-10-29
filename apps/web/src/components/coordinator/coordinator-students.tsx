"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Checkbox } from "@internium/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import { Progress } from "@internium/ui/components/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@internium/ui/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@internium/ui/components/tabs";
import {
  BuildingsIcon,
  DotsThreeIcon,
  ExportIcon,
  FileArrowUpIcon,
  FilePlusIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminDropdown,
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  formatDate,
  PRESS,
} from "@/components/admin/admin-table";
import { DocumentStatusBadge } from "@/components/coordinator/document-status";
import { GenerateDocumentSheet } from "@/components/coordinator/generate-document-sheet";
import {
  CLASSES,
  COMPANIES,
  DOCUMENT_TYPES,
  docProgress,
  STUDENTS,
  type Student,
  teacherName,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";

const ACTIVE_CLASSES = CLASSES.filter((c) => !c.archived);
const className_ = (id: string) => CLASSES.find((c) => c.id === id)?.name ?? "—";
const company = (id?: string) => COMPANIES.find((c) => c.id === id);
const mentor = (companyId?: string, mentorId?: string) =>
  company(companyId)?.mentors.find((m) => m.id === mentorId);

type Placement = "all" | "assigned" | "unassigned";

export function CoordinatorStudents() {
  const [students, setStudents] = useState(STUDENTS);
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("all");
  const [companyId, setCompanyId] = useState("all");
  const [placement, setPlacement] = useState<Placement>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [assignIds, setAssignIds] = useState<string[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("filter") === "unassigned") setPlacement("unassigned");
  }, []);

  const visible = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (classId === "all" || s.classId === classId) &&
      (companyId === "all" || s.companyId === companyId) &&
      (placement === "all" ||
        (placement === "unassigned" ? !s.companyId : Boolean(s.companyId))),
  );
  const allChecked = visible.length > 0 && visible.every((s) => selected.includes(s.id));
  const open = students.find((s) => s.id === openId) ?? null;

  function patch(ids: string[], data: Partial<Student>) {
    setStudents((cur) => cur.map((s) => (ids.includes(s.id) ? { ...s, ...data } : s)));
  }

  return (
    <AdminPage
      title="Students"
      description="Placements, documents, and absences for every student."
      actions={
        <>
          <Button variant="outline" className={PRESS} onClick={() => setImporting(true)}>
            <FileArrowUpIcon weight={ICON_WEIGHT} />
            Import
          </Button>
          <Button className={PRESS} onClick={() => setAdding(true)}>
            <PlusIcon weight="bold" />
            Add student
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <MagnifyingGlassIcon
            weight={ICON_WEIGHT}
            className="-translate-y-1/2 absolute top-1/2 left-2.5 size-3.5 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students"
            className="pl-8"
          />
        </div>
        <AdminDropdown
          label="Class"
          value={classId}
          onChange={setClassId}
          items={[
            { value: "all", label: "All classes" },
            ...CLASSES.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <AdminDropdown
          label="Company"
          value={companyId}
          onChange={setCompanyId}
          items={[
            { value: "all", label: "All companies" },
            ...COMPANIES.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <AdminDropdown<Placement>
          label="Placement"
          value={placement}
          onChange={setPlacement}
          items={[
            { value: "all", label: "Any placement" },
            { value: "assigned", label: "Assigned" },
            { value: "unassigned", label: "Unassigned" },
          ]}
        />
      </div>

      {selected.length > 0 ? (
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 text-xs">
          <span className="font-medium tabular-nums">{selected.length} selected</span>
          <Button
            size="sm"
            variant="ghost"
            className={cn("ml-auto", PRESS)}
            onClick={() => setSelected([])}
          >
            Clear
          </Button>
          <Button size="sm" className={PRESS} onClick={() => setAssignIds(selected)}>
            <BuildingsIcon weight={ICON_WEIGHT} />
            Assign
          </Button>
        </div>
      ) : null}

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
          { label: "Name" },
          { label: "Class" },
          { label: "Company" },
          { label: "Business mentor" },
          { label: "Documents" },
          { label: "", className: "w-8" },
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>No students match these filters.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((s) => {
          const done = docProgress(s);
          return (
            <tr
              key={s.id}
              onClick={() => setOpenId(s.id)}
              className="cursor-pointer transition-colors hover:bg-muted/40"
            >
              <td className={CELL} onClick={(e) => e.stopPropagation()}>
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
              <td className={CELL}>{className_(s.classId)}</td>
              <td className={cn(CELL, !s.companyId && "text-muted-foreground")}>
                {company(s.companyId)?.name ?? "Unassigned"}
              </td>
              <td className={CELL}>{mentor(s.companyId, s.mentorId)?.name ?? "—"}</td>
              <td className={CELL}>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-muted-foreground tabular-nums">
                    {done}/{DOCUMENT_TYPES.length}
                  </span>
                  <Progress value={(done / DOCUMENT_TYPES.length) * 100} className="w-16" />
                </div>
              </td>
              <td className={CELL} onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" aria-label="Actions">
                        <DotsThreeIcon weight={ICON_WEIGHT} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => setOpenId(s.id)}>
                      <UserIcon weight={ICON_WEIGHT} />
                      Open profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAssignIds([s.id])}>
                      <BuildingsIcon weight={ICON_WEIGHT} />
                      Assign
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.success(`Report for ${s.name} exported`)}
                    >
                      <ExportIcon weight={ICON_WEIGHT} />
                      Export report
                    </DropdownMenuItem>
                    {s.companyId ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            patch([s.id], { companyId: undefined, mentorId: undefined });
                            toast.success(`${s.name} unassigned`);
                          }}
                        >
                          <TrashIcon weight={ICON_WEIGHT} />
                          Unassign
                        </DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      {assignIds ? (
        <AssignDialog
          count={assignIds.length}
          onClose={() => setAssignIds(null)}
          onAssign={(co, m) => {
            patch(assignIds, { companyId: co, mentorId: m });
            toast.success(
              `${assignIds.length === 1 ? "Student" : `${assignIds.length} students`} assigned to ${company(co)?.name}`,
            );
            setAssignIds(null);
            setSelected([]);
          }}
        />
      ) : null}

      {open ? (
        <StudentSheet
          key={open.id}
          student={open}
          onClose={() => setOpenId(null)}
          onAssign={() => setAssignIds([open.id])}
        />
      ) : null}

      <AddStudentDialog
        open={adding}
        onOpenChange={setAdding}
        onAdd={(s) => {
          setStudents((cur) => [...cur, s]);
          toast.success(`${s.name} added`);
        }}
      />
      <ImportDialog open={importing} onOpenChange={setImporting} />
    </AdminPage>
  );
}

function AssignDialog({
  count,
  onClose,
  onAssign,
}: {
  count: number;
  onClose: () => void;
  onAssign: (companyId: string, mentorId: string) => void;
}) {
  const [co, setCo] = useState(COMPANIES[0]?.id ?? "");
  const mentors = company(co)?.mentors ?? [];
  const [m, setM] = useState(mentors[0]?.id ?? "");

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign to company</DialogTitle>
          <DialogDescription>
            {count === 1 ? "One student" : `${count} students`} will be placed here.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel>Company</FieldLabel>
            <AdminDropdown
              label="Company"
              value={co}
              className="w-full justify-between"
              onChange={(v) => {
                setCo(v);
                setM(company(v)?.mentors[0]?.id ?? "");
              }}
              items={COMPANIES.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Field>
          <Field>
            <FieldLabel>Business mentor</FieldLabel>
            <AdminDropdown
              label="Mentor"
              value={m}
              className="w-full justify-between"
              onChange={setM}
              items={mentors.map((x) => ({ value: x.id, label: x.name }))}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" className={PRESS} onClick={onClose}>
            Cancel
          </Button>
          <Button className={PRESS} disabled={!co || !m} onClick={() => onAssign(co, m)}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddStudentDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (student: Student) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState(ACTIVE_CLASSES[0]?.id ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>They get an invite to set up their account.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="student-name">Full name</FieldLabel>
            <Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="student-email">Email</FieldLabel>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Class</FieldLabel>
            <AdminDropdown
              label="Class"
              value={classId}
              className="w-full justify-between"
              onChange={setClassId}
              items={ACTIVE_CLASSES.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" className={PRESS} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className={PRESS}
            disabled={!name.trim() || !email.includes("@")}
            onClick={() => {
              onAdd({
                id: `s-${Date.now()}`,
                name: name.trim(),
                email,
                phone: "",
                birthDate: "",
                classId,
                documents: {
                  agreement: "missing",
                  plan: "missing",
                  diary: "missing",
                  evaluation: "missing",
                  certificate: "missing",
                },
                absences: [],
              });
              setName("");
              setEmail("");
              onOpenChange(false);
            }}
          >
            Add student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const PREVIEW_ROWS = [
  ["Ana Kovač", "ana.kovac@school.app", "4A"],
  ["Marko Petrović", "marko.p@school.app", "4A"],
  ["Sara Ilić", "sara.ilic@school.app", "4B"],
];

function ImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function close(next: boolean) {
    onOpenChange(next);
    if (!next) setFile(null);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import students</DialogTitle>
          <DialogDescription>CSV or Excel with name, email, and class columns.</DialogDescription>
        </DialogHeader>
        {file ? (
          <div className="flex flex-col gap-2 text-xs">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{file}</span> ·{" "}
              {PREVIEW_ROWS.length} rows
            </p>
            <table className="w-full overflow-hidden rounded-lg bg-muted/50">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="px-2.5 py-1.5 text-left font-medium">Name</th>
                  <th className="px-2.5 py-1.5 text-left font-medium">Email</th>
                  <th className="px-2.5 py-1.5 text-left font-medium">Class</th>
                </tr>
              </thead>
              <tbody>
                {PREVIEW_ROWS.map(([n, e, c]) => (
                  <tr key={e} className="border-border/70 border-t">
                    <td className="px-2.5 py-1.5">{n}</td>
                    <td className="px-2.5 py-1.5 text-muted-foreground">{e}</td>
                    <td className="px-2.5 py-1.5">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              setFile(e.dataTransfer.files[0]?.name ?? "students.csv");
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center text-xs transition-colors",
              dragging ? "border-primary bg-primary/5" : "hover:bg-muted/50",
            )}
          >
            <FileArrowUpIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground" />
            <span className="font-medium">Drop a file or click to browse</span>
            <span className="text-muted-foreground">.csv, .xlsx up to 5 MB</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        )}
        <DialogFooter>
          <Button variant="outline" className={PRESS} onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            className={PRESS}
            disabled={!file}
            onClick={() => {
              toast.success(`${PREVIEW_ROWS.length} students imported`);
              close(false);
            }}
          >
            Import {file ? PREVIEW_ROWS.length : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value || "—"}</span>
    </div>
  );
}

function StudentSheet({
  student,
  onClose,
  onAssign,
}: {
  student: Student;
  onClose: () => void;
  onAssign: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const group = CLASSES.find((c) => c.id === student.classId);
  const placement = company(student.companyId);
  const hours = student.absences.reduce((sum, a) => sum + a.hours, 0);
  const excused = student.absences.filter((a) => a.excused).reduce((sum, a) => sum + a.hours, 0);

  return (
    <>
      <Sheet open onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{student.name}</SheetTitle>
            <SheetDescription>
              {group?.name ?? "—"} · {placement?.name ?? "Unassigned"}
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="info" className="flex-1 overflow-y-auto px-4 text-xs">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="absences">Absences</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="flex flex-col gap-3 pt-2">
              <div className="divide-y divide-border/70 rounded-lg bg-muted/50">
                <InfoRow label="Email" value={student.email} />
                <InfoRow label="Phone" value={student.phone} />
                <InfoRow
                  label="Birth date"
                  value={student.birthDate ? formatDate(student.birthDate) : ""}
                />
              </div>
              <div className="divide-y divide-border/70 rounded-lg bg-muted/50">
                <InfoRow label="Class" value={group ? `${group.name} · ${group.year}` : ""} />
                <InfoRow
                  label="Mentor teacher"
                  value={group?.teacherIds.map(teacherName).join(", ") ?? ""}
                />
                <InfoRow label="Company" value={placement?.name ?? ""} />
                <InfoRow
                  label="Business mentor"
                  value={mentor(student.companyId, student.mentorId)?.name ?? ""}
                />
              </div>
              <Button variant="outline" size="sm" className={cn("self-start", PRESS)} onClick={onAssign}>
                <BuildingsIcon weight={ICON_WEIGHT} />
                {placement ? "Change placement" : "Assign company"}
              </Button>
            </TabsContent>

            <TabsContent value="documents" className="flex flex-col gap-3 pt-2">
              <ul className="divide-y divide-border/70 rounded-lg bg-muted/50">
                {DOCUMENT_TYPES.map((d) => (
                  <li key={d.id} className="flex items-center justify-between px-3 py-2">
                    <span className="font-medium">{d.label}</span>
                    <DocumentStatusBadge status={student.documents[d.id]} />
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className={cn("self-start", PRESS)}
                onClick={() => setGenerating(true)}
              >
                <FilePlusIcon weight={ICON_WEIGHT} />
                Generate document
              </Button>
            </TabsContent>

            <TabsContent value="absences" className="flex flex-col gap-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Total", hours],
                  ["Excused", excused],
                  ["Unexcused", hours - excused],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm tabular-nums">{value}h</p>
                  </div>
                ))}
              </div>
              {student.absences.length === 0 ? (
                <p className="text-muted-foreground">No absences recorded.</p>
              ) : (
                <ul className="divide-y divide-border/70 rounded-lg bg-muted/50">
                  {student.absences.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 px-3 py-2">
                      <span className="w-20 tabular-nums">{formatDate(a.date)}</span>
                      <span className="flex-1 truncate text-muted-foreground">{a.reason}</span>
                      <span className="tabular-nums">{a.hours}h</span>
                      <span
                        className={cn(
                          "w-16 text-right",
                          a.excused ? "text-emerald-600" : "text-amber-600",
                        )}
                      >
                        {a.excused ? "Excused" : "Unexcused"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          <SheetFooter>
            <Button
              variant="outline"
              className={PRESS}
              onClick={() => toast.success(`Report for ${student.name} exported`)}
            >
              <ExportIcon weight={ICON_WEIGHT} />
              Export report
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <GenerateDocumentSheet
        open={generating}
        onOpenChange={setGenerating}
        students={[student]}
        initialStudentIds={[student.id]}
      />
    </>
  );
}
