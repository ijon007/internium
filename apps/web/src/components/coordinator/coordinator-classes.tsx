"use client";

import { SHEET_LIST, SHEET_ROW, SheetBody, SheetSection } from "@/components/sheet-section";
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
import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@internium/ui/components/sheet";
import { Tabs, TabsList, TabsTrigger } from "@internium/ui/components/tabs";
import {
  ArrowFatLineUpIcon,
  CaretDownIcon,
  CheckIcon,
  ExportIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  PRESS,
} from "@/components/admin/admin-table";
import {
  CLASSES,
  type ClassGroup,
  STUDENTS,
  TEACHERS,
  teacherName,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";
import { useRetained } from "@/hooks/use-retained";

function nextYear(year: string) {
  const [a, b] = year.split("/").map(Number);
  return `${(a ?? 0) + 1}/${String((b ?? 0) + 1).padStart(2, "0")}`;
}

export function CoordinatorClasses() {
  const [classes, setClasses] = useState(CLASSES);
  const [students, setStudents] = useState(STUDENTS);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const visible = classes.filter((c) => c.archived === (tab === "archived"));
  const open = classes.find((c) => c.id === openId) ?? null;
  const shown = useRetained(open);

  function update(id: string, patch: Partial<ClassGroup>) {
    setClasses((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <AdminPage
      title="Classes"
      description="Classes, mentor teachers, and yearly promotion."
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <AdminTable
        head={[
          { label: "Name" },
          { label: "Year" },
          { label: "Mentor teachers" },
          { label: "Students", className: "text-right" },
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>No classes here yet.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((c) => (
          <tr
            key={c.id}
            tabIndex={0}
            onClick={() => setOpenId(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setOpenId(c.id);
            }}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none",
              c.archived && "text-muted-foreground",
            )}
          >
            <td className={cn(CELL, "font-medium")}>{c.name}</td>
            <td className={cn(CELL, "tabular-nums")}>{c.year}</td>
            <td className={CELL}>
              {c.teacherIds.map(teacherName).join(", ") || "—"}
            </td>
            <td className={cn(CELL, "text-right tabular-nums")}>
              {students.filter((s) => s.classId === c.id).length}
            </td>
          </tr>
        ))}
      </AdminTable>

      {shown ? (
        <ClassSheet
          open={open !== null}
          group={shown}
          students={students}
          onClose={() => setOpenId(null)}
          onSave={(patch) => {
            update(shown.id, patch);
            toast.success("Class saved");
          }}
          onAddStudents={(ids) =>
            setStudents((cur) =>
              cur.map((s) => (ids.includes(s.id) ? { ...s, classId: shown.id } : s)),
            )
          }
          onPromote={() => {
            update(shown.id, { archived: true });
            setClasses((cur) => [
              ...cur,
              {
                ...shown,
                id: `c-${Date.now()}`,
                name: shown.name.replace(/^(\d+)/, (n) => String(Number(n) + 1)),
                year: nextYear(shown.year),
              },
            ]);
            setOpenId(null);
            toast.success(`${shown.name} promoted to ${nextYear(shown.year)}`);
          }}
        />
      ) : null}
    </AdminPage>
  );
}

function ClassSheet({
  open,
  group,
  students,
  onClose,
  onSave,
  onAddStudents,
  onPromote,
}: {
  open: boolean;
  group: ClassGroup;
  students: typeof STUDENTS;
  onClose: () => void;
  onSave: (patch: Partial<ClassGroup>) => void;
  onAddStudents: (ids: string[]) => void;
  onPromote: () => void;
}) {
  const readOnly = group.archived;
  const [name, setName] = useState(group.name);
  const [year, setYear] = useState(group.year);
  const [teacherIds, setTeacherIds] = useState(group.teacherIds);
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(group.name);
    setYear(group.year);
    setTeacherIds(group.teacherIds);
    setPromoting(false);
  }, [open, group]);
  const members = students.filter((s) => s.classId === group.id);
  const others = students.filter((s) => s.classId !== group.id);

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {group.name}
            {readOnly ? (
              <Badge variant="outline" className="ml-2 align-middle">
                Archived
              </Badge>
            ) : null}
          </SheetTitle>
          <SheetDescription>
            {readOnly ? "Archived classes are read-only." : group.year}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <SheetSection title="Details">
          <FieldGroup className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="class-name">Name</FieldLabel>
              <Input
                id="class-name"
                value={name}
                disabled={readOnly}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="class-year">Year</FieldLabel>
              <Input
                id="class-year"
                value={year}
                disabled={readOnly}
                onChange={(e) => setYear(e.target.value)}
              />
            </Field>
            <Field className="col-span-2">
              <FieldLabel>Mentor teachers</FieldLabel>
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={readOnly}
                  render={
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
                    />
                  }
                >
                  <span className="truncate">
                    {teacherIds.map(teacherName).join(", ") || "Pick teachers"}
                  </span>
                  <CaretDownIcon
                    weight={ICON_WEIGHT}
                    className="size-3 text-muted-foreground"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-56">
                  {TEACHERS.map((t) => (
                    <DropdownMenuCheckboxItem
                      key={t.id}
                      checked={teacherIds.includes(t.id)}
                      onCheckedChange={(checked) =>
                        setTeacherIds((cur) =>
                          checked ? [...cur, t.id] : cur.filter((id) => id !== t.id),
                        )
                      }
                    >
                      {t.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
          </FieldGroup>
          </SheetSection>

          <SheetSection
            title="Students"
            count={members.length}
            action={readOnly ? null : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="sm" className={PRESS} />}
                  >
                    <PlusIcon weight="bold" />
                    Add students
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-48">
                    {others.length === 0 ? (
                      <p className="px-2 py-1 text-xs text-muted-foreground">
                        Everyone is already here.
                      </p>
                    ) : (
                      others.map((s) => (
                        <DropdownMenuCheckboxItem
                          key={s.id}
                          checked={false}
                          onCheckedChange={() => {
                            onAddStudents([s.id]);
                            toast.success(`${s.name} added to ${group.name}`);
                          }}
                        >
                          {s.name}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          >
            <ul className={SHEET_LIST}>
              {members.map((s) => (
                <li
                  key={s.id}
                  className={SHEET_ROW}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-auto truncate text-muted-foreground">{s.email}</span>
                </li>
              ))}
              {members.length === 0 ? (
                <li className="px-2 py-1.5 text-muted-foreground">No students yet.</li>
              ) : null}
            </ul>
          </SheetSection>
        </SheetBody>
        <SheetFooter className="justify-start">
          <Button
            variant="ghost"
            className={PRESS}
            onClick={() => toast.success(`Report for ${group.name} exported`)}
          >
            <ExportIcon weight={ICON_WEIGHT} />
            Export report
          </Button>
          {readOnly ? null : (
            <>
              <Button
                variant="ghost"
                className={PRESS}
                onClick={() => setPromoting(true)}
              >
                <ArrowFatLineUpIcon weight={ICON_WEIGHT} />
                Promote
              </Button>
              <Button
                className={cn("ml-auto", PRESS)}
                onClick={() => onSave({ name, year, teacherIds })}
              >
                <CheckIcon weight={ICON_WEIGHT} />
                Save
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={promoting} onOpenChange={setPromoting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote {group.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its students move to {nextYear(group.year)} and this class is
              archived as read-only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className={PRESS} onClick={onPromote}>
              <ArrowFatLineUpIcon weight={ICON_WEIGHT} />
              Promote
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
