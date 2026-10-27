"use client";

import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import { UserSwitchIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_PATH } from "@/constants/roles";
import { cn } from "@/lib/utils";

type SwitchRoleButtonProps = {
  className?: string;
};

export function SwitchRoleButton({ className }: SwitchRoleButtonProps) {
  return (
    <SidebarMenuButton
      tooltip="Switch role"
      className={cn(
        "size-6! w-6! min-w-6 shrink-0 p-0 [&_svg]:size-4 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:p-2!",
        className,
      )}
      render={<Link href={ROLE_PATH} />}
    >
      <UserSwitchIcon weight={ICON_WEIGHT} />
      <span className="sr-only">Switch role</span>
    </SidebarMenuButton>
  );
}
