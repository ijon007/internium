"use client";

import {
  FileIcon,
  FilePdfIcon,
  MicrosoftExcelLogoIcon,
} from "@phosphor-icons/react";
import type { ChatAttachment } from "@/types/chat";
import {
  extractUrls,
  linkPreviewMeta,
  parseLightMarkdown,
} from "@/utils/chat-content";

type MessageContentProps = {
  body: string;
  editedAt?: string;
  attachments?: ChatAttachment[];
  /** When false, skip link preview cards (markdown links still render). */
  showLinkPreviews?: boolean;
  /** When false, render plain text (no markdown). */
  markdown?: boolean;
};

export function MessageContent({
  body,
  editedAt,
  attachments,
  showLinkPreviews = true,
  markdown = true,
}: MessageContentProps) {
  const urls = showLinkPreviews ? extractUrls(body) : [];
  const segments = markdown ? parseLightMarkdown(body) : null;

  return (
    <div className="space-y-1.5">
      {body ? (
        <p className="text-sm leading-relaxed">
          {segments
            ? segments.map((segment, index) => {
                const key = `${segment.type}-${index}`;
                switch (segment.type) {
                  case "bold":
                    return (
                      <strong key={key} className="font-semibold">
                        {segment.value}
                      </strong>
                    );
                  case "code":
                    return (
                      <code
                        key={key}
                        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8rem]"
                      >
                        {segment.value}
                      </code>
                    );
                  case "link":
                    return (
                      <a
                        key={key}
                        href={segment.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {segment.value}
                      </a>
                    );
                  case "text":
                    return <span key={key}>{segment.value}</span>;
                  default: {
                    const _exhaustive: never = segment;
                    return _exhaustive;
                  }
                }
              })
            : body}
          {editedAt ? (
            <span className="ml-1 text-muted-foreground text-xs">(edited)</span>
          ) : null}
        </p>
      ) : null}
      {attachments?.length ? (
        <ul className="flex flex-col gap-1.5">
          {attachments.map((file) => (
            <li key={file.id}>
              <AttachmentChip attachment={file} />
            </li>
          ))}
        </ul>
      ) : null}
      {urls.map((url) => {
        const meta = linkPreviewMeta(url);
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="block max-w-sm overflow-hidden rounded-lg border bg-muted/30 transition-colors duration-150 ease-out hover:bg-muted/50"
          >
            <div className="border-b bg-muted/40 px-3 py-2">
              <p className="truncate font-medium text-xs">{meta.title}</p>
              <p className="truncate text-muted-foreground text-[0.65rem] uppercase tracking-wide">
                {meta.host}
              </p>
            </div>
            <p className="truncate px-3 py-2 text-muted-foreground text-xs">
              {url}
            </p>
          </a>
        );
      })}
    </div>
  );
}

function AttachmentChip({ attachment }: { attachment: ChatAttachment }) {
  const Icon =
    attachment.kind === "pdf"
      ? FilePdfIcon
      : attachment.kind === "sheet"
        ? MicrosoftExcelLogoIcon
        : FileIcon;

  return (
    <div className="inline-flex max-w-xs items-center gap-2 rounded-md border border-border/80 bg-muted/40 px-2 py-1.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground">
        <Icon className="size-4" weight="fill" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-xs leading-tight">
          {attachment.name}
        </p>
        <p className="text-muted-foreground text-[0.65rem] leading-tight">
          {attachment.sizeLabel}
        </p>
      </div>
    </div>
  );
}
