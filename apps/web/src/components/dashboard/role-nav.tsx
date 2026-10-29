"use client";

import { NavGroupSection } from "@/components/dashboard/nav-group-section";
import { ROLE_NAV } from "@/constants/navigation";
import { ROLE_ICONS } from "@/constants/role-icons";
import { ROLE_LABELS } from "@/constants/roles";
import { useCurrentRole } from "@/hooks/use-current-role";

export function RoleNav() {
  const role = useCurrentRole();
  const RoleIcon = ROLE_ICONS[role];

  return ROLE_NAV[role].map((group, index) => (
    <NavGroupSection
      key={group.label}
      label={index === 0 ? ROLE_LABELS[role] : group.label}
      icon={index === 0 ? RoleIcon : undefined}
      items={group.items}
    />
  ));
}
