"use client";

import { NavGroupSection } from "@/components/dashboard/nav-group-section";
import { ROLE_NAV } from "@/constants/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";

export function RoleNav() {
  const role = useCurrentRole();

  return ROLE_NAV[role].map((group) => <NavGroupSection key={group.label} role={role} group={group} />);
}
