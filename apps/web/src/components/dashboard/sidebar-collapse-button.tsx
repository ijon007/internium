"use client";

import {
  SidebarMenuButton,
  useSidebar,
} from "@internium/ui/components/sidebar";
import { SidebarIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT } from "@/constants/navigation";

type SidebarCollapseButtonProps = {
  className?: string;
};

export function SidebarCollapseButton({
  className,
}: SidebarCollapseButtonProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      tooltip="Toggle sidebar"
      className={className}
      onClick={toggleSidebar}
    >
      <SidebarIcon weight={ICON_WEIGHT} />
      <span className="sr-only">Toggle sidebar</span>
    </SidebarMenuButton>
  );
}
