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
import {
  ArrowsClockwiseIcon,
  ChatTeardropTextIcon,
  DownloadSimpleIcon,
  FileDocIcon,
  FilePdfIcon,
  FileTextIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AdminPage,
  PRESS,
  SURFACE,
  formatDate,
} from "@/components/admin/admin-table";
import {
  SHEET_LIST,
  SHEET_ROW,
  SheetBody,
  SheetSection,
} from "@/components/sheet-section";
import { StatusBadge, statusVars } from "@/components/status-badge";
import {
  type DocEntry,
  type DocVersion,
  MY_DOCUMENTS,
  type StudentDocument,
  UPLOAD_HINT,
} from "@/constants/student";
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.doc,.docx";
const MAX_BYTES = 10 * 1024 * 1024;
const TODAY = new Date().toISOString().slice(0, 10);

function FileIcon({ name, className }: { name: string; className?: string }) {
  const Icon = name.endsWith(".pdf") ? FilePdfIcon : name.match(/\.docx?$/) ? FileDocIcon : FileTextIcon;
  return <Icon weight={ICON_WEIGHT} className={className} />;
}

function download(name: string) {
  toast.success(`Downloading ${name}`);
}

function kb(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function StudentDocuments() {
  const [docs, setDocs] = useState(MY_DOCUMENTS);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = docs.find((d) => d.id === openId) ?? null;
  const shown = useRetained(open);

  useEffect(() => {
    const doc = new URLSearchParams(window.location.search).get("doc");
    if (doc) setOpenId(doc);
  }, []);

  function upload(docId: string, entryId: string | null, file: File) {
    const version: DocVersion = { id: `v-${Date.now()}`, file: file.name, size: kb(file.size), date: TODAY };
    setDocs((cur) =>
      cur.map((d) => {
        if (d.id !== docId) return d;
        const bump = (x: DocEntry): DocEntry => ({
          ...x,
          status: "uploaded",
          updatedAt: TODAY,
          comment: undefined,
          versions: [version, ...x.versions],
        });
        if (d.entries && entryId) {
          return {
            ...d,
            updatedAt: TODAY,
            entries: d.entries.map((e) => (e.id === entryId ? bump(e) : e)),
          };
        }
        return {
          ...d,
          status: "uploaded",
          updatedAt: TODAY,
          comment: undefined,
          versions: [version, ...d.versions],
        };
      }),
    );
    toast.success("Uploaded", { description: `${file.name} was sent to your teacher for review.` });
  }

  return (
    <AdminPage title="My Documents" description="Download your generated copies and upload the signed versions.">
      <ul className={cn(SURFACE, "flex flex-col rounded-xl p-1.5 ring-1")}>
        {docs.map((d) => (
          <li key={d.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(d.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenId(d.id)}
              className="group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 [@media(hover:hover)]:hover:bg-muted/50"
            >
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileTextIcon weight={ICON_WEIGHT} className="size-4" />
                <span style={statusVars(d.status)} className={cn("absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-card", "bg-current")} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium">{d.label}</span>
                <span className="truncate text-muted-foreground">
                  {d.updatedAt ? `Updated ${formatDate(d.updatedAt)}` : d.description}
                  {d.entries ? ` · ${d.entries.length} entries` : ""}
                </span>
              </span>
              <StatusBadge status={d.status} />
              <span className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                {d.hasGenerated ? (
                  <Button variant="ghost" size="icon-sm" aria-label={`Download generated ${d.label}`} title="Download generated copy" className={PRESS} onClick={() => download(`${d.label}.pdf`)}>
                    <DownloadSimpleIcon weight={ICON_WEIGHT} />
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" className={cn(PRESS, "w-24")} onClick={() => setOpenId(d.id)}>
                  {d.versions.length ? <ArrowsClockwiseIcon weight={ICON_WEIGHT} /> : <UploadSimpleIcon weight={ICON_WEIGHT} />}
                  {d.versions.length ? "Re-upload" : "Upload"}
                </Button>
              </span>
            </div>
          </li>
        ))}
      </ul>

      {shown ? (
        <DocumentSheet
          key={shown.id}
          doc={shown}
          open={open !== null}
          onClose={() => setOpenId(null)}
          onUpload={upload}
        />
      ) : null}
    </AdminPage>
  );
}

function DocumentSheet({
  doc,
  open,
  onClose,
  onUpload,
}: {
  doc: StudentDocument;
  open: boolean;
  onClose: () => void;
  onUpload: (docId: string, entryId: string | null, file: File) => void;
}) {
  const firstOpen = doc.entries?.find((e) => e.status !== "approved") ?? doc.entries?.[0];
  const [entryId, setEntryId] = useState<string | null>(firstOpen?.id ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const target: DocEntry | StudentDocument = doc.entries?.find((e) => e.id === entryId) ?? doc;
  const latest = target.versions[0];

  function pick(f: File | undefined) {
    if (!f) return;
    if (!/\.(pdf|docx?)$/i.test(f.name)) {
      toast.error("Only PDF or Word files can be uploaded");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("That file is larger than 10 MB");
      return;
    }
    setFile(f);
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {doc.label}
            <StatusBadge status={doc.status} />
          </SheetTitle>
          <SheetDescription>
            {doc.description}
            {doc.deadline ? ` · Due ${formatDate(doc.deadline)}` : ""}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {doc.entries ? (
            <SheetSection title={doc.id === "weekly-report" ? "Weeks" : "Months"} count={doc.entries.length}>
              <ul className={SHEET_LIST}>
                {doc.entries.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setEntryId(e.id);
                        setFile(null);
                      }}
                      className={cn(
                        SHEET_ROW,
                        "w-full cursor-pointer text-left",
                        e.id === entryId && "bg-muted [@media(hover:hover)]:hover:bg-muted",
                      )}
                    >
                      <span className="flex-1 truncate font-medium">{e.label}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {e.updatedAt ? formatDate(e.updatedAt) : "—"}
                      </span>
                      <StatusBadge status={e.status} />
                    </button>
                  </li>
                ))}
              </ul>
            </SheetSection>
          ) : null}

          {target.comment ? (
            <SheetSection title="Teacher's comment">
              <p
                style={target.status === "returned" ? statusVars("returned") : undefined}
                className={cn(
                  "flex gap-2 rounded-lg px-3 py-2.5 leading-relaxed",
                  target.status === "returned" ? "status-tint" : "bg-muted/60",
                )}
              >
                <ChatTeardropTextIcon weight={ICON_WEIGHT} className="mt-0.5 size-3.5 shrink-0" />
                {target.comment}
              </p>
            </SheetSection>
          ) : null}

          <SheetSection title={doc.entries ? `File · ${target.label}` : "File"}>
            {latest || doc.hasGenerated ? (
              <div className="flex flex-col gap-2">
                <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-muted/60">
                  <FileIcon name={latest?.file ?? ".pdf"} className="size-10 text-muted-foreground/60" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{latest?.file ?? `${doc.label} (generated).pdf`}</span>
                    <span className="text-muted-foreground">
                      {latest ? `${latest.size} · ${formatDate(latest.date)}` : "Generated copy"}
                    </span>
                  </span>
                  <Button variant="outline" size="sm" className={PRESS} onClick={() => download(latest?.file ?? `${doc.label}.pdf`)}>
                    <DownloadSimpleIcon weight={ICON_WEIGHT} />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No file yet.</p>
            )}
          </SheetSection>

          <SheetSection title="Version history" count={target.versions.length}>
            {target.versions.length === 0 ? (
              <p className="text-muted-foreground">No uploads yet.</p>
            ) : (
              <ul className={SHEET_LIST}>
                {target.versions.map((v, i) => (
                  <li key={v.id} className={SHEET_ROW}>
                    <FileIcon name={v.file} className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate font-medium">{v.file}</span>
                    {i === 0 ? <span className="text-[10px] text-muted-foreground">Latest</span> : null}
                    <span className="text-muted-foreground tabular-nums">{formatDate(v.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </SheetSection>

          <SheetSection title={target.versions.length ? "Re-upload" : "Upload"}>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => {
                pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {file ? (
              <div className="flex items-center gap-2 rounded-lg bg-sky-500/10 px-3 py-2.5">
                <FileIcon name={file.name} className="size-4 shrink-0 text-sky-700 dark:text-sky-300" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-muted-foreground">{kb(file.size)}</span>
                </span>
                <Button variant="ghost" size="icon-sm" aria-label="Remove file" onClick={() => setFile(null)}>
                  <XIcon weight="bold" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  pick(e.dataTransfer.files[0]);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-6 text-center transition-[background-color,transform] duration-150 ease-out active:scale-[0.99] [@media(hover:hover)]:hover:bg-muted",
                  dragging && "bg-sky-500/10",
                )}
              >
                <UploadSimpleIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground" />
                <span className="font-medium">Drop a file or click to browse</span>
                <span className="text-muted-foreground">{UPLOAD_HINT}</span>
              </button>
            )}
          </SheetSection>
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" className={PRESS} onClick={onClose}>
            Close
          </Button>
          <Button
            className={PRESS}
            disabled={!file}
            onClick={() => {
              if (!file) return;
              onUpload(doc.id, doc.entries ? entryId : null, file);
              setFile(null);
            }}
          >
            <UploadSimpleIcon weight={ICON_WEIGHT} />
            Upload
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
