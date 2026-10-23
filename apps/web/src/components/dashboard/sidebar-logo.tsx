"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@internium/ui/components/sidebar";
import { GraduationCapIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { DASHBOARD_PATH } from "@/constants/roles";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="md:h-8 md:p-0" render={<Link href={DASHBOARD_PATH} />}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCapIcon weight={ICON_WEIGHT} className="size-4" />
          </div>
          <span className="truncate font-medium">Internium</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
