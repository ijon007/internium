"use client";

import { dateFormat } from "@/lib/date-format";
import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@internium/ui/components/card";
import {
  DatabaseIcon,
  HardDrivesIcon,
  UsersIcon,
  UserCircleCheckIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/dashboard/page-heading";
import {
  ADMIN_ACTIVITY,
  ADMIN_ACTIVITY_LABELS,
  ADMIN_BACKUP,
  ADMIN_STATS,
  type AdminActivity,
} from "@/constants/admin-dashboard";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const PRESS =
  "origin-center transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

const SURFACE =
  "bg-card/70 ring-foreground/8 backdrop-blur-xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-card [@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none";

function formatWhen(iso: string) {
  return dateFormat({
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatCompact(iso: string) {
  return dateFormat({
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

function formatRelative(iso: string, now: number) {
  const deltaMs = now - new Date(iso).getTime();
  const minutes = Math.max(0, Math.round(deltaMs / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function AdminDashboard() {
  const [backup, setBackup] = useState(ADMIN_BACKUP);
  const [activity, setActivity] = useState(ADMIN_ACTIVITY);
  const [now, setNow] = useState<number | null>(null);
  const peakRoleCount = Math.max(...Object.values(ADMIN_STATS.usersByRole));

  useEffect(() => {
    setNow(Date.now());
  }, []);

  function runBackup() {
    const at = new Date().toISOString();
    setBackup({ at, size: backup.size, status: "Complete" });
    setActivity((current) => [
      {
        id: `act-${at}`,
        at,
        actor: "Jane Doe",
        action: "ran-backup",
        target: "Manual snapshot",
      },
      ...current,
    ]);
    toast.success("Backup complete");
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-5 pt-4 pb-8">
      <header className="flex flex-col gap-1">
        <PageHeading>Dashboard</PageHeading>
        <p className="text-sm text-muted-foreground">
          Users, access, and school operations.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={ADMIN_STATS.totalUsers}
          hint="Everyone with an Internium account"
          icon={UsersIcon}
        />
        <StatCard
          label="Active users"
          value={ADMIN_STATS.activeUsers}
          hint={`${ADMIN_STATS.totalUsers - ADMIN_STATS.activeUsers} deactivated, still listed`}
          icon={UserCircleCheckIcon}
        />
        <StatCard
          label="Last backup"
          value={formatWhen(backup.at)}
          hint={`${backup.size} · ${backup.status}`}
          icon={HardDrivesIcon}
          numeric={false}
        />
        <Card size="sm" className={cn(SURFACE, "justify-between")}>
          <CardHeader>
            <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
              Users per role
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ROLES.map((role) => {
              const count = ADMIN_STATS.usersByRole[role];
              return (
                <div key={role} className="flex items-center gap-2">
                  <span className="w-[5.5rem] shrink-0 text-[11px] leading-none text-muted-foreground">
                    {ROLE_LABELS[role]}
                  </span>
                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary motion-reduce:transition-none"
                      style={{
                        width: `${(count / peakRoleCount) * 100}%`,
                        transition: "width 400ms var(--ease-out-strong)",
                      }}
                    />
                  </div>
                  <span className="w-7 text-right text-[11px] leading-none font-medium tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
        <Card size="sm" className={cn(SURFACE, "gap-0 py-0")}>
          <CardHeader className="border-b py-3">
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>The last actions across the school.</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                className={PRESS}
                nativeButton={false}
                render={<Link href={getRoleHref("admin", "activity-log")} />}
              >
                View log
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <ul>
              {activity.slice(0, 8).map((item, index) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  now={now}
                  last={index === Math.min(activity.length, 8) - 1}
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card size="sm" className={SURFACE}>
          <CardHeader>
            <CardTitle>Backup</CardTitle>
            <CardDescription>
              Take a snapshot of users, documents, and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-lg bg-muted/60 px-3 py-2.5">
              <p className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
                Last snapshot
              </p>
              <p className="mt-1 text-sm font-medium tracking-tight">
                {formatWhen(backup.at)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {backup.size} · {backup.status}
              </p>
            </div>
            <Button className={cn("w-full", PRESS)} onClick={runBackup}>
              <DatabaseIcon weight={ICON_WEIGHT} />
              Run backup
            </Button>
            <Button
              variant="ghost"
              className={cn("w-full", PRESS)}
              nativeButton={false}
              render={<Link href={getRoleHref("admin", "backup")} />}
            >
              Open backup history
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  numeric = true,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof UsersIcon;
  numeric?: boolean;
}) {
  return (
    <Card size="sm" className={cn(SURFACE, "justify-between")}>
      <CardHeader>
        <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
          {label}
        </CardTitle>
        <CardAction>
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/12 text-foreground">
            <Icon weight={ICON_WEIGHT} className="size-3.5" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "font-heading font-semibold tracking-[-0.02em]",
            numeric ? "text-[1.75rem] leading-none tabular-nums" : "text-lg leading-tight",
          )}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
          {hint}
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityRow({
  item,
  last,
  now,
}: {
  item: AdminActivity;
  last: boolean;
  now: number | null;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-2.5",
        last ? undefined : "border-b border-border/70",
      )}
    >
      <time
        dateTime={item.at}
        title={formatWhen(item.at)}
        className="w-[4.25rem] shrink-0 text-[11px] leading-none text-muted-foreground tabular-nums"
        suppressHydrationWarning
      >
        {now === null ? formatCompact(item.at) : formatRelative(item.at, now)}
      </time>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{item.target}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {item.actor}
        </p>
      </div>
      <Badge variant="secondary">{ADMIN_ACTIVITY_LABELS[item.action]}</Badge>
    </li>
  );
}
