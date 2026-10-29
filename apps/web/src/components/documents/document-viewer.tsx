"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@internium/ui/components/sheet";
import {
  DownloadSimpleIcon,
  FileDocIcon,
  FilePdfIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { PRESS } from "@/components/admin/admin-table";
import { PaperSkeleton } from "@/components/documents/paper-skeleton";
import { isWordFile, type ViewerFile } from "@/lib/document-files";
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";

// pdf.js and docx-preview touch the DOM at import time, so they load on the client only.
const PdfPages = dynamic(() => import("@/components/documents/pdf-pages"), { ssr: false });
const DocxPages = dynamic(() => import("@/components/documents/docx-pages"), { ssr: false });

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const PAGE_MAX = 760;

/** Wide floating reader for PDF and Word files: stacked pages, zoom, page count, download. */
export function DocumentViewer({
  file,
  onClose,
  actions,
}: {
  file: ViewerFile | null;
  onClose: () => void;
  /** Extra header actions, e.g. "Fill in app". */
  actions?: ReactNode;
}) {
  const shown = useRetained(file);
  return (
    <Sheet open={file !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        showCloseButton={false}
        className="gap-0 data-[side=right]:sm:max-w-[min(900px,90vw)]"
      >
        {shown ? <Reader key={shown.url} file={shown} onClose={onClose} actions={actions} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function Reader({ file, onClose, actions }: { file: ViewerFile; onClose: () => void; actions?: ReactNode }) {
  const word = isWordFile(file.name);
  const Icon = word ? FileDocIcon : FilePdfIcon;
  const [zoom, setZoom] = useState(2);
  const [pages, setPages] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPages = useCallback((n: number) => setPages(n), []);
  const onError = useCallback(() => setFailed(true), []);
  const width = Math.round(Math.min(Math.max(avail - 48, 240), PAGE_MAX) * ZOOMS[zoom]);

  return (
    <>
      <header className="flex shrink-0 items-center gap-2.5 py-2.5 pr-2.5 pl-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-muted">
          <Icon weight={ICON_WEIGHT} className="size-4 text-muted-foreground" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <SheetTitle className="truncate text-sm leading-tight font-medium tracking-tight">{file.name}</SheetTitle>
          <SheetDescription className="truncate text-[11px] tabular-nums">
            {[file.meta, pages ? `${pages} ${pages === 1 ? "page" : "pages"}` : null].filter(Boolean).join(" · ") ||
              (word ? "Word document" : "PDF document")}
          </SheetDescription>
        </div>
        {actions}
        <div className="flex items-center rounded-lg bg-muted/60 p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom out"
            className={PRESS}
            disabled={zoom === 0}
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
          >
            <MagnifyingGlassMinusIcon weight={ICON_WEIGHT} />
          </Button>
          <button
            type="button"
            title="Reset zoom"
            onClick={() => setZoom(2)}
            className="w-10 cursor-pointer text-center text-[11px] text-muted-foreground tabular-nums transition-colors hover:text-foreground"
          >
            {Math.round(ZOOMS[zoom] * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom in"
            className={PRESS}
            disabled={zoom === ZOOMS.length - 1}
            onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
          >
            <MagnifyingGlassPlusIcon weight={ICON_WEIGHT} />
          </Button>
        </div>
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
        <Button variant="ghost" size="icon-sm" aria-label="Close" className={PRESS} onClick={onClose}>
          <XIcon weight="bold" />
        </Button>
      </header>

      <div
        ref={scroller}
        className="min-h-0 flex-1 overflow-auto bg-muted/50 [mask-image:linear-gradient(to_bottom,transparent,black_10px)]"
      >
        <div className={cn("mx-auto flex w-max min-w-full flex-col items-center px-6 py-6")}>
          {failed ? (
            <div className="flex flex-col items-center gap-2 py-24 text-center text-xs text-muted-foreground">
              <WarningCircleIcon weight={ICON_WEIGHT} className="size-5" />
              This file couldn't be previewed.
              <a href={file.url} download={file.name} className="font-medium text-foreground underline-offset-2 hover:underline">
                Download instead
              </a>
            </div>
          ) : avail === 0 ? (
            <PaperSkeleton width={480} />
          ) : word ? (
            <DocxPages url={file.url} width={width} onPages={onPages} onError={onError} />
          ) : (
            <PdfPages url={file.url} width={width} onPages={onPages} onError={onError} />
          )}
        </div>
      </div>
    </>
  );
}
