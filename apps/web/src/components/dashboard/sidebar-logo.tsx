"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@internium/ui/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ROLE_PATH } from "@/constants/roles";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="md:h-8 md:p-0" render={<Link href={ROLE_PATH} />}>
          <Image src="/logo.png" alt="" width={32} height={32} className="size-8" />
          <span className="truncate font-medium">Internium</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
