import { MOCK_USER } from "@/constants/user";
import type { ChatMessage, Conversation } from "@/types/chat";

export const CHAT_PATH = "chat";

export const CONVERSATION_PARAM = "c";

function msg(
  id: string,
  author: string,
  body: string,
  sentAt: string,
): ChatMessage {
  return { id, author, avatar: "", body, sentAt };
}

function conversation(
  id: string,
  name: string,
  unreadCount: number,
  messages: ChatMessage[],
): Conversation {
  const last = messages[messages.length - 1];
  return {
    id,
    name,
    avatar: "",
    lastMessage: last?.body ?? "",
    lastMessageAt: last?.sentAt ?? "",
    unreadCount,
    pinned: false,
    messages,
  };
}

const me = MOCK_USER.name;

export const MOCK_CONVERSATIONS: Conversation[] = [
  conversation("1", "Maria Popescu", 2, [
    msg(
      "1-1",
      "Maria Popescu",
      "Hi Jane, I finished the weekly report draft.",
      "09:18",
    ),
    msg(
      "1-2",
      "Maria Popescu",
      "I added a section on the database migration — could you take a look before Friday?",
      "09:19",
    ),
    msg(
      "1-3",
      me,
      "Sure, send it over and I'll review it this afternoon.",
      "09:41",
    ),
    msg(
      "1-4",
      "Maria Popescu",
      "Can you review my weekly report before Friday? I added the new section on the database migration.",
      "10:42",
    ),
  ]),
  conversation("2", "Andrei Ionescu", 0, [
    msg("2-1", me, "Are you coming to the office tomorrow?", "08:50"),
    msg(
      "2-2",
      "Andrei Ionescu",
      "Thanks, see you tomorrow at the office!",
      "09:15",
    ),
  ]),
  conversation("3", "Elena Dumitru", 1, [
    msg(
      "3-1",
      "Elena Dumitru",
      "The attendance sheet for this week has been uploaded.",
      "Yesterday",
    ),
  ]),
  conversation("4", "Mihai Stan", 0, [
    msg(
      "4-1",
      "Mihai Stan",
      "I'll be absent on Monday, I sent the medical note to the coordinator.",
      "Yesterday",
    ),
    msg("4-2", me, "Got it, I'll mark it on the sheet.", "Yesterday"),
  ]),
  conversation("5", "Ioana Georgescu", 0, [
    msg("5-1", me, "How did the client meeting go?", "Mon"),
    msg(
      "5-2",
      "Ioana Georgescu",
      "Great work on the presentation, the client loved it.",
      "Mon",
    ),
  ]),
  conversation("6", "Radu Constantin", 0, [
    msg(
      "6-1",
      "Radu Constantin",
      "Do we have a template for the internship agreement?",
      "Oct 18",
    ),
  ]),
];
