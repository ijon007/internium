"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { BuildingsIcon, ChatCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PRESS, SURFACE } from "@/components/admin/admin-table";
import { ME, MY_COMPANY, MY_PEOPLE } from "@/constants/student";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

/** One rounded inset group; rows are separated by hairlines, not cards. */
const GROUP = cn(SURFACE, "flex flex-col divide-y divide-border/60 overflow-hidden rounded-xl ring-1");
const LINK = "transition-colors duration-150 ease-out [@media(hover:hover)]:hover:text-foreground";

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
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="px-3 text-[11px] font-medium text-muted-foreground">{title}</h2>
      <div className={GROUP}>{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-9 items-center gap-4 px-3 py-2 text-xs">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate text-right">{children}</span>
    </div>
  );
}

const tel = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export function StudentMyData() {
  const chatHref = getRoleHref("student", "chat");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 py-2">
      <header className="flex flex-col items-center gap-2 pt-2 text-center">
        <Avatar name={ME.name} className="size-16 text-xl tracking-tight" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg leading-tight font-semibold tracking-tight">{ME.name}</h1>
          <p className="text-xs text-muted-foreground">{ME.email}</p>
          <p className="text-xs text-muted-foreground">
            Class {ME.className} · {ME.schoolYear}
          </p>
        </div>
      </header>

      <Group title="Personal">
        <Row label="Name">{ME.name}</Row>
        <Row label="Email">
          <a href={`mailto:${ME.email}`} className={LINK}>
            {ME.email}
          </a>
        </Row>
        <Row label="Class">{ME.className}</Row>
        <Row label="School year">
          <span className="tabular-nums">{ME.schoolYear}</span>
        </Row>
      </Group>

      <Group title="My people">
        {MY_PEOPLE.map((p) => (
          <div key={p.role} className="flex items-center gap-3 px-3 py-2.5 text-xs">
            <Avatar name={p.name} className="size-8 text-[11px]" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground"> · {p.role}</span>
              </span>
              <span className="flex min-w-0 gap-1.5 truncate text-muted-foreground">
                <a href={`mailto:${p.email}`} className={cn(LINK, "truncate")}>
                  {p.email}
                </a>
                <span aria-hidden>·</span>
                <a href={tel(p.phone)} className={cn(LINK, "shrink-0 tabular-nums")}>
                  {p.phone}
                </a>
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className={PRESS}
              nativeButton={false}
              render={<Link href={chatHref} />}
            >
              <ChatCircleIcon weight={ICON_WEIGHT} className="text-muted-foreground" />
              Message
            </Button>
          </div>
        ))}
      </Group>

      <Group title="Company">
        {MY_COMPANY ? (
          <>
            <Row label="Name">
              <span className="font-medium">{MY_COMPANY.name}</span>
            </Row>
            <Row label="Address">{MY_COMPANY.address}</Row>
            <Row label="Contact">{MY_COMPANY.contact}</Row>
            <Row label="Email">
              <a href={`mailto:${MY_COMPANY.email}`} className={LINK}>
                {MY_COMPANY.email}
              </a>
            </Row>
            <Row label="Phone">
              <a href={tel(MY_COMPANY.phone)} className={cn(LINK, "tabular-nums")}>
                {MY_COMPANY.phone}
              </a>
            </Row>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-3 py-6 text-center text-xs text-muted-foreground">
            <BuildingsIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground/70" />
            Your coordinator hasn't assigned your company yet.
          </div>
        )}
      </Group>
    </div>
  );
}
