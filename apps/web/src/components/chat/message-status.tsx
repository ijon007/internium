"use client";

import { CheckIcon, ChecksIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { MessageStatus } from "@/types/chat";

type MessageStatusTicksProps = {
  status?: MessageStatus;
};

export function MessageStatusTicks({ status }: MessageStatusTicksProps) {
  if (!status) return null;

  if (status === "sent") {
    return (
      <CheckIcon className="size-3.5 text-muted-foreground" aria-label="Sent" />
    );
  }

  return (
    <ChecksIcon
      className={cn(
        "size-3.5",
        status === "read" ? "text-primary" : "text-muted-foreground",
      )}
      aria-label={status === "read" ? "Read" : "Delivered"}
    />
  );
}
