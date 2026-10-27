import { ChatView } from "@/components/chat/chat-view";
import { ConversationList } from "@/components/chat/conversation-list";
import type { Conversation } from "@/types/chat";

type ChatWorkspaceProps = {
  conversation: Conversation | undefined;
};

export function ChatWorkspace({ conversation }: ChatWorkspaceProps) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ConversationList />
      <ChatView conversation={conversation} />
    </div>
  );
}
