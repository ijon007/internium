"use client";

import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_ICONS } from "@/constants/role-icons";
import { ROLE_LABELS } from "@/constants/roles";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

export function SidebarLogo() {
  const role = useCurrentRole();
  const RoleIcon = ROLE_ICONS[role];

  return (
    <SidebarMenuButton
      size="lg"
      tooltip="Internium"
      className="flex-1 group-data-[collapsible=icon]:size-8!"
      render={<Link href={getRoleHref(role, "")} />}
    >
      <Image src="/logo.png" alt="" width={32} height={32} className="size-8" />
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Internium</span>
        <span className="flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
          <RoleIcon weight={ICON_WEIGHT} className="size-3 shrink-0" />
          <span className="truncate">{ROLE_LABELS[role]}</span>
        </span>
      </div>
    </SidebarMenuButton>
  );
}
