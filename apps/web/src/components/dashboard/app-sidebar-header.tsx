"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { SidebarLogo } from "@/components/dashboard/sidebar-logo";
import { SwitchRoleButton } from "@/components/dashboard/switch-role-button";

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-0.5">
          <SidebarLogo />
          <SidebarCollapseButton className="size-8 shrink-0 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuItem>
        <SwitchRoleButton />
      </SidebarMenu>
    </SidebarHeader>
  );
}
