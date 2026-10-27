import { parseLightMarkdown } from "@/utils/chat-content";

// ponytail: assert-based check for light markdown tokenizer
const segments = parseLightMarkdown(
  "see **bold** and `code` at https://x.test/a",
);
const types = segments.map((s) => s.type).join(",");
if (types !== "text,bold,text,code,text,link") {
  throw new Error(`chat-content selfcheck failed: ${types}`);
}
