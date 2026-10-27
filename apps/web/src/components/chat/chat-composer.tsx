"use client";

import { Button } from "@internium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { Textarea } from "@internium/ui/components/textarea";
import {
  FilePdfIcon,
  MicrosoftExcelLogoIcon,
  PaperPlaneRightIcon,
  PlusIcon,
  SmileyIcon,
  XIcon,
} from "@phosphor-icons/react";
import { type FormEvent, type KeyboardEvent, useState } from "react";
import { REACTION_EMOJIS } from "@/constants/chat";
import { useChat } from "@/hooks/use-chat";
import type { ChatAttachment } from "@/types/chat";

type ChatComposerProps = {
  conversationId: string;
  name: string;
};

const MOCK_FILES: ChatAttachment[] = [
  {
    id: "mock-pdf",
    name: "Weekly-report.pdf",
    kind: "pdf",
    sizeLabel: "312 KB",
  },
  {
    id: "mock-sheet",
    name: "Attendance.xlsx",
    kind: "sheet",
    sizeLabel: "48 KB",
  },
];

export function ChatComposer({ conversationId, name }: ChatComposerProps) {
  const { replyTarget, setReplyTarget, sendMessage } = useChat();
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const canSend = draft.trim().length > 0 || attachments.length > 0;

  const submit = () => {
    if (!canSend) return;
    sendMessage(conversationId, {
      body: draft,
      replyTo: replyTarget ?? undefined,
      attachments: attachments.length
        ? attachments.map((a) => ({
            ...a,
            id: `${a.id}-${Date.now()}`,
          }))
        : undefined,
    });
    setDraft("");
    setAttachments([]);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    submit();
  };

  const addAttachment = (file: ChatAttachment) => {
    setAttachments((prev) =>
      prev.some((a) => a.name === file.name) ? prev : [...prev, file],
    );
  };

  const insertEmoji = (emoji: string) => {
    setDraft((prev) => `${prev}${emoji}`);
  };

  return (
    <form className="p-3" onSubmit={onSubmit}>
      {replyTarget ? (
        <div className="mb-2 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-2">
          <div className="min-w-0 flex-1 border-primary border-l-2 pl-2">
            <p className="font-medium text-primary text-xs">
              Replying to {replyTarget.author}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {replyTarget.body}
            </p>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Cancel reply"
            onClick={() => setReplyTarget(null)}
          >
            <XIcon />
          </Button>
        </div>
      ) : null}
      {attachments.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((file) => (
            <li
              key={file.name}
              className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() =>
                  setAttachments((prev) =>
                    prev.filter((a) => a.name !== file.name),
                  )
                }
              >
                <XIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="rounded-lg border border-input bg-background transition-[box-shadow,border-color] duration-150 ease-out focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Message ${name}`}
          rows={1}
          className="max-h-40 min-h-10 rounded-lg border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-between px-1.5 pb-1.5">
          <div className="flex items-center gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="ghost"
                    aria-label="Attach file"
                  />
                }
              >
                <PlusIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {MOCK_FILES.map((file) => (
                  <DropdownMenuItem
                    key={file.id}
                    onClick={() => addAttachment(file)}
                  >
                    {file.kind === "pdf" ? (
                      <FilePdfIcon />
                    ) : (
                      <MicrosoftExcelLogoIcon />
                    )}
                    {file.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="ghost"
                    aria-label="Emoji"
                  />
                }
              >
                <SmileyIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-0 p-1.5">
                <div className="flex gap-0.5">
                  {REACTION_EMOJIS.map((emoji) => (
                    <DropdownMenuItem
                      key={emoji}
                      className="size-8 justify-center p-0 text-base"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            type="submit"
            size="icon-lg"
            variant={canSend ? "default" : "ghost"}
            disabled={!canSend}
            aria-label="Send"
            className="transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <PaperPlaneRightIcon weight="fill" />
          </Button>
        </div>
      </div>
    </form>
  );
}
