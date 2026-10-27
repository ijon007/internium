"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@internium/ui/components/sidebar";
import { IconNavMenu } from "@/components/dashboard/icon-nav-menu";
import { ICON_WEIGHT, ROLE_NAV } from "@/constants/navigation";
import { ROLE_ICONS } from "@/constants/role-icons";
import { ROLE_LABELS } from "@/constants/roles";
import { useCurrentRole } from "@/hooks/use-current-role";

export function RoleNav() {
  const role = useCurrentRole();
  const RoleIcon = ROLE_ICONS[role];
  const items = ROLE_NAV[role].flatMap((group) => group.items);

  return (
    <SidebarGroup className="px-1 pt-3 pb-0 group-data-[collapsible=icon]:px-0">
      <SidebarGroupLabel className="gap-2">
        <RoleIcon weight={ICON_WEIGHT} />
        {ROLE_LABELS[role]}
      </SidebarGroupLabel>
      <IconNavMenu items={items} />
    </SidebarGroup>
  );
}
