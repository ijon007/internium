"use client";

import { Button } from "@internium/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@internium/ui/components/popover";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ReactionPicker } from "@/components/chat/reaction-picker";
import { MOCK_USER } from "@/constants/user";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type MessageReactionsProps = {
  conversationId: string;
  message: ChatMessage;
};

export function MessageReactions({
  conversationId,
  message,
}: MessageReactionsProps) {
  const { toggleReaction } = useChat();
  const [open, setOpen] = useState(false);
  const reactions = message.reactions ?? [];

  if (message.deletedAt || reactions.length === 0) return null;

  const react = (emoji: string) => {
    toggleReaction(conversationId, message.id, emoji);
    setOpen(false);
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {reactions.map((reaction) => {
        const mine = reaction.authors.includes(MOCK_USER.name);
        return (
          <button
            key={reaction.emoji}
            type="button"
            onClick={() => react(reaction.emoji)}
            className={cn(
              "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border px-1.5 text-xs transition-[background-color,border-color,transform] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
              mine
                ? "border-primary/40 bg-primary/10"
                : "border-border bg-muted/40 hover:bg-muted",
            )}
            aria-label={`${reaction.emoji} ${reaction.authors.length}`}
          >
            <span>{reaction.emoji}</span>
            <span className="tabular-nums text-muted-foreground">
              {reaction.authors.length}
            </span>
          </button>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Add reaction"
              className="size-6 rounded-full"
            />
          }
        >
          <PlusIcon className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent align="start" side="top" className="w-auto p-1.5">
          <ReactionPicker onPick={react} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
