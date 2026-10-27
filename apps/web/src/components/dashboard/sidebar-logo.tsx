"use client";

import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import Link from "next/link";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

export function SidebarLogo() {
  const role = useCurrentRole();

  return (
    <SidebarMenuButton
      className="h-8 flex-1 overflow-visible px-2 py-0 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:overflow-visible group-data-[collapsible=icon]:p-0!"
      render={<Link href={getRoleHref(role, "")} />}
    >
      {/* ponytail: skip next/image — it was emitting 20×16 from the PNG aspect */}
      {/* biome-ignore lint/performance/noImgElement: CSS box must stay a 20px square */}
      <img
        src="/logo.png"
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 object-cover object-center"
      />
      <span className="truncate text-base group-data-[collapsible=icon]:hidden">
        Internium
      </span>
    </SidebarMenuButton>
  );
}
