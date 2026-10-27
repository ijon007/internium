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
import { type FormEvent, type KeyboardEvent, useEffect, useState } from "react";
import { ReplyQuote } from "@/components/chat/reply-quote";
import { REACTION_EMOJIS } from "@/constants/chat";
import { ICON_WEIGHT } from "@/constants/navigation";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatAttachment, ChatReplyRef } from "@/types/chat";

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
  const shownReply = useExitingReply(replyTarget);
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
                className="cursor-pointer text-muted-foreground transition-colors duration-150 ease-out-strong hover:text-foreground"
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
      <div className="rounded-lg border border-input bg-background transition-[box-shadow,border-color] duration-150 ease-out-strong focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out-strong motion-reduce:transition-none",
            replyTarget ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            {shownReply ? (
              <div
                className={cn(
                  "px-3 pt-2 transition-[opacity,transform] duration-200 ease-out-strong motion-reduce:transform-none motion-reduce:transition-opacity",
                  replyTarget
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0",
                )}
              >
                <ReplyQuote
                  author={shownReply.author}
                  body={shownReply.body}
                  onDismiss={() => setReplyTarget(null)}
                  className="mb-0"
                />
              </div>
            ) : null}
          </div>
        </div>
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
                <PlusIcon weight="bold" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {MOCK_FILES.map((file) => (
                  <DropdownMenuItem
                    key={file.id}
                    className="cursor-pointer"
                    onClick={() => addAttachment(file)}
                  >
                    {file.kind === "pdf" ? (
                      <FilePdfIcon weight={ICON_WEIGHT} />
                    ) : (
                      <MicrosoftExcelLogoIcon weight={ICON_WEIGHT} />
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
                <SmileyIcon weight="bold" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-0 p-1.5">
                <div className="flex gap-0.5">
                  {REACTION_EMOJIS.map((emoji) => (
                    <DropdownMenuItem
                      key={emoji}
                      className="size-8 cursor-pointer justify-center p-0 text-base"
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
            className="transition-transform duration-150 ease-out-strong active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <PaperPlaneRightIcon weight={ICON_WEIGHT} />
          </Button>
        </div>
      </div>
    </form>
  );
}

function useExitingReply(replyTarget: ChatReplyRef | null) {
  const [shown, setShown] = useState(replyTarget);

  useEffect(() => {
    if (replyTarget) {
      setShown(replyTarget);
      return;
    }
    const id = window.setTimeout(() => setShown(null), 200);
    return () => window.clearTimeout(id);
  }, [replyTarget]);

  return shown;
}
