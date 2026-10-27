"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@internium/ui/components/sidebar";
import type { ComponentProps } from "react";
import { AppSidebarHeader } from "@/components/dashboard/app-sidebar-header";
import { NavUser } from "@/components/dashboard/nav-user";
import { RoleNav } from "@/components/dashboard/role-nav";
import { SharedNav } from "@/components/dashboard/shared-nav";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="p-1 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:[&_[data-sidebar=menu-item]]:flex group-data-[collapsible=icon]:[&_[data-sidebar=menu-item]]:justify-center"
      {...props}
    >
      <AppSidebarHeader />
      <SidebarContent>
        <SharedNav />
        <RoleNav />
      </SidebarContent>
      <SidebarFooter className="p-1 group-data-[collapsible=icon]:px-0">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
