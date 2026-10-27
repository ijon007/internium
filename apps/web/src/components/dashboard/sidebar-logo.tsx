"use client";

import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

export function SidebarLogo() {
  const role = useCurrentRole();

  return (
    <SidebarMenuButton
      tooltip="Internium"
      className="h-8 flex-1 px-2 py-0 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
      render={<Link href={getRoleHref(role, "")} />}
    >
      <Image src="/logo.png" alt="" width={20} height={20} className="size-5" />
      <span className="truncate text-base group-data-[collapsible=icon]:hidden">
        Internium
      </span>
    </SidebarMenuButton>
  );
}
