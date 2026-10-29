"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  BuildingsIcon,
  ChatCircleIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AdminPage, PRESS, SURFACE } from "@/components/admin/admin-table";
import { ME, MY_COMPANY, MY_PEOPLE } from "@/constants/student";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const CARD = cn(SURFACE, "rounded-xl ring-1");

/** A few calm hues; each person keeps the same one everywhere. */
const HUES = [
  "oklch(0.55 0.17 265)",
  "oklch(0.55 0.12 185)",
  "oklch(0.6 0.15 55)",
  "oklch(0.55 0.18 320)",
];

function hueFor(name: string): CSSProperties {
  const sum = [...name].reduce((n, c) => n + c.charCodeAt(0), 0);
  return { "--status-color": HUES[sum % HUES.length] } as CSSProperties;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      style={hueFor(name)}
      className={cn(
        "status-tint flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return <h2 className="px-1 text-[11px] font-medium text-muted-foreground">{children}</h2>;
}

function ContactLine({
  icon: Icon,
  href,
  children,
}: {
  icon: typeof EnvelopeSimpleIcon;
  href?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <Icon weight={ICON_WEIGHT} className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{children}</span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex min-w-0 items-center gap-2 rounded-md transition-colors duration-150 ease-out [@media(hover:hover)]:hover:text-foreground"
    >
      {body}
    </a>
  ) : (
    <span className="flex min-w-0 items-center gap-2">{body}</span>
  );
}

const tel = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export function StudentMyData() {
  const chatHref = getRoleHref("student", "chat");

  return (
    <AdminPage title="My Data" description="Your details, people, and company. Read-only.">
      <section className={cn(CARD, "flex items-center gap-4 p-4")}>
        <Avatar name={ME.name} className="size-14 text-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-base font-semibold tracking-tight">{ME.name}</p>
          <p className="truncate text-xs text-muted-foreground">{ME.email}</p>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full bg-muted px-2 py-0.5">
              <span className="text-muted-foreground">Class</span> <span className="font-medium">{ME.className}</span>
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5">
              <span className="text-muted-foreground">School year</span>{" "}
              <span className="font-medium tabular-nums">{ME.schoolYear}</span>
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <GroupLabel>My people</GroupLabel>
        <ul className="grid gap-2 sm:grid-cols-2">
          {MY_PEOPLE.map((p) => (
            <li key={p.role} className={cn(CARD, "flex flex-col gap-3 p-3 text-xs")}>
              <div className="flex items-center gap-3">
                <Avatar name={p.name} className="size-10 text-[13px]" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium tracking-tight">{p.name}</span>
                  <span className="truncate text-muted-foreground">{p.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <ContactLine icon={EnvelopeSimpleIcon} href={`mailto:${p.email}`}>
                  {p.email}
                </ContactLine>
                <ContactLine icon={PhoneIcon} href={tel(p.phone)}>
                  {p.phone}
                </ContactLine>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className={cn(PRESS, "w-full")}
                nativeButton={false}
                render={<Link href={chatHref} />}
              >
                <ChatCircleIcon weight={ICON_WEIGHT} />
                Message
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <GroupLabel>My company</GroupLabel>
        {MY_COMPANY ? (
          <section className={cn(CARD, "flex flex-col gap-3 p-3 text-xs sm:flex-row sm:items-center sm:gap-4")}>
            <div className="flex min-w-0 items-center gap-3 sm:flex-1">
              <span
                style={hueFor(MY_COMPANY.name)}
                className="status-tint flex size-10 shrink-0 items-center justify-center rounded-[11px]"
              >
                <BuildingsIcon weight={ICON_WEIGHT} className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-medium tracking-tight">{MY_COMPANY.name}</span>
                <span className="text-muted-foreground">
                  <ContactLine icon={MapPinIcon}>{MY_COMPANY.address}</ContactLine>
                </span>
              </div>
            </div>
            <div className="grid min-w-0 gap-1.5 text-muted-foreground sm:w-60">
              <ContactLine icon={UserIcon}>{MY_COMPANY.contact}</ContactLine>
              <ContactLine icon={EnvelopeSimpleIcon} href={`mailto:${MY_COMPANY.email}`}>
                {MY_COMPANY.email}
              </ContactLine>
              <ContactLine icon={PhoneIcon} href={tel(MY_COMPANY.phone)}>
                {MY_COMPANY.phone}
              </ContactLine>
            </div>
          </section>
        ) : (
          <div className={cn(CARD, "flex flex-col items-center gap-2 py-8 text-center text-xs text-muted-foreground")}>
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <BuildingsIcon weight={ICON_WEIGHT} className="size-4" />
            </span>
            Your coordinator hasn't assigned your company yet.
          </div>
        )}
      </div>
    </AdminPage>
  );
}
