"use client";

import { Button } from "@internium/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@internium/ui/components/tooltip";
import { ArrowBendUpLeftIcon } from "@phosphor-icons/react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

type MessageRowProps = {
  conversationId: string;
  message: ChatMessage;
  compact: boolean;
  onScrollToMessage?: (id: string) => void;
};

export function MessageRow({
  conversationId,
  message,
  compact,
  onScrollToMessage,
}: MessageRowProps) {
  const { setReplyTarget } = useChat();
  const deleted = Boolean(message.deletedAt);

  const startReply = () => {
    if (deleted) return;
    setReplyTarget({
      id: message.id,
      author: message.author,
      body: message.body || message.attachments?.[0]?.name || "Message",
    });
  };

  const body = deleted ? (
    <p className="text-muted-foreground text-sm italic">Message deleted</p>
  ) : (
    <>
      {message.replyTo ? (
        <button
          type="button"
          onClick={() => onScrollToMessage?.(message.replyTo!.id)}
          className="mb-1 w-full max-w-md rounded-md border-primary border-l-2 bg-muted/50 px-2 py-1 text-left transition-colors duration-150 ease-out hover:bg-muted"
        >
          <p className="font-medium text-primary text-xs">
            {message.replyTo.author}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {message.replyTo.body}
          </p>
        </button>
      ) : null}
      <p className="text-sm leading-relaxed">{message.body}</p>
    </>
  );

  const actions = deleted ? null : (
    <div className="pointer-events-none absolute top-0 right-3 flex translate-y-[-40%] items-center gap-0.5 rounded-md border bg-background p-0.5 opacity-0 shadow-sm ring-1 ring-foreground/5 transition-[opacity,transform] duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Reply"
              onClick={startReply}
            />
          }
        >
          <ArrowBendUpLeftIcon />
        </TooltipTrigger>
        <TooltipContent side="top">Reply</TooltipContent>
      </Tooltip>
    </div>
  );

  if (compact) {
    return (
      <div
        id={`msg-${message.id}`}
        data-conversation={conversationId}
        className="group relative flex gap-2 px-3 py-0.5 transition-colors duration-150 ease-out hover:bg-muted/50"
      >
        <span className="w-8 shrink-0 pt-0.5 text-center text-[10px] text-transparent tabular-nums group-hover:text-muted-foreground">
          {message.sentAt}
        </span>
        <div className="min-w-0 flex-1">{body}</div>
        {actions}
      </div>
    );
  }

  return (
    <div
      id={`msg-${message.id}`}
      data-conversation={conversationId}
      className="group relative mt-1.5 flex gap-2 px-3 py-1 transition-colors duration-150 ease-out hover:bg-muted/50"
    >
      <ChatAvatar name={message.author} src={message.avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{message.author}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {message.sentAt}
          </span>
        </div>
        {body}
      </div>
      {actions}
    </div>
  );
}
