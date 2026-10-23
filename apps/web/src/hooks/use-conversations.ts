"use client";

import { useState } from "react";
import { MOCK_CONVERSATIONS } from "@/constants/chat";
import type { Conversation } from "@/types/chat";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  const update = (id: string, patch: (conversation: Conversation) => Partial<Conversation>) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch(c) } : c)));

  return {
    conversations,
    togglePin: (id: string) => update(id, (c) => ({ pinned: !c.pinned })),
    markAsRead: (id: string) => update(id, () => ({ unreadCount: 0 })),
    remove: (id: string) => setConversations((prev) => prev.filter((c) => c.id !== id)),
  };
}
