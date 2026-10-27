"use client";

import { Button } from "@internium/ui/components/button";
import { PushPinIcon, XIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT } from "@/constants/navigation";
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
  const snippet = latest.body || latest.attachments?.[0]?.name || "Attachment";

  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-b px-3">
      <span className="h-4 w-0.5 shrink-0 rounded-full bg-primary" />
      <PushPinIcon
        className="size-3.5 shrink-0 text-muted-foreground"
        weight={ICON_WEIGHT}
      />
      <button
        type="button"
        onClick={() => onJump(latest.id)}
        className="min-w-0 flex-1 cursor-pointer truncate text-left text-xs transition-opacity duration-150 ease-out-strong hover:opacity-70"
      >
        <span className="text-muted-foreground">
          {pinned.length > 1 ? `${pinned.length} pinned` : "Pinned"}
        </span>
        <span className="mx-1.5 text-muted-foreground/40">·</span>
        <span>{snippet}</span>
      </button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Unpin"
        className="size-6 [&_svg:not([class*='size-'])]:size-3.5"
        onClick={() => togglePinMessage(conversationId, latest.id)}
      >
        <XIcon />
      </Button>
    </div>
  );
}
