import { SidebarInset, SidebarProvider } from "@internium/ui/components/sidebar";
import { TooltipProvider } from "@internium/ui/components/tooltip";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const SIDEBAR_STYLE = { "--sidebar-width": "18rem" } as CSSProperties;

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <TooltipProvider>
      <SidebarProvider style={SIDEBAR_STYLE}>
        <Suspense>
          <AppSidebar />
        </Suspense>
        <SidebarInset>
          <Suspense>
            <DashboardHeader />
          </Suspense>
          <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
