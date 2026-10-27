"use client";

import { Button } from "@internium/ui/components/button";
import { XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ReplyQuoteProps = {
  author: string;
  body: string;
  onClick?: () => void;
  onDismiss?: () => void;
  className?: string;
};

export function ReplyQuote({
  author,
  body,
  onClick,
  onDismiss,
  className,
}: ReplyQuoteProps) {
  const inner: ReactNode = (
    <>
      <span className="w-0.5 shrink-0 self-stretch rounded-full bg-primary/80" />
      <span className="min-w-0 flex-1 py-px">
        <span className="block truncate font-medium text-foreground/80 text-xs leading-tight">
          {author}
        </span>
        <span className="block truncate text-muted-foreground text-xs leading-tight">
          {body}
        </span>
      </span>
    </>
  );

  return (
    <div
      className={cn(
        "mb-1 flex min-w-0 max-w-md items-stretch gap-2",
        className,
      )}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-1 items-stretch gap-2 text-left transition-opacity duration-150 ease-out-strong hover:opacity-80"
        >
          {inner}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-stretch gap-2">{inner}</div>
      )}
      {onDismiss ? (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Cancel reply"
          className="size-6 shrink-0 self-center"
          onClick={onDismiss}
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}
