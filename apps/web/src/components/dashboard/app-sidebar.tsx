"use client";

import { Sidebar } from "@internium/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { type ComponentProps, Suspense } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { PrimarySidebar } from "@/components/dashboard/primary-sidebar";
import { RoleSidebar } from "@/components/dashboard/role-sidebar";
import { CHAT_PATH } from "@/constants/chat";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const role = useCurrentRole();
  const isChat = pathname === getRoleHref(role, CHAT_PATH);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <PrimarySidebar />
      {isChat ? (
        <Suspense>
          <ChatSidebar />
        </Suspense>
      ) : (
        <RoleSidebar />
      )}
    </Sidebar>
  );
}
