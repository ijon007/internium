"use client";

import { Sidebar } from "@internium/ui/components/sidebar";
import type { ComponentProps } from "react";
import { PrimarySidebar } from "@/components/dashboard/primary-sidebar";
import { RoleSidebar } from "@/components/dashboard/role-sidebar";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <PrimarySidebar />
      <RoleSidebar />
    </Sidebar>
  );
}
