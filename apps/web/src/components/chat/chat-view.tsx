"use client";

import { Button } from "@internium/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@internium/ui/components/empty";
import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ForwardMessageDialog } from "@/components/chat/forward-message-dialog";
import { MessageRow } from "@/components/chat/message-row";
import { PinnedMessagesBar } from "@/components/chat/pinned-messages-bar";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

export function ChatView() {
  const {
    conversations,
    activeConversation,
    peerTyping,
    setPeerTyping,
    markAsRead,
  } = useChat();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;
  const [searchQuery, setSearchQuery] = useState("");
  const [showJump, setShowJump] = useState(false);
  // Snapshot unread anchor when opening a thread (markAsRead clears store).
  const [unreadAnchorId, setUnreadAnchorId] = useState<string | null>(null);
  const activeId = activeConversation?.id ?? null;

  const scrollToMessage = useCallback((id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-primary/10");
    window.setTimeout(() => el.classList.remove("bg-primary/10"), 1200);
  }, []);

  const onScroll = useCallback(() => {
    const root = scrollerRef.current;
    if (!root || !unreadAnchorId) {
      setShowJump(false);
      return;
    }
    const target = document.getElementById(`msg-${unreadAnchorId}`);
    if (!target) {
      setShowJump(false);
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const below = targetRect.top > rootRect.bottom - 40;
    setShowJump(below);
  }, [unreadAnchorId]);

  useEffect(() => {
    setSearchQuery("");
    setShowJump(false);
    if (!activeId) {
      setUnreadAnchorId(null);
      setPeerTyping(false);
      return;
    }
    const opened = conversationsRef.current.find((c) => c.id === activeId);
    setUnreadAnchorId(opened?.firstUnreadMessageId ?? null);
    markAsRead(activeId);
    const start = window.setTimeout(() => setPeerTyping(true), 1800);
    const stop = window.setTimeout(() => setPeerTyping(false), 4200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
      setPeerTyping(false);
    };
  }, [activeId, markAsRead, setPeerTyping]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const filteredMessages = useMemo(() => {
    if (!activeConversation) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeConversation.messages;
    return activeConversation.messages.filter((m) =>
      m.body.toLowerCase().includes(q),
    );
  }, [activeConversation, searchQuery]);

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

  const { id, name, messages } = activeConversation;
  const searching = searchQuery.trim().length > 0;
  const list = searching ? filteredMessages : messages;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader
        conversation={activeConversation}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      <PinnedMessagesBar
        conversationId={id}
        messages={messages}
        onJump={scrollToMessage}
      />
      <div ref={scrollerRef} className="h-0 min-h-0 flex-1 overflow-y-auto">
        <div className="py-3">
          {list.length === 0 ? (
            <p className="px-3 py-8 text-center text-muted-foreground text-xs">
              No messages match “{searchQuery.trim()}”
            </p>
          ) : (
            list.map((message, index) => {
              const prev = list[index - 1];
              const showUnread =
                !searching &&
                unreadAnchorId === message.id &&
                Boolean(unreadAnchorId);
              return (
                <div key={message.id}>
                  {showUnread ? <UnreadDivider /> : null}
                  {!searching && message.day !== prev?.day ? (
                    <DayDivider label={message.day} />
                  ) : null}
                  <div
                    className={cn(
                      searching &&
                        searchQuery &&
                        message.body
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()) &&
                        "bg-primary/5",
                    )}
                  >
                    <MessageRow
                      conversationId={id}
                      message={message}
                      compact={!searching && isCompact(prev, message)}
                      onScrollToMessage={scrollToMessage}
                    />
                  </div>
                </div>
              );
            })
          )}
          {peerTyping && !searching ? <TypingIndicator name={name} /> : null}
        </div>
      </div>
      {showJump && unreadAnchorId && !searching ? (
        <div className="pointer-events-none absolute right-4 bottom-24 z-10">
          <Button
            type="button"
            size="sm"
            className="pointer-events-auto shadow-md transition-transform duration-150 ease-out active:scale-[0.97]"
            onClick={() => scrollToMessage(unreadAnchorId)}
          >
            Jump to unread
          </Button>
        </div>
      ) : null}
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

function UnreadDivider() {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="h-px flex-1 bg-destructive/70" />
      <span className="font-medium text-destructive text-[0.65rem] uppercase tracking-wide">
        New
      </span>
      <div className="h-px flex-1 bg-destructive/70" />
    </div>
  );
}
