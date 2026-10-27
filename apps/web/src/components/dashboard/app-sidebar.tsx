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
    <Sidebar variant="inset" collapsible="icon" className="p-1" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <SharedNav />
        <RoleNav />
      </SidebarContent>
      <SidebarFooter className="p-1">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
