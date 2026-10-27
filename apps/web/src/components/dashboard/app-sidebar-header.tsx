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
    <SidebarHeader className="p-1 group-data-[collapsible=icon]:px-0">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-0.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <SidebarLogo />
          <div className="flex h-8 shrink-0 items-center gap-0.5 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:flex-col">
            <SwitchRoleButton />
            <SidebarCollapseButton className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
