"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@internium/ui/components/sidebar";
import { IconNavMenu } from "@/components/dashboard/icon-nav-menu";
import { NotificationsNav } from "@/components/dashboard/notifications-nav";
import { SHARED_NAV } from "@/constants/navigation";

export function SharedNav() {
  return (
    <SidebarGroup className="px-1 py-0 group-data-[collapsible=icon]:px-0">
      <SidebarGroupContent>
        <IconNavMenu items={SHARED_NAV} />
        <SidebarMenu>
          <NotificationsNav />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
