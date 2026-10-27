"use client";

import { useState } from "react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { MessageActions } from "@/components/chat/message-actions";
import { MessageContent } from "@/components/chat/message-content";
import { MessageEditForm } from "@/components/chat/message-edit-form";
import { MessageReactions } from "@/components/chat/message-reactions";
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
  const { editingMessageId } = useChat();
  const [reactOpen, setReactOpen] = useState(false);
  const deleted = Boolean(message.deletedAt);
  const editing = editingMessageId === message.id;

  const body = deleted ? (
    <p className="text-muted-foreground text-sm italic">Message deleted</p>
  ) : editing ? (
    <MessageEditForm
      conversationId={conversationId}
      messageId={message.id}
      initialBody={message.body}
    />
  ) : (
    <>
      {message.forwardedFrom ? (
        <p className="mb-0.5 text-muted-foreground text-xs">
          Forwarded from {message.forwardedFrom}
        </p>
      ) : null}
      {message.replyTo ? (
        <button
          type="button"
          onClick={() => {
            const id = message.replyTo?.id;
            if (id) onScrollToMessage?.(id);
          }}
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
      <MessageContent
        body={message.body}
        editedAt={message.editedAt}
        attachments={message.attachments}
      />
      <MessageReactions
        conversationId={conversationId}
        message={message}
        open={reactOpen}
        onOpenChange={setReactOpen}
      />
    </>
  );

  const actions =
    deleted || editing ? null : (
      <MessageActions
        conversationId={conversationId}
        message={message}
        onReactOpen={() => setReactOpen(true)}
      />
    );

  if (compact) {
    return (
      <div
        id={`msg-${message.id}`}
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
      className="group relative mt-1.5 flex gap-2 px-3 py-1 transition-colors duration-150 ease-out hover:bg-muted/50"
    >
      <ChatAvatar name={message.author} src={message.avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{message.author}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {message.sentAt}
          </span>
          {message.pinned ? (
            <span className="text-muted-foreground text-xs">Pinned</span>
          ) : null}
        </div>
        {body}
      </div>
      {actions}
    </div>
  );
}
