"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@internium/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICON_WEIGHT } from "@/constants/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";
import type { NavItem } from "@/types/navigation";
import { getRoleHref, isActivePath } from "@/utils/navigation";

type IconNavMenuProps = {
  items: NavItem[];
};

export function IconNavMenu({ items }: IconNavMenuProps) {
  const pathname = usePathname();
  const role = useCurrentRole();

  return (
    <SidebarMenu>
      {items.map(({ title, path, icon: Icon }) => {
        const href = getRoleHref(role, path);
        return (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton
              tooltip={{ children: title, hidden: false }}
              isActive={isActivePath(pathname, href)}
              className="px-2.5 md:px-2"
              render={<Link href={href} />}
            >
              <Icon weight={ICON_WEIGHT} />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
