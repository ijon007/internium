import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type StatusKey = "missing" | "generated" | "uploaded" | "approved" | "returned";

export const STATUS_LABELS: Record<StatusKey, string> = {
  missing: "Missing",
  generated: "Generated",
  uploaded: "Uploaded",
  approved: "Approved",
  returned: "Returned",
};

/**
 * Colours live in --status-* tokens (globals.css) and are applied through an
 * inline var, so every pill renders the same no matter which Tailwind
 * utilities happen to be generated.
 */
export function statusVars(status: StatusKey): CSSProperties {
  return { "--status-color": `var(--status-${status})` } as CSSProperties;
}

export function StatusBadge({
  status,
  className,
}: {
  status: StatusKey;
  className?: string;
}) {
  return (
    <span
      data-status={status}
      style={statusVars(status)}
      className={cn(
        "status-pill inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full pr-2 pl-1.5 text-[10px] leading-none font-medium whitespace-nowrap",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
