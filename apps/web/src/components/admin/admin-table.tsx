import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { PageHeading } from "@/components/dashboard/page-heading";
import { cn } from "@/lib/utils";

export const PRESS =
  "origin-center transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

export const SURFACE =
  "bg-card/70 ring-foreground/8 backdrop-blur-xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-card [@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none";

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-5 pt-4 pb-8">
      <header className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <PageHeading>{title}</PageHeading>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions}
      </header>
      {children}
    </div>
  );
}

export function AdminTable({
  head,
  children,
  empty,
}: {
  head: { label: ReactNode; className?: string }[];
  children: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <div
      className={cn(
        SURFACE,
        "overflow-hidden rounded-xl ring-1 text-xs",
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70">
              {head.map((cell, index) => (
                <th
                  // biome-ignore lint/suspicious/noArrayIndexKey: static header
                  key={index}
                  scope="col"
                  className={cn(
                    "h-8 px-3 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap text-muted-foreground",
                    cell.className,
                  )}
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr:not(:last-child)]:border-b [&>tr]:border-border/70">
            {children}
          </tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}

export function AdminTableEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 py-8 text-center text-xs text-muted-foreground">
      {children}
    </p>
  );
}

export const CELL = "h-10 px-3 whitespace-nowrap";

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}

export const ADMIN_ICON_WEIGHT = "bold";

export function AdminDropdown<T extends string>({
  label,
  value,
  items,
  onChange,
  className,
}: {
  label: string;
  value: T;
  items: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const current = items.find((item) => item.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-label={label}
            className={cn("justify-between gap-1.5 font-normal", PRESS, className)}
          />
        }
      >
        <span className="truncate">{current?.label ?? label}</span>
        <CaretDownIcon
          weight={ICON_WEIGHT}
          className="size-3 text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as T)}
        >
          {items.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
