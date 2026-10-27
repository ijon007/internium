"use client";

import { SidebarInset, useSidebar } from "@internium/ui/components/sidebar";
import type { ReactNode } from "react";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { cn } from "@/lib/utils";

export function DashboardInset({
  children,
  isChat,
}: {
  children: ReactNode;
  isChat: boolean;
}) {
  const { isMobile, state } = useSidebar();
  const showInsetTrigger = !isChat && (isMobile || state === "collapsed");

  return (
    <SidebarInset className="md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
      {showInsetTrigger ? (
        <div className="absolute top-1 left-1 z-10">
          <SidebarCollapseButton />
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          isChat ? "overflow-hidden" : showInsetTrigger ? "p-2 pl-8" : "p-4",
        )}
      >
        {children}
      </div>
    </SidebarInset>
  );
}
