"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@internium/ui/components/sidebar";
import { type ComponentProps } from "react";
import { NavUser } from "@/components/dashboard/nav-user";
import { RoleNav } from "@/components/dashboard/role-nav";
import { SharedNav } from "@/components/dashboard/shared-nav";
import { SidebarLogo } from "@/components/dashboard/sidebar-logo";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SharedNav />
        <RoleNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
