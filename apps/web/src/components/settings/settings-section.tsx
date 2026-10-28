import { Card, CardContent, CardFooter } from "@internium/ui/components/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SettingsPane({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col gap-5">{children}</div>;
}

export function SettingsSection({
  title,
  caption,
  children,
  footer,
  flush = false,
}: {
  title?: string;
  caption?: string;
  children?: ReactNode;
  footer?: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      {title ? (
        <h2 className="px-3 text-[11px] leading-none font-medium tracking-[0.01em] text-muted-foreground">
          {title}
        </h2>
      ) : null}
      <Card size="sm" className="gap-0 py-0">
        {children ? (
          <CardContent
            className={cn(flush ? "p-0" : "flex flex-col gap-2 px-3 py-2.5")}
          >
            {children}
          </CardContent>
        ) : null}
        {footer ? (
          <CardFooter className="justify-end border-t py-2">
            {footer}
          </CardFooter>
        ) : null}
      </Card>
      {caption ? (
        <p className="px-3 text-[11px] leading-snug text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </section>
  );
}

export function SettingsList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y">{children}</div>;
}

export function SettingsFieldRow({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-9 items-center gap-3 px-3">
      <label
        htmlFor={id}
        className="w-[4.75rem] shrink-0 text-xs leading-none font-medium"
      >
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
