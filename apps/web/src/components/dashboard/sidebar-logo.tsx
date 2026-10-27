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
      size="lg"
      tooltip="Internium"
      className="flex-1 group-data-[collapsible=icon]:size-8!"
      render={<Link href={getRoleHref(role, "")} />}
    >
      <Image src="/logo.png" alt="" width={20} height={20} className="size-5" />
      <span className="truncate font-semibold text-base">Internium</span>
    </SidebarMenuButton>
  );
}
