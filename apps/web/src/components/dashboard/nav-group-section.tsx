"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@internium/ui/components/sidebar";
import type { Icon } from "@phosphor-icons/react";
import { IconNavMenu } from "@/components/dashboard/icon-nav-menu";
import { ICON_WEIGHT } from "@/constants/navigation";
import type { NavItem } from "@/types/navigation";

export function NavGroupSection({
  label,
  items,
  icon: Icon,
}: {
  label: string;
  items: NavItem[];
  icon?: Icon;
}) {
  return (
    <SidebarGroup className="px-1 pt-3 pb-0 group-data-[collapsible=icon]:px-0">
      <SidebarGroupLabel className="gap-2">
        {Icon ? <Icon weight={ICON_WEIGHT} /> : null}
        {label}
      </SidebarGroupLabel>
      <IconNavMenu items={items} />
    </SidebarGroup>
  );
}
