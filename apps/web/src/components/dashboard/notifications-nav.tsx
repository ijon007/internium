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
  const hasUnread = items.some((item) => !item.read);

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
        className="w-80 gap-0 p-0"
      >
        <PopoverHeader className="flex-row items-center justify-between gap-2 border-b px-2.5 py-1.5">
          <PopoverTitle className="text-xs">Notifications</PopoverTitle>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasUnread}
            className="text-muted-foreground active:scale-[0.97]"
            onClick={markAllRead}
          >
            <ChecksIcon data-icon="inline-start" weight={ICON_WEIGHT} />
            Mark as read
          </Button>
        </PopoverHeader>
        <div className="max-h-80 overflow-y-auto p-1">
          {items.length === 0 ? (
            <p className="px-2 py-6 text-center text-muted-foreground">
              No notifications
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
    <div className="flex gap-2 rounded-md px-2 py-1.5">
      <span
        className={cn(
          "mt-1 size-1.5 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : "bg-primary",
        )}
      />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 truncate",
              notification.read ? "font-normal" : "font-medium",
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-[0.625rem] text-muted-foreground tabular-nums">
            {notification.time}
          </span>
        </div>
        <p className="line-clamp-2 text-xs/snug text-muted-foreground">
          {notification.body}
        </p>
      </div>
    </div>
  );
}
