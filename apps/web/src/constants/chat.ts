import { MOCK_USER } from "@/constants/user";
import type { ChatMessage, Conversation } from "@/types/chat";

export const CHAT_PATH = "chat";

export const CONVERSATION_PARAM = "c";

export const REACTION_EMOJIS = ["👍", "✅", "👀", "🎉", "❤️", "😂"] as const;

function msg(
  id: string,
  author: string,
  body: string,
  sentAt: string,
  day = "Today",
  extra: Partial<ChatMessage> = {},
): ChatMessage {
  return { id, author, avatar: "", body, sentAt, day, ...extra };
}

function conversation(
  id: string,
  name: string,
  unreadCount: number,
  messages: ChatMessage[],
  extras: Partial<
    Pick<
      Conversation,
      "pinned" | "presence" | "lastSeenAt" | "firstUnreadMessageId"
    >
  > = {},
): Conversation {
  const last = messages[messages.length - 1];
  return {
    id,
    name,
    avatar: "",
    lastMessage: last?.deletedAt
      ? "Message deleted"
      : (last?.body ?? last?.attachments?.[0]?.name ?? ""),
    lastMessageAt: last?.sentAt ?? "",
    unreadCount,
    firstUnreadMessageId: extras.firstUnreadMessageId ?? null,
    pinned: extras.pinned ?? false,
    presence: extras.presence ?? "offline",
    lastSeenAt: extras.lastSeenAt ?? "Yesterday",
    messages,
  };
}

const me = MOCK_USER.name;
const maria = "Maria Popescu";

export const MOCK_CONVERSATIONS: Conversation[] = [
  conversation(
    "1",
    maria,
    1,
    [
      msg(
        "1-1",
        maria,
        "Hey Jane, just checking in after the coordinator meeting.",
        "14:05",
        "Mon, Oct 20",
      ),
      msg(
        "1-2",
        me,
        "Hey! How did it go? I couldn't stay for the last part.",
        "14:12",
        "Mon, Oct 20",
      ),
      msg(
        "1-3",
        maria,
        "Pretty good. They want the weekly reports in by Thursday from now on.",
        "14:14",
        "Mon, Oct 20",
      ),
      msg(
        "1-4",
        maria,
        "Also they asked if we can add a short note about the database work.",
        "14:15",
        "Mon, Oct 20",
        { reactions: [{ emoji: "👍", authors: [me] }] },
      ),
      msg(
        "1-5",
        me,
        "Okay, I'll keep Thursday in mind. I can draft that note tomorrow.",
        "14:28",
        "Mon, Oct 20",
      ),
      msg(
        "1-6",
        maria,
        "I started the internship agreement checklist.",
        "09:40",
        "Wed, Oct 22",
      ),
      msg(
        "1-7",
        maria,
        "Do we already have a signed copy from last year, or do we start over?",
        "09:41",
        "Wed, Oct 22",
        {
          replyTo: {
            id: "1-6",
            author: maria,
            body: "I started the internship agreement checklist.",
          },
        },
      ),
      msg(
        "1-8",
        me,
        "I think Radu has a template. I'll ask him and send it over.",
        "10:03",
        "Wed, Oct 22",
      ),
      msg(
        "1-9",
        maria,
        "Perfect. I'll hold off on filling the company fields until then.",
        "10:11",
        "Wed, Oct 22",
      ),
      msg(
        "1-10",
        me,
        "He sent it. Dropped it in the shared folder under Documents / Agreements.",
        "16:44",
        "Wed, Oct 22",
        {
          attachments: [
            {
              id: "a-1",
              name: "Internship-agreement-template.pdf",
              kind: "pdf",
              sizeLabel: "248 KB",
            },
          ],
        },
      ),
      msg("1-11", maria, "Got it, thanks!", "16:50", "Wed, Oct 22", {
        reactions: [{ emoji: "✅", authors: [me, maria] }],
      }),
      msg(
        "1-12",
        maria,
        "The attendance sheet for this week is almost done.",
        "11:20",
        "Yesterday",
        {
          attachments: [
            {
              id: "a-2",
              name: "Attendance-week-42.xlsx",
              kind: "sheet",
              sizeLabel: "56 KB",
            },
          ],
        },
      ),
      msg(
        "1-13",
        me,
        "Nice. Did Mihai send his medical note yet?",
        "11:33",
        "Yesterday",
      ),
      msg(
        "1-14",
        maria,
        "Yes, Elena uploaded it this morning. I marked him absent for Monday.",
        "11:36",
        "Yesterday",
      ),
      msg(
        "1-15",
        maria,
        "I'll send you the sheet once I double-check the hours.",
        "11:37",
        "Yesterday",
        { pinned: true },
      ),
      msg("1-16", me, "Sounds good.", "11:41", "Yesterday"),
      msg(
        "1-17",
        maria,
        "Hi Jane, I finished the weekly report draft.",
        "09:18",
      ),
      msg(
        "1-18",
        maria,
        "I added a section on the database migration — could you take a look before Friday? https://internium.app/docs/migration",
        "09:19",
      ),
      msg(
        "1-19",
        me,
        "Sure, send it over and I'll review it this afternoon.",
        "09:41",
        "Today",
      ),
      msg(
        "1-20",
        maria,
        "It's in the same folder. I also left comments on the last two slides.",
        "09:48",
      ),
      msg(
        "1-21",
        me,
        "Looking now. The migration section is clear — I'll tighten the timeline.",
        "10:21",
        "Today",
        { editedAt: "10:22" },
      ),
      msg(
        "1-22",
        maria,
        "Can you review my weekly report before Friday? I added the new section on the database migration.",
        "10:42",
      ),
    ],
    {
      presence: "online",
      lastSeenAt: "now",
      firstUnreadMessageId: "1-22",
    },
  ),
  conversation(
    "2",
    "Andrei Ionescu",
    0,
    [
      msg(
        "2-1",
        me,
        "Are you coming to the office tomorrow?",
        "08:50",
        "Today",
      ),
      msg(
        "2-2",
        "Andrei Ionescu",
        "Thanks, see you tomorrow at the office!",
        "09:15",
      ),
    ],
    { presence: "away", lastSeenAt: "12 min ago" },
  ),
  conversation(
    "3",
    "Elena Dumitru",
    1,
    [
      msg(
        "3-1",
        "Elena Dumitru",
        "The attendance sheet for this week has been uploaded.",
        "Yesterday",
        "Yesterday",
        {
          attachments: [
            {
              id: "a-3",
              name: "Attendance-week-42.xlsx",
              kind: "sheet",
              sizeLabel: "56 KB",
            },
          ],
        },
      ),
    ],
    {
      presence: "offline",
      lastSeenAt: "3 hours ago",
      firstUnreadMessageId: "3-1",
    },
  ),
  conversation(
    "4",
    "Mihai Stan",
    0,
    [
      msg(
        "4-1",
        "Mihai Stan",
        "I'll be absent on Monday, I sent the medical note to the coordinator.",
        "Yesterday",
        "Yesterday",
      ),
      msg(
        "4-2",
        me,
        "Got it, I'll mark it on the sheet.",
        "Yesterday",
        "Yesterday",
      ),
    ],
    { presence: "offline", lastSeenAt: "Yesterday" },
  ),
  conversation(
    "5",
    "Ioana Georgescu",
    0,
    [
      msg("5-1", me, "How did the client meeting go?", "Mon", "Mon"),
      msg(
        "5-2",
        "Ioana Georgescu",
        "Great work on the presentation, the client loved it.",
        "Mon",
        "Mon",
        { reactions: [{ emoji: "🎉", authors: [me] }] },
      ),
    ],
    { presence: "online", lastSeenAt: "now" },
  ),
  conversation(
    "6",
    "Radu Constantin",
    0,
    [
      msg(
        "6-1",
        "Radu Constantin",
        "Do we have a template for the internship agreement?",
        "Oct 18",
        "Oct 18",
      ),
    ],
    { presence: "offline", lastSeenAt: "Oct 18" },
  ),
];
