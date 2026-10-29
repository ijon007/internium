"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@internium/ui/components/card";
import {
  BuildingsIcon,
  ChatCircleIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPage, PRESS, SURFACE } from "@/components/admin/admin-table";
import { ME, MY_COMPANY, MY_PEOPLE } from "@/constants/student";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card size="sm" className={cn(SURFACE, "gap-2")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Fields({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
      {items.map(([label, value]) => (
        <div key={label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-[11px] text-muted-foreground">{label}</dt>
          <dd className="truncate font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StudentMyData() {
  const chatHref = getRoleHref("student", "chat");

  return (
    <AdminPage title="My Data" description="Your details, people, and company. Read-only.">
      <Section title="Personal info">
        <Fields
          items={[
            ["Name", ME.name],
            ["Email", ME.email],
            ["Class", ME.className],
            ["School year", ME.schoolYear],
          ]}
        />
      </Section>

      <Section title="My people">
        <ul className="-mx-2 flex flex-col">
          {MY_PEOPLE.map((p) => (
            <li
              key={p.role}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-xs transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-semibold">
                {initials(p.name)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium">
                  {p.name}
                  <span className="ml-1.5 font-normal text-muted-foreground">{p.role}</span>
                </span>
                <span className="flex min-w-0 items-center gap-3 text-muted-foreground">
                  <a href={`mailto:${p.email}`} className="flex min-w-0 items-center gap-1 hover:text-foreground">
                    <EnvelopeSimpleIcon weight={ICON_WEIGHT} className="size-3 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </a>
                  <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="hidden items-center gap-1 hover:text-foreground sm:flex">
                    <PhoneIcon weight={ICON_WEIGHT} className="size-3" />
                    {p.phone}
                  </a>
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                className={PRESS}
                nativeButton={false}
                render={<Link href={chatHref} />}
              >
                <ChatCircleIcon weight={ICON_WEIGHT} />
                Message
              </Button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="My company">
        {MY_COMPANY ? (
          <Fields
            items={[
              ["Name", MY_COMPANY.name],
              ["Address", MY_COMPANY.address],
              ["Contact", MY_COMPANY.contact],
              [
                "Email · Phone",
                <span key="c" className="text-foreground">
                  {MY_COMPANY.email} · {MY_COMPANY.phone}
                </span>,
              ],
            ]}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted">
              <BuildingsIcon weight={ICON_WEIGHT} className="size-4" />
            </span>
            Your coordinator hasn't assigned your company yet.
          </div>
        )}
      </Section>
    </AdminPage>
  );
}
