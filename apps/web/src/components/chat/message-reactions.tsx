"use client";

import { Button } from "@internium/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@internium/ui/components/popover";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { REACTION_EMOJIS } from "@/constants/chat";
import { MOCK_USER } from "@/constants/user";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type MessageReactionsProps = {
  conversationId: string;
  message: ChatMessage;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MessageReactions({
  conversationId,
  message,
  open,
  onOpenChange,
}: MessageReactionsProps) {
  const { toggleReaction } = useChat();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const reactions = message.reactions ?? [];

  if (message.deletedAt) return null;

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
              "inline-flex h-6 items-center gap-1 rounded-full border px-1.5 text-xs transition-transform duration-150 ease-out active:scale-[0.97]",
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
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Add reaction"
              className={cn(
                "size-6 rounded-full",
                reactions.length === 0 &&
                  "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              )}
            />
          }
        >
          <PlusIcon className="size-3" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-1.5">
          <div className="flex gap-0.5">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => react(emoji)}
                className="flex size-8 items-center justify-center rounded-md text-base transition-colors duration-150 ease-out hover:bg-muted active:scale-[0.97]"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
