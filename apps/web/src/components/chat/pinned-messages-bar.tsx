"use client";

import { Button } from "@internium/ui/components/button";
import { PushPinIcon, XIcon } from "@phosphor-icons/react";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

type PinnedMessagesBarProps = {
  conversationId: string;
  messages: ChatMessage[];
  onJump: (id: string) => void;
};

export function PinnedMessagesBar({
  conversationId,
  messages,
  onJump,
}: PinnedMessagesBarProps) {
  const { togglePinMessage } = useChat();
  const pinned = messages.filter((m) => m.pinned && !m.deletedAt);
  if (pinned.length === 0) return null;

  const latest = pinned[pinned.length - 1];

  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-muted/30 px-3 py-1.5">
      <PushPinIcon className="size-3.5 shrink-0 text-primary" weight="fill" />
      <button
        type="button"
        onClick={() => onJump(latest.id)}
        className="min-w-0 flex-1 text-left transition-opacity duration-150 ease-out hover:opacity-80"
      >
        <p className="font-medium text-xs">
          {pinned.length} pinned · {latest.author}
        </p>
        <p className="truncate text-muted-foreground text-xs">
          {latest.body || latest.attachments?.[0]?.name || "Attachment"}
        </p>
      </button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Unpin"
        onClick={() => togglePinMessage(conversationId, latest.id)}
      >
        <XIcon />
      </Button>
    </div>
  );
}
