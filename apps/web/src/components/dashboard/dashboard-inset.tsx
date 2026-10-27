"use client";

import { SidebarInset, useSidebar } from "@internium/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { SidebarCollapseButton } from "@/components/dashboard/sidebar-collapse-button";
import { cn } from "@/lib/utils";
import { isChatPath } from "@/utils/chat";

export function DashboardInset({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMobile, setOpen, state } = useSidebar();
  const isChat = isChatPath(pathname);
  const showInsetTrigger = !isChat && (isMobile || state === "collapsed");

  useEffect(() => {
    if (isChat) setOpen(false);
  }, [isChat, setOpen]);

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
