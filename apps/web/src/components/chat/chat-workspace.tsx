import { ChatView } from "@/components/chat/chat-view";
import { ConversationList } from "@/components/chat/conversation-list";
import { CollapseAppSidebar } from "@/components/dashboard/collapse-app-sidebar";
import type { Conversation } from "@/types/chat";

type ChatWorkspaceProps = {
  conversation: Conversation | undefined;
};

export function ChatWorkspace({ conversation }: ChatWorkspaceProps) {
  return (
    <div className="chat-workspace flex min-h-0 flex-1 overflow-hidden">
      <CollapseAppSidebar />
      <ConversationList />
      <ChatView conversation={conversation} />
    </div>
  );
}
