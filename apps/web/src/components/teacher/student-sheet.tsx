"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@internium/ui/components/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@internium/ui/components/tabs";
import { CaretRightIcon, ChatCircleIcon, PlusIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { PRESS, formatDate } from "@/components/admin/admin-table";
import { SHEET_LIST, SHEET_ROW, SheetBody, SheetSection, SheetStats } from "@/components/sheet-section";
import { StatusBadge } from "@/components/status-badge";
import { DocTypeTile } from "@/components/student/student-documents";
import {
  ABSENCE_THRESHOLD,
  TEACHER_DOC_TYPES,
  type TeacherDocType,
  type TeacherStudent,
  classOf,
  companyOf,
} from "@/constants/teacher";
import { cn } from "@/lib/utils";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value || "—"}</span>
    </div>
  );
}

export function StudentSheet({
  open,
  student,
  tab,
  onTabChange,
  onClose,
  onOpenDocument,
  onAddAbsence,
  onMessage,
}: {
  open: boolean;
  student: TeacherStudent;
  tab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  onOpenDocument: (type: TeacherDocType) => void;
  onAddAbsence: () => void;
  onMessage: (name: string) => void;
  children?: ReactNode;
}) {
  const group = classOf(student.classId);
  const company = companyOf(student.companyId);
  const byTeacher = student.absences.filter((a) => a.recordedBy === "Teacher").length;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{student.name}</SheetTitle>
          <SheetDescription>
            {group?.name ?? "—"} · {company?.name ?? "No company"}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => onTabChange(String(v))} className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="mx-5 mb-2 self-start">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="min-h-0 flex-1">
            <SheetBody>
              <SheetSection title="Student">
                <div className={SHEET_LIST}>
                  <InfoRow label="Class" value={group ? `${group.name} · ${group.year}` : ""} />
                  <InfoRow label="Email" value={student.email} />
                  <InfoRow label="Phone" value={student.phone} />
                </div>
              </SheetSection>
              <SheetSection title="Company">
                <div className={SHEET_LIST}>
                  <InfoRow label="Name" value={company?.name} />
                  <InfoRow label="Address" value={company?.address} />
                </div>
              </SheetSection>
              <SheetSection
                title="Business mentor"
                action={
                  company ? (
                    <Button variant="ghost" size="sm" className={PRESS} onClick={() => onMessage(company.mentor.name)}>
                      <ChatCircleIcon weight={ICON_WEIGHT} />
                      Message
                    </Button>
                  ) : null
                }
              >
                <div className={SHEET_LIST}>
                  <InfoRow label="Name" value={company?.mentor.name} />
                  <InfoRow
                    label="Email"
                    value={company ? <a href={`mailto:${company.mentor.email}`} className="hover:underline">{company.mentor.email}</a> : ""}
                  />
                  <InfoRow label="Phone" value={company?.mentor.phone} />
                </div>
              </SheetSection>
            </SheetBody>
          </TabsContent>

          <TabsContent value="documents" className="min-h-0 flex-1">
            <SheetBody>
              <SheetSection title="Documents" count={TEACHER_DOC_TYPES.length}>
                <ul className={SHEET_LIST}>
                  {TEACHER_DOC_TYPES.map((t) => {
                    const doc = student.documents[t.id];
                    const hasFile = doc.versions.length > 0;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          disabled={!hasFile}
                          onClick={() => onOpenDocument(t.id)}
                          className={cn(SHEET_ROW, "group w-full text-left enabled:cursor-pointer disabled:hover:bg-transparent")}
                        >
                          <DocTypeTile id={t.id} />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="truncate font-medium">{t.label}</span>
                            <span className="truncate text-muted-foreground">
                              {doc.uploadedAt ? `Uploaded ${formatDate(doc.uploadedAt)}` : "No upload yet"}
                            </span>
                          </span>
                          <StatusBadge status={doc.status} />
                          <CaretRightIcon
                            weight={ICON_WEIGHT}
                            className={cn(
                              "size-3 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5",
                              !hasFile && "invisible",
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </SheetSection>
            </SheetBody>
          </TabsContent>

          <TabsContent value="absences" className="min-h-0 flex-1">
            <SheetBody>
              <SheetStats
                items={[
                  ["Total", student.absences.length],
                  ["By you", byTeacher],
                  ["By mentor", student.absences.length - byTeacher],
                ]}
              />
              <SheetSection
                title="History"
                count={student.absences.length}
                action={
                  <Button variant="ghost" size="sm" className={PRESS} onClick={onAddAbsence}>
                    <PlusIcon weight="bold" />
                    Add absence
                  </Button>
                }
              >
                {student.absences.length > ABSENCE_THRESHOLD ? (
                  <p className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground">
                    Above the threshold of {ABSENCE_THRESHOLD} absences.
                  </p>
                ) : null}
                {student.absences.length === 0 ? (
                  <p className="text-muted-foreground">No absences recorded.</p>
                ) : (
                  <ul className={SHEET_LIST}>
                    {student.absences.map((a) => (
                      <li key={a.id} className={SHEET_ROW}>
                        <span className="w-20 shrink-0 tabular-nums">{formatDate(a.date)}</span>
                        <span className="flex-1 truncate text-muted-foreground">{a.reason}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {a.recordedBy === "Teacher" ? "Teacher" : `Mentor · ${a.recorder}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </SheetSection>
            </SheetBody>
          </TabsContent>
        </Tabs>

        <SheetFooter>
          <Button variant="ghost" className={PRESS} onClick={onClose}>
            Close
          </Button>
          <Button className={PRESS} onClick={() => onMessage(student.name)}>
            <ChatCircleIcon weight={ICON_WEIGHT} />
            Message student
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
