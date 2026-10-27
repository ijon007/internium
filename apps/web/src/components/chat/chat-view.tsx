"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@internium/ui/components/empty";
import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useRef } from "react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ForwardMessageDialog } from "@/components/chat/forward-message-dialog";
import { MessageRow } from "@/components/chat/message-row";
import { PinnedMessagesBar } from "@/components/chat/pinned-messages-bar";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useChat } from "@/hooks/use-chat";
import type { ChatMessage } from "@/types/chat";

export function ChatView() {
  const { activeConversation, peerTyping, setPeerTyping, markAsRead } =
    useChat();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToMessage = useCallback((id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-primary/10");
    window.setTimeout(() => el.classList.remove("bg-primary/10"), 1200);
  }, []);

  useEffect(() => {
    if (!activeConversation) {
      setPeerTyping(false);
      return;
    }
    markAsRead(activeConversation.id);
    // ponytail: mock peer typing pulse while thread is open
    const start = window.setTimeout(() => setPeerTyping(true), 1800);
    const stop = window.setTimeout(() => setPeerTyping(false), 4200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
      setPeerTyping(false);
    };
  }, [activeConversation?.id, markAsRead, setPeerTyping, activeConversation]);

  if (!activeConversation) {
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

  const { id, name, avatar, messages } = activeConversation;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b px-3">
        <ChatAvatar name={name} src={avatar} size="sm" />
        <span className="font-semibold text-sm">{name}</span>
      </div>
      <PinnedMessagesBar
        conversationId={id}
        messages={messages}
        onJump={scrollToMessage}
      />
      <div ref={scrollerRef} className="h-0 min-h-0 flex-1 overflow-y-auto">
        <div className="py-3">
          {messages.map((message, index) => (
            <div key={message.id}>
              {message.day !== messages[index - 1]?.day ? (
                <DayDivider label={message.day} />
              ) : null}
              <MessageRow
                conversationId={id}
                message={message}
                compact={isCompact(messages[index - 1], message)}
                onScrollToMessage={scrollToMessage}
              />
            </div>
          ))}
          {peerTyping ? <TypingIndicator name={name} /> : null}
        </div>
      </div>
      <div className="shrink-0">
        <ChatComposer conversationId={id} name={name} />
      </div>
      <ForwardMessageDialog fromConversationId={id} />
    </div>
  );
}

function isCompact(previous: ChatMessage | undefined, current: ChatMessage) {
  return previous?.author === current.author && previous?.day === current.day;
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center px-3 py-2">
      <div className="h-px flex-1 bg-primary" />
      <span className="rounded-full bg-primary px-3 py-0.5 font-medium text-white text-xs">
        {label}
      </span>
      <div className="h-px flex-1 bg-primary" />
    </div>
  );
}
