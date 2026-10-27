"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@internium/ui/components/input-group";
import { SidebarMenu } from "@internium/ui/components/sidebar";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ConversationItem } from "@/components/chat/conversation-item";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { CONVERSATION_PARAM } from "@/constants/chat";
import { useConversations } from "@/hooks/use-conversations";
import { filterConversations, sortConversations } from "@/utils/chat";

export function ConversationList() {
  const pathname = usePathname();
  const activeId = useSearchParams().get(CONVERSATION_PARAM);
  const [query, setQuery] = useState("");
  const { conversations, togglePin, markAsRead, remove } = useConversations();

  const visible = sortConversations(filterConversations(conversations, query));

  return (
    <div className="flex w-72 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex items-center gap-1 p-2">
        <SidebarCollapseButton />
        <InputGroup className="min-w-0 flex-1">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chats..."
          />
        </InputGroup>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-1 pb-2">
        {visible.length === 0 ? (
          <p className="px-2 py-6 text-center text-muted-foreground text-xs">
            No conversations found
          </p>
        ) : (
          <SidebarMenu>
            {visible.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                href={`${pathname}?${CONVERSATION_PARAM}=${conversation.id}`}
                isActive={conversation.id === activeId}
                onTogglePin={() => togglePin(conversation.id)}
                onMarkAsRead={() => markAsRead(conversation.id)}
                onDelete={() => remove(conversation.id)}
              />
            ))}
          </SidebarMenu>
        )}
      </div>
    </div>
  );
}
