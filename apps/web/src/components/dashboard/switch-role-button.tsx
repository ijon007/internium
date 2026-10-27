"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import { UserSwitchIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_PATH } from "@/constants/roles";

export function SwitchRoleButton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip="Switch role"
        render={<Link href={ROLE_PATH} />}
      >
        <UserSwitchIcon weight={ICON_WEIGHT} />
        <span>Switch role</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
