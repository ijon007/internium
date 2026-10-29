"use client";

import { useEffect, useRef, useState } from "react";
import { PaperSkeleton } from "@/components/documents/paper-skeleton";

/** Renders a .docx client-side with docx-preview; each Word section becomes a paper page. */
export default function DocxPages({
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
  const body = useRef<HTMLDivElement>(null);
  const styles = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ renderAsync }, blob] = await Promise.all([
          import("docx-preview"),
          fetch(url).then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            return r.blob();
          }),
        ]);
        if (!alive || !body.current || !styles.current) return;
        await renderAsync(blob, body.current, styles.current, {
          className: "docx",
          inWrapper: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
        });
        if (!alive || !body.current) return;
        const pages = body.current.querySelectorAll("section.docx");
        setNatural((pages[0] as HTMLElement | undefined)?.offsetWidth ?? 794);
        onPages(pages.length);
      } catch {
        if (alive) onError();
      }
    })();
    return () => {
      alive = false;
    };
  }, [url, onPages, onError]);

  return (
    <>
      {natural === 0 ? <PaperSkeleton width={width} /> : null}
      <div ref={styles} hidden />
      <div
        ref={body}
        style={{ zoom: natural ? width / natural : 1 }}
        className="flex flex-col items-center gap-4 text-black [&_section.docx]:mb-0! [&_section.docx]:rounded-sm [&_section.docx]:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-8px_rgb(0_0_0/0.18)]"
      />
    </>
  );
}
