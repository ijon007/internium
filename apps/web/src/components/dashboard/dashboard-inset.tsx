"use client";

import { SidebarInset, useSidebar } from "@internium/ui/components/sidebar";
import type { ReactNode } from "react";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { cn } from "@/lib/utils";

export function DashboardInset({ children }: { children: ReactNode }) {
  const { isMobile, state } = useSidebar();
  const showInsetTrigger = isMobile || state === "collapsed";

  return (
    <SidebarInset>
      {showInsetTrigger ? (
        <div className="flex h-8 shrink-0 items-center px-1">
          <SidebarCollapseButton />
        </div>
      ) : null}
      <div
        className={cn(
          "flex flex-1 flex-col",
          showInsetTrigger ? "px-2 pb-2" : "p-4",
        )}
      >
        {children}
      </div>
    </SidebarInset>
  );
}
