"use client";

import { Separator } from "@internium/ui/components/separator";
import { SidebarTrigger } from "@internium/ui/components/sidebar";
import { ROLE_LABELS } from "@/constants/roles";
import { useCurrentRole } from "@/hooks/use-current-role";

export function DashboardHeader() {
  const role = useCurrentRole();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
      <span className="font-medium text-sm">{ROLE_LABELS[role]}</span>
    </header>
  );
}
