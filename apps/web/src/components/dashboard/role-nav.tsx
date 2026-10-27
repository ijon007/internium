"use client";

import { SidebarSeparator } from "@internium/ui/components/sidebar";
import { NavGroupSection } from "@/components/dashboard/nav-group-section";
import { ROLE_NAV } from "@/constants/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";

export function RoleNav() {
  const role = useCurrentRole();

  return (
    <>
      <SidebarSeparator />
      {ROLE_NAV[role].map((group) => (
        <NavGroupSection key={group.label} role={role} group={group} />
      ))}
    </>
  );
}
