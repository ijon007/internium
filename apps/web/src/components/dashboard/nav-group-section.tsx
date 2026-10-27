"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@internium/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICON_WEIGHT } from "@/constants/navigation";
import type { Role } from "@/constants/roles";
import type { NavGroup } from "@/types/navigation";
import { getRoleHref, isActivePath } from "@/utils/navigation";

type NavGroupSectionProps = {
  role: Role;
  group: NavGroup;
};

export function NavGroupSection({ role, group }: NavGroupSectionProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-1 py-0">
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map(({ title, path, icon: Icon }) => {
          const href = getRoleHref(role, path);
          return (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                tooltip={title}
                isActive={isActivePath(pathname, href)}
                render={<Link href={href} />}
              >
                <Icon weight={ICON_WEIGHT} />
                <span>{title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
