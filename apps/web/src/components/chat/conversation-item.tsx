"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@internium/ui/components/context-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import {
  CheckIcon,
  PushPinIcon,
  PushPinSlashIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { ICON_WEIGHT } from "@/constants/navigation";
import type { Conversation } from "@/types/chat";

type ConversationItemProps = {
  conversation: Conversation;
  href: string;
  isActive: boolean;
  onTogglePin: () => void;
  onMarkAsRead: () => void;
};

export function ConversationItem({
  conversation,
  href,
  isActive,
  onTogglePin,
  onMarkAsRead,
}: ConversationItemProps) {
  const { name, avatar, lastMessage, lastMessageAt, unreadCount, pinned } =
    conversation;
  const hasUnread = unreadCount > 0;

  return (
    <ContextMenu>
      <ContextMenuTrigger render={<SidebarMenuItem />}>
        <SidebarMenuButton
          size="lg"
          isActive={isActive}
          className="h-auto min-w-0 py-1.5"
          render={<Link href={href} />}
        >
          <ChatAvatar name={name} src={avatar} />
          <div className="grid min-w-0 flex-1 gap-0.5 overflow-hidden">
            <div className="flex min-w-0 items-center gap-1">
              <span className="min-w-0 flex-1 truncate font-medium">
                {name}
              </span>
              {pinned ? (
                <PushPinIcon
                  weight={ICON_WEIGHT}
                  className="size-3 shrink-0 text-muted-foreground"
                />
              ) : null}
              <span className="shrink-0 text-[0.625rem] text-muted-foreground">
                {lastMessageAt}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={
                  hasUnread
                    ? "min-w-0 flex-1 truncate text-foreground text-xs"
                    : "min-w-0 flex-1 truncate text-muted-foreground text-xs"
                }
              >
                {lastMessage}
              </span>
              {hasUnread ? (
                <span className="size-2 shrink-0 rounded-full bg-primary">
                  <span className="sr-only">{unreadCount} unread</span>
                </span>
              ) : null}
            </div>
          </div>
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onTogglePin}>
          {pinned ? <PushPinSlashIcon /> : <PushPinIcon />}
          {pinned ? "Unpin" : "Pin"}
        </ContextMenuItem>
        <ContextMenuItem onClick={onMarkAsRead} disabled={!hasUnread}>
          <CheckIcon />
          Mark as Read
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
