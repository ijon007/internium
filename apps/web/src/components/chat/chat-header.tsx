"use client";

import { Button } from "@internium/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@internium/ui/components/input-group";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/chat";

type ChatHeaderProps = {
  conversation: Conversation;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export function ChatHeader({
  conversation,
  searchQuery,
  onSearchQueryChange,
}: ChatHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { name, avatar, presence, lastSeenAt } = conversation;

  const presenceLabel =
    presence === "online"
      ? "Online"
      : presence === "away"
        ? "Away"
        : `Last seen ${lastSeenAt}`;

  return (
    <div className="flex h-11 shrink-0 items-center gap-2.5 border-b px-3">
      {searchOpen ? (
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <InputGroup className="min-w-0 flex-1 border-border bg-background">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              autoFocus
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search in conversation…"
            />
          </InputGroup>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Close search"
            onClick={() => {
              setSearchOpen(false);
              onSearchQueryChange("");
            }}
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <>
          <div className="relative shrink-0">
            <ChatAvatar name={name} src={avatar} size="sm" />
            <span
              className={cn(
                "absolute right-0 bottom-0 size-2 rounded-full ring-2 ring-background",
                presence === "online" && "bg-emerald-500",
                presence === "away" && "bg-amber-400",
                presence === "offline" && "bg-muted-foreground/50",
              )}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm leading-tight">
              {name}
            </p>
            <p className="truncate text-muted-foreground text-[0.65rem] leading-tight">
              {presenceLabel}
            </p>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Search in conversation"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon />
          </Button>
        </>
      )}
    </div>
  );
}
