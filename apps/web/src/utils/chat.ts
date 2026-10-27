import type { Conversation } from "@/types/chat";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function filterConversations(
  conversations: Conversation[],
  query: string,
): Conversation[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return conversations;
  return conversations.filter(
    ({ name, lastMessage }) =>
      name.toLowerCase().includes(normalized) ||
      lastMessage.toLowerCase().includes(normalized),
  );
}

export function sortConversations(
  conversations: Conversation[],
): Conversation[] {
  return [...conversations].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}
