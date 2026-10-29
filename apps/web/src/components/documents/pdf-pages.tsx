"use client";

import { useState } from "react";
import { PaperSkeleton } from "@/components/documents/paper-skeleton";
import { Document, Page, pdfjs } from "react-pdf";

// Must live in the same module that renders <Document>; served from /public to match pdfjs-dist.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfPages({
  url,
  width,
  onPages,
  onError,
}: {
  url: string;
  width: number;
  onPages: (count: number) => void;
  onError: () => void;
}) {
  const [count, setCount] = useState(0);
  return (
    <Document
      file={url}
      onLoadSuccess={(pdf) => {
        setCount(pdf.numPages);
        onPages(pdf.numPages);
      }}
      onLoadError={onError}
      loading={<PaperSkeleton width={width} />}
      error={null}
      className="flex flex-col items-center gap-4"
    >
      {Array.from({ length: count }, (_, i) => (
          <Page
            // biome-ignore lint/suspicious/noArrayIndexKey: pages are positional
            key={i}
            pageNumber={i + 1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<PaperSkeleton width={width} />}
            className="overflow-hidden rounded-sm bg-white shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-8px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
          />
      ))}
    </Document>
  );
}
