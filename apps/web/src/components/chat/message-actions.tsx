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
import { MOCK_USER } from "@/constants/user";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

type MessageActionsProps = {
  conversationId: string;
  message: ChatMessage;
  onReactOpen?: () => void;
};

export function MessageActions({
  conversationId,
  message,
  onReactOpen,
}: MessageActionsProps) {
  const {
    setReplyTarget,
    setEditingMessageId,
    setForwardMessageId,
    softDeleteMessage,
    togglePinMessage,
  } = useChat();

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

  return (
    <div className="pointer-events-none absolute top-0 right-3 flex translate-y-[-40%] items-center gap-0.5 rounded-md border bg-background p-0.5 opacity-0 shadow-sm ring-1 ring-foreground/5 transition-opacity duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
      <ActionTip label="Add reaction">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Add reaction"
          onClick={onReactOpen}
        >
          <SmileyIcon />
        </Button>
      </ActionTip>
      <ActionTip label="Reply">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Reply"
          onClick={startReply}
        >
          <ArrowBendUpLeftIcon />
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
            />
          }
        >
          <DotsThreeIcon weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={copy} disabled={!message.body}>
            <CopyIcon />
            Copy text
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => togglePinMessage(conversationId, message.id)}
          >
            <PushPinIcon />
            {message.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setForwardMessageId(message.id)}>
            <ShareFatIcon />
            Forward
          </DropdownMenuItem>
          {isOwn ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditingMessageId(message.id)}>
                <PencilSimpleIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => softDeleteMessage(conversationId, message.id)}
              >
                <TrashIcon />
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
