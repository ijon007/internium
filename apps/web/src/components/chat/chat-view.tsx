"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@internium/ui/components/empty";
import { ScrollArea } from "@internium/ui/components/scroll-area";
import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { ChatComposer } from "@/components/chat/chat-composer";
import type { ChatMessage, Conversation } from "@/types/chat";

type ChatViewProps = {
  conversation: Conversation | undefined;
};

export function ChatView({ conversation }: ChatViewProps) {
  if (!conversation) {
    return (
      <Empty className="min-h-0 flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ChatCircleIcon weight="fill" />
          </EmptyMedia>
          <EmptyTitle>No conversation selected</EmptyTitle>
          <EmptyDescription>
            Pick someone from the list to start chatting.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const { name, avatar, messages } = conversation;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b px-3">
        <ChatAvatar name={name} src={avatar} size="sm" />
        <span className="font-semibold text-sm">{name}</span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="py-3">
          <div className="flex items-center px-3 py-2">
            <div className="h-px flex-1 bg-primary" />
            <span className="rounded-full bg-primary px-3 py-0.5 font-medium text-white text-xs">
              Today
            </span>
            <div className="h-px flex-1 bg-primary" />
          </div>
          {messages.map((message, index) => (
            <MessageRow
              key={message.id}
              message={message}
              compact={isCompact(messages[index - 1], message)}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatComposer name={name} />
    </div>
  );
}

function isCompact(previous: ChatMessage | undefined, current: ChatMessage) {
  return previous?.author === current.author;
}

function MessageRow({
  message,
  compact,
}: {
  message: ChatMessage;
  compact: boolean;
}) {
  if (compact) {
    return (
      <div className="group flex gap-2 px-3 py-0.5 hover:bg-muted/50">
        <span className="w-8 shrink-0 pt-0.5 text-center text-[10px] text-transparent tabular-nums group-hover:text-muted-foreground">
          {message.sentAt}
        </span>
        <p className="min-w-0 text-sm leading-relaxed">{message.body}</p>
      </div>
    );
  }

  return (
    <div className="group mt-1.5 flex gap-2 px-3 py-1 hover:bg-muted/50">
      <ChatAvatar name={message.author} src={message.avatar} />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{message.author}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {message.sentAt}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{message.body}</p>
      </div>
    </div>
  );
}
