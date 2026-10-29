"use client";

import { CheckIcon } from "@phosphor-icons/react";

import { Button } from "@internium/ui/components/button";
import { Textarea } from "@internium/ui/components/textarea";
import { type FormEvent, type KeyboardEvent, useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";

type MessageEditFormProps = {
  conversationId: string;
  messageId: string;
  initialBody: string;
};

export function MessageEditForm({
  conversationId,
  messageId,
  initialBody,
}: MessageEditFormProps) {
  const { editMessage, setEditingMessageId } = useChat();
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    setBody(initialBody);
  }, [initialBody]);

  const save = () => {
    if (!body.trim()) return;
    editMessage(conversationId, messageId, body);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    save();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      setEditingMessageId(null);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      save();
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-1 max-w-lg space-y-2">
      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        autoFocus
        className="min-h-16 text-sm"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={!body.trim()}>
          <CheckIcon weight="fill" data-icon="inline-start" />
          Save
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setEditingMessageId(null)}
        >
          Cancel
        </Button>
        <span className="text-muted-foreground text-xs">
          escape to cancel · enter to save
        </span>
      </div>
    </form>
  );
}
