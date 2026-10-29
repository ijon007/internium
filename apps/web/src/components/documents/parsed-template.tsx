"use client";

import parse, { type DOMNode, Text } from "html-react-parser";
import { type ReactNode, useEffect, useState } from "react";

const MARKER = /\{\{(\w+)\}\}/g;

/** mammoth style map: keep the template's title and subtitle semantics. */
const STYLE_MAP = ["p[style-name='Title'] => h1:fresh", "p[style-name='Subtitle'] => p.subtitle:fresh"];

const cache = new Map<string, Promise<string>>();

/** DOCX → HTML in the browser with mammoth, cached per template URL. */
function loadHtml(url: string) {
  let html = cache.get(url);
  if (!html) {
    html = (async () => {
      const [mammoth, buf] = await Promise.all([
        import("mammoth"),
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.arrayBuffer();
        }),
      ]);
      const { value } = await mammoth.convertToHtml({ arrayBuffer: buf }, { styleMap: STYLE_MAP });
      return value;
    })();
    html.catch(() => cache.delete(url));
    cache.set(url, html);
  }
  return html;
}

/**
 * Renders a parsed template as flowing document text. Every `{{field_id}}` blank is
 * swapped for `renderBlank(id)` right where it sits in the sentence.
 */
export function ParsedTemplate({ url, renderBlank }: { url: string; renderBlank: (id: string) => ReactNode }) {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadHtml(url).then(
      (h) => alive && setHtml(h),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, [url]);

  if (failed) return <p className="text-[13px] text-neutral-500">This template couldn't be loaded.</p>;
  if (html === null) return <TemplateSkeleton />;

  return (
    <>
      {parse(html, {
        replace(node: DOMNode) {
          if (!(node instanceof Text) || !node.data.includes("{{")) return;
          const parts: ReactNode[] = [];
          let last = 0;
          for (const m of node.data.matchAll(MARKER)) {
            const at = m.index ?? 0;
            if (at > last) parts.push(node.data.slice(last, at));
            parts.push(<span key={`${m[1]}-${at}`}>{renderBlank(m[1] as string)}</span>);
            last = at + m[0].length;
          }
          if (last < node.data.length) parts.push(node.data.slice(last));
          return <>{parts}</>;
        },
      })}
    </>
  );
}

function TemplateSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3" aria-hidden>
      <div className="mx-auto h-5 w-1/2 rounded bg-neutral-100" />
      {[100, 92, 96, 70, 100, 88, 60].map((w, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <div key={i} style={{ width: `${w}%` }} className="h-3 rounded bg-neutral-100" />
      ))}
    </div>
  );
}
