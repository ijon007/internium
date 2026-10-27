"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useMemo,
  useState,
} from "react";
import { MOCK_CONVERSATIONS } from "@/constants/chat";
import { MOCK_USER } from "@/constants/user";
import type {
  ChatAttachment,
  ChatMessage,
  ChatReplyRef,
  Conversation,
} from "@/types/chat";

type SendPayload = {
  body: string;
  replyTo?: ChatReplyRef;
  attachments?: ChatAttachment[];
};

type ChatContextValue = {
  conversations: Conversation[];
  activeId: string | null;
  activeConversation: Conversation | undefined;
  replyTarget: ChatReplyRef | null;
  editingMessageId: string | null;
  forwardMessageId: string | null;
  peerTyping: boolean;
  setActiveId: (id: string | null) => void;
  setReplyTarget: (target: ChatReplyRef | null) => void;
  setEditingMessageId: (id: string | null) => void;
  setForwardMessageId: (id: string | null) => void;
  setPeerTyping: (typing: boolean) => void;
  togglePin: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  sendMessage: (conversationId: string, payload: SendPayload) => void;
  editMessage: (
    conversationId: string,
    messageId: string,
    body: string,
  ) => void;
  softDeleteMessage: (conversationId: string, messageId: string) => void;
  toggleReaction: (
    conversationId: string,
    messageId: string,
    emoji: string,
  ) => void;
  togglePinMessage: (conversationId: string, messageId: string) => void;
  forwardMessage: (
    fromConversationId: string,
    messageId: string,
    toConversationId: string,
  ) => void;
  findMessage: (
    conversationId: string,
    messageId: string,
  ) => ChatMessage | undefined;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function previewBody(message: ChatMessage) {
  if (message.deletedAt) return "Message deleted";
  if (message.attachments?.length && !message.body.trim()) {
    return message.attachments[0]?.name ?? "Attachment";
  }
  return message.body;
}

function patchConversation(
  prev: Conversation[],
  id: string,
  patch: (c: Conversation) => Conversation,
) {
  return prev.map((c) => (c.id === id ? patch(c) : c));
}

export function ChatProvider({
  children,
  initialActiveId = null,
}: {
  children: ReactNode;
  initialActiveId?: string | null;
}) {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);
  const [replyTarget, setReplyTarget] = useState<ChatReplyRef | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [forwardMessageId, setForwardMessageId] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId],
  );

  const findMessage = useCallback(
    (conversationId: string, messageId: string) =>
      conversations
        .find((c) => c.id === conversationId)
        ?.messages.find((m) => m.id === messageId),
    [conversations],
  );

  const togglePin = useCallback((conversationId: string) => {
    setConversations((prev) =>
      patchConversation(prev, conversationId, (c) => ({
        ...c,
        pinned: !c.pinned,
      })),
    );
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      patchConversation(prev, conversationId, (c) => ({
        ...c,
        unreadCount: 0,
        firstUnreadMessageId: null,
      })),
    );
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, payload: SendPayload) => {
      const body = payload.body.trim();
      if (!body && !payload.attachments?.length) return;

      const message: ChatMessage = {
        id: `${conversationId}-${Date.now()}`,
        author: MOCK_USER.name,
        avatar: MOCK_USER.avatar,
        body,
        sentAt: nowTime(),
        day: "Today",
        replyTo: payload.replyTo,
        attachments: payload.attachments,
      };

      setConversations((prev) =>
        patchConversation(prev, conversationId, (c) => ({
          ...c,
          lastMessage: previewBody(message),
          lastMessageAt: message.sentAt,
          unreadCount: 0,
          firstUnreadMessageId: null,
          messages: [...c.messages, message],
        })),
      );
      setReplyTarget(null);
    },
    [],
  );

  const editMessage = useCallback(
    (conversationId: string, messageId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setConversations((prev) =>
        patchConversation(prev, conversationId, (c) => {
          const messages = c.messages.map((m) =>
            m.id === messageId && !m.deletedAt
              ? { ...m, body: trimmed, editedAt: nowTime() }
              : m,
          );
          const last = messages[messages.length - 1];
          return {
            ...c,
            messages,
            lastMessage: last ? previewBody(last) : c.lastMessage,
          };
        }),
      );
      setEditingMessageId(null);
    },
    [],
  );

  const softDeleteMessage = useCallback(
    (conversationId: string, messageId: string) => {
      setConversations((prev) =>
        patchConversation(prev, conversationId, (c) => {
          const messages = c.messages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  deletedAt: nowTime(),
                  body: "",
                  attachments: undefined,
                  reactions: undefined,
                  pinned: false,
                }
              : m,
          );
          const last = messages[messages.length - 1];
          return {
            ...c,
            messages,
            lastMessage: last ? previewBody(last) : c.lastMessage,
          };
        }),
      );
    },
    [],
  );

  const toggleReaction = useCallback(
    (conversationId: string, messageId: string, emoji: string) => {
      const me = MOCK_USER.name;
      setConversations((prev) =>
        patchConversation(prev, conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId || m.deletedAt) return m;
            const reactions = [...(m.reactions ?? [])];
            const idx = reactions.findIndex((r) => r.emoji === emoji);
            if (idx === -1) {
              reactions.push({ emoji, authors: [me] });
            } else {
              const authors = reactions[idx].authors;
              const hasMe = authors.includes(me);
              if (hasMe) {
                const next = authors.filter((a) => a !== me);
                if (next.length === 0) reactions.splice(idx, 1);
                else reactions[idx] = { emoji, authors: next };
              } else {
                reactions[idx] = { emoji, authors: [...authors, me] };
              }
            }
            return { ...m, reactions };
          }),
        })),
      );
    },
    [],
  );

  const togglePinMessage = useCallback(
    (conversationId: string, messageId: string) => {
      setConversations((prev) =>
        patchConversation(prev, conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId && !m.deletedAt
              ? { ...m, pinned: !m.pinned }
              : m,
          ),
        })),
      );
    },
    [],
  );

  const forwardMessage = useCallback(
    (
      fromConversationId: string,
      messageId: string,
      toConversationId: string,
    ) => {
      const source = conversations
        .find((c) => c.id === fromConversationId)
        ?.messages.find((m) => m.id === messageId);
      if (!source || source.deletedAt) return;

      const fromName =
        conversations.find((c) => c.id === fromConversationId)?.name ??
        source.author;

      const message: ChatMessage = {
        id: `${toConversationId}-fwd-${Date.now()}`,
        author: MOCK_USER.name,
        avatar: MOCK_USER.avatar,
        body: source.body,
        sentAt: nowTime(),
        day: "Today",
        attachments: source.attachments,
        forwardedFrom: fromName,
      };

      setConversations((prev) =>
        patchConversation(prev, toConversationId, (c) => ({
          ...c,
          lastMessage: previewBody(message),
          lastMessageAt: message.sentAt,
          messages: [...c.messages, message],
        })),
      );
      setForwardMessageId(null);
    },
    [conversations],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      conversations,
      activeId,
      activeConversation,
      replyTarget,
      editingMessageId,
      forwardMessageId,
      peerTyping,
      setActiveId,
      setReplyTarget,
      setEditingMessageId,
      setForwardMessageId,
      setPeerTyping,
      togglePin,
      markAsRead,
      sendMessage,
      editMessage,
      softDeleteMessage,
      toggleReaction,
      togglePinMessage,
      forwardMessage,
      findMessage,
    }),
    [
      conversations,
      activeId,
      activeConversation,
      replyTarget,
      editingMessageId,
      forwardMessageId,
      peerTyping,
      togglePin,
      markAsRead,
      sendMessage,
      editMessage,
      softDeleteMessage,
      toggleReaction,
      togglePinMessage,
      forwardMessage,
      findMessage,
    ],
  );

  return <ChatContext value={value}>{children}</ChatContext>;
}

export function useChat() {
  const ctx = use(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
