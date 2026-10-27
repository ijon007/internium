"use client";

import { Button } from "@internium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@internium/ui/components/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@internium/ui/components/tooltip";
import {
  ArrowBendUpLeftIcon,
  CopyIcon,
  DotsThreeIcon,
  PencilSimpleIcon,
  PushPinIcon,
  ShareFatIcon,
  SmileyIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { useState } from "react";
import { ReactionPicker } from "@/components/chat/reaction-picker";
import { ICON_WEIGHT } from "@/constants/navigation";
import { MOCK_USER } from "@/constants/user";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

const TOOLBAR_BTN = "size-7 [&_svg:not([class*='size-'])]:size-4";

type MessageActionsProps = {
  conversationId: string;
  message: ChatMessage;
};

export function MessageActions({
  conversationId,
  message,
}: MessageActionsProps) {
  const {
    setReplyTarget,
    setEditingMessageId,
    setForwardMessageId,
    softDeleteMessage,
    togglePinMessage,
    toggleReaction,
  } = useChat();
  const [reactOpen, setReactOpen] = useState(false);

  const isOwn = message.author === MOCK_USER.name;

  const startReply = () => {
    setReplyTarget({
      id: message.id,
      author: message.author,
      body: message.body || message.attachments?.[0]?.name || "Message",
    });
  };

  const copy = async () => {
    if (!message.body) return;
    try {
      await navigator.clipboard.writeText(message.body);
    } catch {
      // ponytail: clipboard may fail in insecure contexts; ignore
    }
  };

  const react = (emoji: string) => {
    toggleReaction(conversationId, message.id, emoji);
    setReactOpen(false);
  };

  return (
    <div className="pointer-events-none absolute top-0 right-3 flex translate-y-[-40%] items-center rounded-md border bg-background p-0.5 opacity-0 transition-opacity duration-150 ease-out-strong group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 motion-reduce:transition-none">
      <Popover open={reactOpen} onOpenChange={setReactOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Add reaction"
              className={TOOLBAR_BTN}
            />
          }
        >
          <SmileyIcon weight="bold" />
        </PopoverTrigger>
        <PopoverContent align="end" side="top" className="w-auto p-1.5">
          <ReactionPicker onPick={react} />
        </PopoverContent>
      </Popover>
      <ActionTip label="Reply">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Reply"
          className={`${TOOLBAR_BTN} transition-transform duration-100 ease-out-strong active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100`}
          onClick={startReply}
        >
          <ArrowBendUpLeftIcon weight={ICON_WEIGHT} />
        </Button>
      </ActionTip>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="More actions"
              className={TOOLBAR_BTN}
            />
          }
        >
          <DotsThreeIcon weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={copy}
            disabled={!message.body}
          >
            <CopyIcon weight={ICON_WEIGHT} />
            Copy text
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => togglePinMessage(conversationId, message.id)}
          >
            <PushPinIcon weight={ICON_WEIGHT} />
            {message.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setForwardMessageId(message.id)}
          >
            <ShareFatIcon weight={ICON_WEIGHT} />
            Forward
          </DropdownMenuItem>
          {isOwn ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditingMessageId(message.id)}
              >
                <PencilSimpleIcon weight={ICON_WEIGHT} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={() => softDeleteMessage(conversationId, message.id)}
              >
                <TrashIcon weight={ICON_WEIGHT} />
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ActionTip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
