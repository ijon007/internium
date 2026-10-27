"use client";

import { Button } from "@internium/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { useChat } from "@/hooks/use-chat";

type ForwardMessageDialogProps = {
  fromConversationId: string;
};

export function ForwardMessageDialog({
  fromConversationId,
}: ForwardMessageDialogProps) {
  const {
    conversations,
    forwardMessageId,
    setForwardMessageId,
    forwardMessage,
    findMessage,
  } = useChat();

  const open = Boolean(forwardMessageId);
  const source = forwardMessageId
    ? findMessage(fromConversationId, forwardMessageId)
    : undefined;

  const targets = conversations.filter((c) => c.id !== fromConversationId);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setForwardMessageId(null);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
          <DialogDescription>
            {source?.body
              ? `Send a copy of “${source.body.slice(0, 80)}${source.body.length > 80 ? "…" : ""}”`
              : "Choose a conversation"}
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-72 space-y-1 overflow-y-auto">
          {targets.map((conversation) => (
            <li key={conversation.id}>
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start gap-2.5 px-2 py-2"
                disabled={!forwardMessageId}
                onClick={() => {
                  if (!forwardMessageId) return;
                  forwardMessage(
                    fromConversationId,
                    forwardMessageId,
                    conversation.id,
                  );
                }}
              >
                <ChatAvatar
                  name={conversation.name}
                  src={conversation.avatar}
                  size="sm"
                />
                <span className="min-w-0 flex-1 truncate text-left font-medium">
                  {conversation.name}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
