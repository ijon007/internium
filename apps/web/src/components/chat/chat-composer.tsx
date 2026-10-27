"use client";

import { Button } from "@internium/ui/components/button";
import { Textarea } from "@internium/ui/components/textarea";
import {
  PaperPlaneRightIcon,
  PlusIcon,
  SmileyIcon,
  XIcon,
} from "@phosphor-icons/react";
import { type FormEvent, type KeyboardEvent, useState } from "react";
import { useChat } from "@/hooks/use-chat";

type ChatComposerProps = {
  conversationId: string;
  name: string;
};

export function ChatComposer({ conversationId, name }: ChatComposerProps) {
  const { replyTarget, setReplyTarget, sendMessage } = useChat();
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    sendMessage(conversationId, {
      body: draft,
      replyTo: replyTarget ?? undefined,
    });
    setDraft("");
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
            <Button
              type="button"
              size="icon-lg"
              variant="ghost"
              aria-label="Attach file"
            >
              <PlusIcon />
            </Button>
            <Button
              type="button"
              size="icon-lg"
              variant="ghost"
              aria-label="Emoji"
            >
              <SmileyIcon />
            </Button>
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
