import { SidebarProvider } from "@internium/ui/components/sidebar";
import { TooltipProvider } from "@internium/ui/components/tooltip";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardInset } from "@/components/dashboard/dashboard-inset";

const SIDEBAR_STYLE = {
  "--sidebar-width-icon": "2.5rem",
} as CSSProperties;

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <TooltipProvider>
      <SidebarProvider style={SIDEBAR_STYLE}>
        <Suspense>
          <AppSidebar />
        </Suspense>
        <DashboardInset>{children}</DashboardInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
