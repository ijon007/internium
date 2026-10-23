import { Avatar, AvatarFallback, AvatarImage } from "@internium/ui/components/avatar";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@internium/ui/components/empty";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@internium/ui/components/input-group";
import { ScrollArea } from "@internium/ui/components/scroll-area";
import { Separator } from "@internium/ui/components/separator";
import { ChatCircleIcon, PaperPlaneRightIcon } from "@phosphor-icons/react/ssr";
import type { Conversation } from "@/types/chat";
import { getInitials } from "@/utils/chat";

type ChatViewProps = {
  conversation: Conversation | undefined;
};

export function ChatView({ conversation }: ChatViewProps) {
  if (!conversation) {
    return (
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ChatCircleIcon weight="fill" />
          </EmptyMedia>
          <EmptyTitle>No conversation selected</EmptyTitle>
          <EmptyDescription>Pick someone from the sidebar to start chatting.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const { name, avatar, lastMessage, lastMessageAt } = conversation;

  return (
    <div className="flex flex-1 flex-col rounded-lg border">
      <div className="flex items-center gap-3 p-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{name}</span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-3">
        <div className="flex max-w-[75%] flex-col gap-1 rounded-lg bg-muted px-3 py-2">
          <p className="text-sm">{lastMessage}</p>
          <span className="text-muted-foreground text-xs">{lastMessageAt}</span>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3">
        <InputGroup>
          <InputGroupInput placeholder={`Message ${name}...`} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" variant="default" aria-label="Send">
              <PaperPlaneRightIcon weight="fill" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
