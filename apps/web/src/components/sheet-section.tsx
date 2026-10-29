import { cn } from "@internium/ui/lib/utils";
import type { ReactNode } from "react";

/** Scrollable sheet body with consistent padding and soft scroll-edge fades. */
export function SheetBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-1 pb-5 text-xs",
        "[mask-image:linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-12px),transparent)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A labelled group inside a sheet: grouping by proximity, no boxes. */
export function SheetSection({
  title,
  count,
  action,
  className,
  children,
}: {
  title: string;
  count?: number;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <div className="flex h-6 items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-xs">
          {title}
          {count !== undefined ? (
            <span className="ml-1.5 tabular-nums text-muted-foreground/70">{count}</span>
          ) : null}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Tidy list rows: hairline-free, hover tint only on hover-capable devices. */
export const SHEET_LIST = "-mx-2 flex flex-col";
export const SHEET_ROW =
  "flex min-h-8 items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/50";

/** Compact stat summary row. */
export function SheetStats({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="flex gap-6">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-semibold text-base tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
