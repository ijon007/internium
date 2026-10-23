"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@internium/ui/components/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@internium/ui/components/sidebar";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ConversationItem } from "@/components/chat/conversation-item";
import { CONVERSATION_PARAM } from "@/constants/chat";
import { useConversations } from "@/hooks/use-conversations";
import { filterConversations, sortConversations } from "@/utils/chat";

export function ChatSidebar() {
  const pathname = usePathname();
  const activeId = useSearchParams().get(CONVERSATION_PARAM);
  const [query, setQuery] = useState("");
  const { conversations, togglePin, markAsRead, remove } = useConversations();

  const visible = sortConversations(filterConversations(conversations, query));

  return (
    <Sidebar
      collapsible="none"
      className="my-2 hidden min-w-0 flex-1 overflow-hidden md:flex [&_[data-sidebar=group]]:px-1"
    >
      <SidebarHeader className="h-12 justify-center px-1">
        <InputGroup className="bg-background">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chats..."
          />
        </InputGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {visible.length === 0 ? (
              <p className="px-2 py-6 text-center text-muted-foreground text-xs">No conversations found</p>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
