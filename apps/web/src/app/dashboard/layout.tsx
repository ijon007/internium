import { TooltipProvider } from "@internium/ui/components/tooltip";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <TooltipProvider>
      <Suspense>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </TooltipProvider>
  );
}
