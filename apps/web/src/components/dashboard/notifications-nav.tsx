"use client";

import { Button } from "@internium/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@internium/ui/components/popover";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import { BellIcon, ChecksIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ICON_WEIGHT } from "@/constants/navigation";
import { MOCK_NOTIFICATIONS } from "@/constants/notifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notifications";

export function NotificationsNav() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = items.filter((item) => !item.read).length;
  const hasUnread = unreadCount > 0;

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Notifications"
          isActive={open}
          render={<PopoverTrigger />}
        >
          <span className="relative">
            <BellIcon weight={ICON_WEIGHT} />
            {hasUnread ? (
              <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
            ) : null}
          </span>
          <span>Notifications</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <PopoverContent
        align="start"
        side="right"
        sideOffset={8}
        className="w-80 gap-0 rounded-xl p-1 shadow-lg"
      >
        <PopoverHeader className="flex-row items-center justify-between gap-2 py-1 pr-1 pl-2.5">
          <PopoverTitle className="flex items-center gap-1.5 text-xs font-semibold">
            Notifications
            {unreadCount > 0 ? (
              <span className="rounded-full bg-primary/15 px-1.5 text-[0.625rem] font-medium text-foreground tabular-nums">
                {unreadCount}
              </span>
            ) : null}
          </PopoverTitle>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasUnread}
            className="text-muted-foreground transition-[transform,background-color,color] duration-100 active:scale-[0.97]"
            onClick={markAllRead}
          >
            <ChecksIcon data-icon="inline-start" weight="bold" />
            Mark all read
          </Button>
        </PopoverHeader>
        <div className="flex max-h-96 flex-col gap-px overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-2 py-8 text-center text-muted-foreground">
              You're all caught up
            </p>
          ) : (
            items.map((item) => (
              <NotificationRow key={item.id} notification={item} />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationRow({ notification }: { notification: Notification }) {
  return (
    <div className="grid gap-0.5 rounded-lg px-2.5 py-2 transition-colors duration-100 hover:bg-muted">
      <div className="flex min-w-0 items-center gap-2">
        <p
          className={cn(
            "min-w-0 flex-1 truncate",
            notification.read
              ? "text-muted-foreground"
              : "font-medium text-foreground",
          )}
        >
          {notification.title}
        </p>
        <span className="shrink-0 text-[0.625rem] text-muted-foreground tabular-nums">
          {notification.time}
        </span>
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full transition-colors duration-200",
            notification.read ? "bg-transparent" : "bg-primary",
          )}
        />
      </div>
      <p className="line-clamp-2 pr-3.5 text-muted-foreground/80">
        {notification.body}
      </p>
    </div>
  );
}
