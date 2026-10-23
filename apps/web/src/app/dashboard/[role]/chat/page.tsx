import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChatView } from "@/components/chat/chat-view";
import { CONVERSATION_PARAM, MOCK_CONVERSATIONS } from "@/constants/chat";
import { isRole } from "@/utils/navigation";

export const metadata: Metadata = {
  title: "Chat",
  description: "Message the people you work with.",
};

export default function ChatPage(props: PageProps<"/dashboard/[role]/chat">) {
  return (
    <Suspense>
      <ChatPageContent {...props} />
    </Suspense>
  );
}

async function ChatPageContent({ params, searchParams }: PageProps<"/dashboard/[role]/chat">) {
  const { role } = await params;
  if (!isRole(role)) notFound();

  const conversationId = (await searchParams)[CONVERSATION_PARAM];
  const conversation = MOCK_CONVERSATIONS.find(({ id }) => id === conversationId);

  return <ChatView conversation={conversation} />;
}
