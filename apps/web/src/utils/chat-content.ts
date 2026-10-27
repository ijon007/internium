const URL_RE = /https?:\/\/[^\s<]+[^\s<.,;:!?)]/g;

export function extractUrls(text: string): string[] {
  return text.match(URL_RE) ?? [];
}

export function linkPreviewMeta(url: string): {
  host: string;
  title: string;
} {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return {
      host: parsed.hostname.replace(/^www\./, ""),
      title: path ? `${parsed.hostname}${path}` : parsed.hostname,
    };
  } catch {
    return { host: url, title: url };
  }
}

/** Split body into text / bold / code / link segments for light markdown. */
export type TextSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

const TOKEN_RE = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s<]+[^\s<.,;:!?)]+)/g;

export function parseLightMarkdown(input: string): TextSegment[] {
  if (!input) return [];
  const parts = input.split(TOKEN_RE);
  const segments: TextSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      segments.push({ type: "bold", value: part.slice(2, -2) });
      continue;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      segments.push({ type: "code", value: part.slice(1, -1) });
      continue;
    }
    if (/^https?:\/\//.test(part)) {
      segments.push({ type: "link", value: part, href: part });
      continue;
    }
    segments.push({ type: "text", value: part });
  }

  return segments;
}
