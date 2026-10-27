"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
} from "@internium/ui/components/sidebar";
import { IconNavMenu } from "@/components/dashboard/icon-nav-menu";
import { SHARED_NAV } from "@/constants/navigation";

export function SharedNav() {
  return (
    <SidebarGroup className="px-1 py-0 group-data-[collapsible=icon]:px-0">
      <SidebarGroupContent>
        <IconNavMenu items={SHARED_NAV} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
