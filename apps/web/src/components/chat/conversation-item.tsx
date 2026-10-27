"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { Badge } from "@internium/ui/components/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
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
  TrashIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import type { Conversation } from "@/types/chat";
import { getInitials } from "@/utils/chat";

type ConversationItemProps = {
  conversation: Conversation;
  href: string;
  isActive: boolean;
  onTogglePin: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
};

export function ConversationItem({
  conversation,
  href,
  isActive,
  onTogglePin,
  onMarkAsRead,
  onDelete,
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
          className="h-auto min-w-0 py-2"
          render={<Link href={href} />}
        >
          <Avatar className="shrink-0">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 gap-0.5 overflow-hidden">
            <div className="flex min-w-0 items-center gap-1">
              <span className="min-w-0 flex-1 truncate font-medium">
                {name}
              </span>
              {pinned && (
                <PushPinIcon
                  weight={ICON_WEIGHT}
                  className="size-3 shrink-0 text-muted-foreground"
                />
              )}
              <span className="shrink-0 text-muted-foreground text-xs">
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
              {hasUnread && <Badge className="shrink-0">{unreadCount}</Badge>}
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
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
