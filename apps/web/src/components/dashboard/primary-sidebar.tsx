"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@internium/ui/components/sidebar";
import { IconNavMenu } from "@/components/dashboard/icon-nav-menu";
import { NavUser } from "@/components/dashboard/nav-user";
import { SidebarLogo } from "@/components/dashboard/sidebar-logo";
import { SHARED_NAV } from "@/constants/navigation";

export function PrimarySidebar() {
  return (
    <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <IconNavMenu items={SHARED_NAV} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
