import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@internium/ui/components/card";
import type { ReactNode } from "react";

export function SettingsPane({
  description,
  children,
}: {
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-xl flex-col gap-8">
      <p className="text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
      {footer ? (
        <CardFooter className="justify-end border-t">{footer}</CardFooter>
      ) : null}
    </Card>
  );
}
