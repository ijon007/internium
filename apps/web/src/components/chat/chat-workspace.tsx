"use client";

import { useSearchParams } from "next/navigation";
import { ChatView } from "@/components/chat/chat-view";
import { ConversationList } from "@/components/chat/conversation-list";
import { CollapseAppSidebar } from "@/components/dashboard/collapse-app-sidebar";
import { CONVERSATION_PARAM } from "@/constants/chat";
import { ChatProvider } from "@/hooks/use-chat";

export function ChatWorkspace() {
  const initialActiveId = useSearchParams().get(CONVERSATION_PARAM);

  return (
    <ChatProvider initialActiveId={initialActiveId}>
      <div className="chat-workspace flex h-full min-h-0 flex-1 overflow-hidden">
        <CollapseAppSidebar />
        <ConversationList />
        <ChatView />
      </div>
    </ChatProvider>
  );
}
