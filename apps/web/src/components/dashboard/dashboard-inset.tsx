"use client";

import { SidebarInset, useSidebar } from "@internium/ui/components/sidebar";
import type { ReactNode } from "react";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { cn } from "@/lib/utils";

export function DashboardInset({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarInset className="min-h-0 max-h-svh overflow-hidden md:max-h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
      {isMobile ? (
        <div className="absolute top-1 left-1 z-10">
          <SidebarCollapseButton />
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col has-[.chat-workspace]:overflow-hidden has-[.chat-workspace]:p-0",
          isMobile ? "p-2 pl-8" : "p-4",
        )}
      >
        {children}
      </div>
    </SidebarInset>
  );
}
