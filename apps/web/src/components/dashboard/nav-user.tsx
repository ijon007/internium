"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@internium/ui/components/sidebar";
import { CaretUpIcon, SignOutIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ACCOUNT_NAV, ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_LABELS } from "@/constants/roles";
import { MOCK_USER } from "@/constants/user";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getRoleHref } from "@/utils/navigation";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function UserAvatar() {
  return (
    <Avatar>
      <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
      <AvatarFallback>{getInitials(MOCK_USER.name)}</AvatarFallback>
    </Avatar>
  );
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const role = useCurrentRole();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <UserAvatar />
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{MOCK_USER.name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <CaretUpIcon
              weight={ICON_WEIGHT}
              className="ml-auto size-4 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {MOCK_USER.name}
                    </span>
                    <span className="truncate text-xs">{MOCK_USER.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {ACCOUNT_NAV.map(({ title, path, icon: Icon }) => (
                <DropdownMenuItem
                  key={title}
                  render={<Link href={getRoleHref(role, path)} />}
                >
                  <Icon weight={ICON_WEIGHT} />
                  {title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutIcon weight={ICON_WEIGHT} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
