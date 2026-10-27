"use client";

import { Button } from "@internium/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@internium/ui/components/input-group";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { ICON_WEIGHT } from "@/constants/navigation";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { name, avatar, presence, lastSeenAt } = conversation;

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
  }, [searchOpen]);

  const presenceLabel =
    presence === "online"
      ? "Online"
      : presence === "away"
        ? "Away"
        : `Last seen ${lastSeenAt}`;

  const closeSearch = () => {
    setSearchOpen(false);
    onSearchQueryChange("");
  };

  return (
    <div className="flex h-11 shrink-0 items-center gap-2.5 border-b px-3">
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
        <p className="truncate font-semibold text-sm leading-tight">{name}</p>
        <p className="truncate text-muted-foreground text-[0.65rem] leading-tight">
          {presenceLabel}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-1">
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-columns,opacity] duration-200 ease-out-strong motion-reduce:transition-none",
            searchOpen
              ? "grid-cols-[minmax(0,13rem)] opacity-100"
              : "grid-cols-[0fr] opacity-0",
          )}
        >
          <div className="min-w-0 overflow-hidden">
            <InputGroup className="h-8 min-w-0 border-border bg-background">
              <InputGroupAddon>
                <MagnifyingGlassIcon />
              </InputGroupAddon>
              <InputGroupInput
                ref={inputRef}
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder="Search…"
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                }}
              />
            </InputGroup>
          </div>
        </div>
        {searchOpen ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Close search"
            className="size-7 [&_svg:not([class*='size-'])]:size-4"
            onClick={closeSearch}
          >
            <XIcon />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Search in conversation"
            className="size-7 [&_svg:not([class*='size-'])]:size-4"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon weight={ICON_WEIGHT} />
          </Button>
        )}
      </div>
    </div>
  );
}
