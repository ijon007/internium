import { SidebarProvider } from "@internium/ui/components/sidebar";
import { TooltipProvider } from "@internium/ui/components/tooltip";
import { Suspense } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardInset } from "@/components/dashboard/dashboard-inset";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Suspense>
          <AppSidebar />
        </Suspense>
        <DashboardInset>{children}</DashboardInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
