"use client";

import {
  SidebarMenuButton,
  useSidebar,
} from "@internium/ui/components/sidebar";
import { SidebarIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT } from "@/constants/navigation";
import { cn } from "@/lib/utils";

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
      className={cn(
        "size-6! w-6! min-w-6 shrink-0 p-0 [&_svg]:size-3",
        className,
      )}
      onClick={toggleSidebar}
    >
      <SidebarIcon weight={ICON_WEIGHT} />
      <span className="sr-only">Toggle sidebar</span>
    </SidebarMenuButton>
  );
}
