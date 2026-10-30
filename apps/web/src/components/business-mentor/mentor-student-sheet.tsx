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
import { CaretRightIcon, ChatCircleIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { PRESS, formatDate } from "@/components/admin/admin-table";
import { weekLabel } from "@/components/business-mentor/attendance-controls";
import { SHEET_LIST, SHEET_ROW, SheetBody, SheetSection, SheetStats } from "@/components/sheet-section";
import { StatusBadge } from "@/components/status-badge";
import { DocTypeTile } from "@/components/student/student-documents";
import {
  type AttendanceBook,
  SCHOOL_TEACHER,
  WEEKS,
  entryFor,
} from "@/constants/business-mentor";
import { TEACHER_DOC_TYPES, type TeacherDocType, type TeacherStudent, classOf } from "@/constants/teacher";
import { sampleUrl, type ViewerFile } from "@/lib/document-files";
import { cn } from "@/lib/utils";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value || "—"}</span>
    </div>
  );
}

const mail = (email: string) => (
  <a href={`mailto:${email}`} className="hover:underline">
    {email}
  </a>
);

/** The latest upload of a document as a viewer file, or null when nothing is uploaded yet. */
export function latestFile(student: TeacherStudent, type: TeacherDocType): ViewerFile | null {
  const v = student.documents[type].versions[0];
  return v ? { name: v.file, url: sampleUrl(type, v.file), meta: `${v.size} · ${formatDate(v.date)}` } : null;
}

export function MentorStudentSheet({
  open,
  student,
  book,
  tab,
  onTabChange,
  onClose,
  onView,
  onMessage,
}: {
  open: boolean;
  student: TeacherStudent;
  book: AttendanceBook;
  tab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  onView: (file: ViewerFile) => void;
  onMessage: (name: string) => void;
}) {
  const group = classOf(student.classId);
  const history = [...WEEKS].reverse().map((week) => ({ week, entry: entryFor(book, student.id, week) }));
  const count = (s: string) => history.filter((h) => h.entry.status === s).length;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{student.name}</SheetTitle>
          <SheetDescription>
            {group?.name ?? "—"} · {group?.year ?? ""}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => onTabChange(String(v))} className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="mx-5 mb-2 self-start">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex min-h-0 flex-1 flex-col">
            <SheetBody>
              <SheetSection title="Student">
                <div className={SHEET_LIST}>
                  <InfoRow label="Class" value={group?.name} />
                  <InfoRow label="School year" value={group?.year} />
                  <InfoRow label="Email" value={mail(student.email)} />
                  <InfoRow label="Phone" value={student.phone} />
                </div>
              </SheetSection>
              <SheetSection
                title="School mentor teacher"
                action={
                  <Button variant="ghost" size="sm" className={PRESS} onClick={() => onMessage(SCHOOL_TEACHER.name)}>
                    <ChatCircleIcon weight={ICON_WEIGHT} />
                    Message
                  </Button>
                }
              >
                <div className={SHEET_LIST}>
                  <InfoRow label="Name" value={SCHOOL_TEACHER.name} />
                  <InfoRow label="Email" value={mail(SCHOOL_TEACHER.email)} />
                  <InfoRow label="Phone" value={SCHOOL_TEACHER.phone} />
                </div>
              </SheetSection>
            </SheetBody>
          </TabsContent>

          <TabsContent value="documents" className="flex min-h-0 flex-1 flex-col">
            <SheetBody>
              <SheetSection title="Documents" count={TEACHER_DOC_TYPES.length}>
                <ul className={SHEET_LIST}>
                  {TEACHER_DOC_TYPES.map((t) => {
                    const doc = student.documents[t.id];
                    const file = latestFile(student, t.id);
                    return (
                      <li key={t.id} className="flex items-center">
                        <button
                          type="button"
                          disabled={!file}
                          onClick={() => file && onView(file)}
                          className={cn(SHEET_ROW, "group min-w-0 flex-1 text-left enabled:cursor-pointer disabled:hover:bg-transparent")}
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
                              !file && "invisible",
                            )}
                          />
                        </button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Download ${t.label}`}
                          className={cn(PRESS, !file && "invisible")}
                          nativeButton={false}
                          render={<a href={file?.url} download={file?.name} />}
                        >
                          <DownloadSimpleIcon weight={ICON_WEIGHT} />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </SheetSection>
              <p className="text-[11px] text-muted-foreground">The school mentor teacher reviews and approves documents.</p>
            </SheetBody>
          </TabsContent>

          <TabsContent value="attendance" className="flex min-h-0 flex-1 flex-col">
            <SheetBody>
              <SheetStats
                items={[
                  ["Present", count("present")],
                  ["Absent", count("absent")],
                  ["Pending", count("pending")],
                ]}
              />
              <SheetSection title="Week by week" count={history.length}>
                <ul className={SHEET_LIST}>
                  {history.map(({ week, entry }) => (
                    <li key={week} className={SHEET_ROW}>
                      <span className="w-36 shrink-0 tabular-nums">{weekLabel(week)}</span>
                      <span className="flex-1 truncate text-muted-foreground">{entry.reason ?? ""}</span>
                      <StatusBadge status={entry.status} />
                    </li>
                  ))}
                </ul>
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
