"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import { GearIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { MOCK_USER } from "@/constants/user";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NavUser() {
  const role = useCurrentRole();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Settings"
          render={<Link href={getRoleHref(role, "settings")} />}
        >
          <Avatar size="sm">
            <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
            <AvatarFallback>{getInitials(MOCK_USER.name)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{MOCK_USER.name}</span>
          <GearIcon weight={ICON_WEIGHT} className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
