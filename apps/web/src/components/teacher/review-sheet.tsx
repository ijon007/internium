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
import { Textarea } from "@internium/ui/components/textarea";
import { ArrowUUpLeftIcon, CaretLeftIcon, CaretRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { PRESS, formatDate } from "@/components/admin/admin-table";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { SHEET_LIST, SHEET_ROW, SheetBody, SheetSection } from "@/components/sheet-section";
import { StatusBadge } from "@/components/status-badge";
import { AttachmentCard, FileIcon } from "@/components/student/student-documents";
import { type ReviewItem, type ReviewVersion, classOf, docTypeLabel } from "@/constants/teacher";
import { sampleUrl, type ViewerFile } from "@/lib/document-files";
import { cn } from "@/lib/utils";

function versionFile(item: ReviewItem, v: ReviewVersion): ViewerFile {
  return { name: v.file, url: sampleUrl(item.type, v.file), meta: `${v.size} · ${formatDate(v.date)}` };
}

/**
 * Review one submitted document: preview, history, approve or return.
 * Prev/next (and ←/→ outside text fields) step through the current list for fast reviewing.
 */
export function ReviewSheet({
  open,
  item,
  index,
  total,
  onPrev,
  onNext,
  onClose,
  onReview,
}: {
  open: boolean;
  item: ReviewItem;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
  onReview: (action: "approved" | "returned", comment: string) => void;
}) {
  const [comment, setComment] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [viewing, setViewing] = useState<ViewerFile | null>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { doc, student } = item;
  const latest = doc.versions[0];
  const reviewable = doc.status === "uploaded";

  useEffect(() => {
    setComment("");
    setInvalid(false);
  }, [item.key]);

  useEffect(() => {
    if (!open || viewing) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable=true]")) return;
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, viewing, onPrev, onNext]);

  function returnDoc() {
    if (!comment.trim()) {
      setInvalid(true);
      commentRef.current?.focus();
      return;
    }
    onReview("returned", comment);
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {docTypeLabel(item.type)}
            <StatusBadge status={doc.status} />
          </SheetTitle>
          <SheetDescription>
            {student.name} · {classOf(student.classId)?.name ?? "—"}
            {doc.uploadedAt ? ` · Uploaded ${formatDate(doc.uploadedAt)}` : ""}
          </SheetDescription>
        </SheetHeader>

        <SheetBody key={item.key} className="animate-in fade-in-0 duration-150">
          <SheetSection title="File">
            {latest ? (
              <AttachmentCard file={versionFile(item, latest)} onOpen={() => setViewing(versionFile(item, latest))} />
            ) : (
              <p className="text-muted-foreground">No file yet.</p>
            )}
          </SheetSection>

          <SheetSection title="Version history" count={doc.versions.length}>
            {doc.versions.length === 0 ? (
              <p className="text-muted-foreground">No uploads yet.</p>
            ) : (
              <ul className={SHEET_LIST}>
                {doc.versions.map((v, i) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setViewing(versionFile(item, v))}
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

          <SheetSection title="Earlier comments" count={doc.comments.length}>
            {doc.comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {[...doc.comments].reverse().map((c) => (
                  <figure key={c.id} className="flex flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2.5">
                    <blockquote className="leading-relaxed text-foreground">{c.body}</blockquote>
                    <figcaption className="text-[11px] text-muted-foreground">
                      {c.author} · {formatDate(c.date)} · {c.action === "returned" ? "Returned" : "Approved"}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </SheetSection>

          {reviewable ? (
            <SheetSection title="Comment">
              <Textarea
                ref={commentRef}
                value={comment}
                aria-invalid={invalid || undefined}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (e.target.value.trim()) setInvalid(false);
                }}
                placeholder="Required when returning, optional when approving"
              />
              {invalid ? (
                <p className="text-[11px] text-destructive animate-in fade-in-0 slide-in-from-top-0.5 duration-150">
                  Add a comment so {student.name.split(" ")[0]} knows what to fix.
                </p>
              ) : null}
            </SheetSection>
          ) : null}
        </SheetBody>

        <SheetFooter className="justify-between">
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon-sm" aria-label="Previous" title="Previous (←)" className={PRESS}
              disabled={!onPrev} onClick={onPrev}>
              <CaretLeftIcon weight="bold" />
            </Button>
            <span className="min-w-10 text-center text-xs text-muted-foreground tabular-nums">
              {index + 1} / {total}
            </span>
            <Button variant="ghost" size="icon-sm" aria-label="Next" title="Next (→)" className={PRESS}
              disabled={!onNext} onClick={onNext}>
              <CaretRightIcon weight="bold" />
            </Button>
          </div>
          {reviewable ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className={PRESS} onClick={returnDoc}>
                <ArrowUUpLeftIcon weight={ICON_WEIGHT} />
                Return
              </Button>
              <Button className={PRESS} onClick={() => onReview("approved", comment)}>
                <CheckCircleIcon weight={ICON_WEIGHT} />
                Approve
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className={PRESS} onClick={onClose}>
              Close
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
      <DocumentViewer file={viewing} onClose={() => setViewing(null)} />
    </Sheet>
  );
}
