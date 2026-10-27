"use client";

import { SidebarProvider } from "@internium/ui/components/sidebar";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardInset } from "@/components/dashboard/dashboard-inset";
import { isChatPath } from "@/utils/chat";

const SIDEBAR_STYLE = {
  "--sidebar-width-icon": "2.5rem",
} as CSSProperties;

export function DashboardShell({ children }: { children: ReactNode }) {
  const isChat = isChatPath(usePathname());
  const [open, setOpen] = useState(!isChat);

  useEffect(() => {
    if (isChat) setOpen(false);
  }, [isChat]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} style={SIDEBAR_STYLE}>
      <AppSidebar />
      <DashboardInset isChat={isChat}>{children}</DashboardInset>
    </SidebarProvider>
  );
}
