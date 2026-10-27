"use client";

import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import { UserSwitchIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_PATH } from "@/constants/roles";

export function SwitchRoleButton() {
  return (
    <SidebarMenuButton
      tooltip="Switch role"
      className="size-8 shrink-0"
      render={<Link href={ROLE_PATH} />}
    >
      <UserSwitchIcon weight={ICON_WEIGHT} />
      <span className="sr-only">Switch role</span>
    </SidebarMenuButton>
  );
}
