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
  CalendarDotsIcon,
  ClipboardTextIcon,
  HandshakeIcon,
  type Icon,
  NotebookIcon,
  SignatureIcon,
  DownloadSimpleIcon,
  FileDocIcon,
  FilePdfIcon,
  FileTextIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
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
import { StatusBadge } from "@/components/status-badge";
import {
  type DocEntry,
  type DocVersion,
  MY_DOCUMENTS,
  MY_PEOPLE,
  type StudentDocument,
  UPLOAD_HINT,
} from "@/constants/student";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { useRetained } from "@/hooks/use-retained";
import { sampleUrl, type ViewerFile } from "@/lib/document-files";
import { cn } from "@/lib/utils";

const TEACHER = MY_PEOPLE.find((p) => p.role === "Mentor teacher")?.name ?? "Your teacher";
const ACCEPT = ".pdf,.doc,.docx";
const MAX_BYTES = 10 * 1024 * 1024;
const TODAY = new Date().toISOString().slice(0, 10);

function FileIcon({ name, className }: { name: string; className?: string }) {
  const Icon = name.endsWith(".pdf") ? FilePdfIcon : name.match(/\.docx?$/) ? FileDocIcon : FileTextIcon;
  return <Icon weight={ICON_WEIGHT} className={className} />;
}

/** One tinted tile per document type, so rows scan by shape and colour. */
const DOC_TYPE: Record<StudentDocument["id"], { icon: Icon; hue: string }> = {
  contract: { icon: SignatureIcon, hue: "oklch(0.55 0.17 265)" },
  "monthly-notebook": { icon: NotebookIcon, hue: "oklch(0.62 0.15 65)" },
  "yearly-program": { icon: CalendarDotsIcon, hue: "oklch(0.55 0.12 185)" },
  "weekly-report": { icon: ClipboardTextIcon, hue: "oklch(0.55 0.18 320)" },
  mou: { icon: HandshakeIcon, hue: "oklch(0.55 0.13 150)" },
};

function tint(hue: string): CSSProperties {
  return { "--status-color": hue } as CSSProperties;
}

function DocTypeTile({ id }: { id: StudentDocument["id"] }) {
  const { icon: TypeIcon, hue } = DOC_TYPE[id];
  return (
    <span style={tint(hue)} className="status-tint flex size-8 shrink-0 items-center justify-center rounded-[9px]">
      <TypeIcon weight={ICON_WEIGHT} className="size-4" />
    </span>
  );
}

const FILE_KIND = {
  pdf: { label: "PDF", hue: "oklch(0.58 0.19 27)" },
  doc: { label: "DOC", hue: "oklch(0.55 0.16 255)" },
  other: { label: "FILE", hue: "oklch(0.55 0.01 260)" },
};

function fileKind(name: string) {
  if (/\.pdf$/i.test(name)) return FILE_KIND.pdf;
  if (/\.docx?$/i.test(name)) return FILE_KIND.doc;
  return FILE_KIND.other;
}

/** Compact attachment row: type tile, name, size · date. Opens in the reader; inline download. */
function AttachmentCard({ file, onOpen }: { file: ViewerFile; onOpen: () => void }) {
  const kind = fileKind(file.name);
  return (
    <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1 pr-1.5 transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg p-1 text-left outline-none transition-transform duration-100 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.99]"
      >
        <span
          style={tint(kind.hue)}
          className="status-tint flex size-9 shrink-0 flex-col items-center justify-center gap-px rounded-[9px]"
        >
          <FileIcon name={file.name} className="size-4" />
          <span className="text-[7px] leading-none font-semibold tracking-wide">{kind.label}</span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-medium">{file.name}</span>
          <span className="truncate text-muted-foreground tabular-nums">{file.meta}</span>
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Download ${file.name}`}
        title="Download"
        className={PRESS}
        nativeButton={false}
        render={<a href={file.url} download={file.name} />}
      >
        <DownloadSimpleIcon weight={ICON_WEIGHT} />
      </Button>
    </div>
  );
}

function versionFile(docId: string, v: DocVersion): ViewerFile {
  return { name: v.file, url: v.url ?? sampleUrl(docId, v.file), meta: `${v.size} · ${formatDate(v.date)}` };
}

function generatedFile(doc: StudentDocument): ViewerFile {
  return { name: `${doc.label} (generated).pdf`, url: sampleUrl(doc.id), meta: "Generated copy" };
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
    const version: DocVersion = {
      id: `v-${Date.now()}`,
      file: file.name,
      size: kb(file.size),
      date: TODAY,
      url: URL.createObjectURL(file),
    };
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
              <DocTypeTile id={d.id} />
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
                  <Button variant="ghost" size="icon-sm" aria-label={`Download generated ${d.label}`} title="Download generated copy" className={PRESS} nativeButton={false} render={<a href={sampleUrl(d.id)} download={`${d.label}.pdf`} />}>
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
  const [viewing, setViewing] = useState<ViewerFile | null>(null);
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
              <figure className="flex flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2.5">
                <blockquote className="leading-relaxed text-foreground">{target.comment}</blockquote>
                <figcaption className="text-[11px] text-muted-foreground">
                  {TEACHER}
                  {target.updatedAt ? ` · ${formatDate(target.updatedAt)}` : ""}
                </figcaption>
              </figure>
            </SheetSection>
          ) : null}

          <SheetSection title={doc.entries ? `File · ${target.label}` : "File"}>
            {latest || doc.hasGenerated ? (
              <AttachmentCard
                file={latest ? versionFile(doc.id, latest) : generatedFile(doc)}
                onOpen={() => setViewing(latest ? versionFile(doc.id, latest) : generatedFile(doc))}
              />
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
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setViewing(versionFile(doc.id, v))}
                      className={cn(SHEET_ROW, "w-full cursor-pointer text-left")}
                    >
                      <FileIcon name={v.file} className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate font-medium">{v.file}</span>
                      {i === 0 ? <span className="text-[10px] text-muted-foreground">Latest</span> : null}
                      <span className="text-muted-foreground tabular-nums">{formatDate(v.date)}</span>
                    </button>
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
      <DocumentViewer file={viewing} onClose={() => setViewing(null)} />
    </Sheet>
  );
}
