"use client";

import { useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { SidebarMenuButton } from "@internium/ui/components/sidebar";
import { UserSwitchIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function SwitchRoleButton({ className }: { className?: string }) {
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            tooltip="Account"
            aria-label="Account"
            className={cn(
              "size-6! w-6! min-w-6 shrink-0 justify-center gap-0 p-0 [&_svg]:size-4 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:p-2!",
              className,
            )}
          />
        }
      >
        <UserSwitchIcon weight={ICON_WEIGHT} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => void signOut({ redirectUrl: "/sign-in" })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
