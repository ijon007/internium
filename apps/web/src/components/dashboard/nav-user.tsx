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
import { usePathname } from "next/navigation";
import { ICON_WEIGHT } from "@/constants/navigation";
import { SETTINGS_PATH } from "@/constants/roles";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { isSettingsPath } from "@/utils/navigation";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NavUser() {
  const pathname = usePathname();
  const { name, email, avatar } = useAccountProfile();
  const label = name || email || "Account";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Settings"
          isActive={isSettingsPath(pathname)}
          className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
          render={<Link href={SETTINGS_PATH} />}
        >
          <Avatar size="sm">
            <AvatarImage src={avatar} alt={label} />
            <AvatarFallback>{getInitials(label)}</AvatarFallback>
          </Avatar>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {label}
          </span>
          <GearIcon
            weight={ICON_WEIGHT}
            className="ml-auto group-data-[collapsible=icon]:hidden"
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
