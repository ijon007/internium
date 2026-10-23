"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@internium/ui/components/sidebar";
import { NavGroupSection } from "@/components/dashboard/nav-group-section";
import { ROLE_NAV } from "@/constants/navigation";
import { ROLE_LABELS } from "@/constants/roles";
import { useCurrentRole } from "@/hooks/use-current-role";

export function RoleSidebar() {
  const role = useCurrentRole();

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="h-12 justify-center border-b px-4">
        <span className="font-medium text-foreground text-sm">{ROLE_LABELS[role]}</span>
      </SidebarHeader>
      <SidebarContent>
        {ROLE_NAV[role].map((group) => (
          <NavGroupSection key={group.label} role={role} group={group} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
