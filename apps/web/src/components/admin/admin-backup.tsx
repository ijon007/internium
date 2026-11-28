"use client";

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
  CircleNotchIcon,
  DatabaseIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  AdminPage,
  AdminTable,
  CELL,
  formatDate,
  PRESS,
  SURFACE,
} from "@/components/admin/admin-table";
import type { AdminBackupStatus } from "@/constants/admin-users";
import { ICON_WEIGHT } from "@/constants/navigation";
import { useAdminBackups } from "@/hooks/use-admin-backups";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<AdminBackupStatus, string> = {
  complete: "Complete",
  failed: "Failed",
  running: "Running",
};

function StatusBadge({ status }: { status: AdminBackupStatus }) {
  return (
    <Badge variant={status === "failed" ? "destructive" : "secondary"}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function AdminBackup() {
  const { backups, running, canStart, runBackup } = useAdminBackups();
  const last = backups.find((backup) => backup.status !== "running");
  return (
    <AdminPage
      title="Backup"
      description="Snapshots of Internium data in Convex."
    >
      <Card size="sm" className={SURFACE}>
        <CardHeader>
          <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
            Last backup
          </CardTitle>
          <CardDescription className="sr-only">
            The most recent finished snapshot.
          </CardDescription>
          <CardAction>
            <Button className={PRESS} onClick={runBackup} disabled={!canStart}>
              {running ? (
                <CircleNotchIcon
                  weight={ICON_WEIGHT}
                  className="animate-spin"
                />
              ) : (
                <DatabaseIcon weight={ICON_WEIGHT} />
              )}
              {running ? "Backing up…" : "Run backup now"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-heading text-lg leading-tight font-semibold tracking-[-0.02em]">
            {last ? formatDate(last.at, true) : "Never"}
          </p>
          {last ? (
            <>
              <span className="text-xs text-muted-foreground tabular-nums">
                {last.size}
              </span>
              <StatusBadge status={last.status} />
            </>
          ) : null}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium tracking-tight">History</h2>
        <AdminTable
          head={[
            { label: "Date" },
            { label: "Size" },
            { label: "Status" },
            { label: "", className: "w-10" },
          ]}
        >
          {backups.map((backup) => (
            <tr key={backup.id} className="transition-colors hover:bg-muted/40">
              <td className={cn(CELL, "font-medium tabular-nums")}>
                {formatDate(backup.at, true)}
              </td>
              <td className={cn(CELL, "text-muted-foreground tabular-nums")}>
                {backup.size}
              </td>
              <td className={CELL}>
                <StatusBadge status={backup.status} />
              </td>
              <td className={cn(CELL, "px-1 text-right")}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Download backup"
                  disabled={backup.status !== "complete"}
                  className={PRESS}
                  nativeButton={backup.status !== "complete"}
                  render={
                    backup.status === "complete" ? (
                      <Link
                        href={`/api/admin/backups/${backup.id}`}
                        prefetch={false}
                        download
                        aria-label="Download backup"
                      />
                    ) : undefined
                  }
                >
                  <DownloadSimpleIcon weight={ICON_WEIGHT} />
                </Button>
              </td>
            </tr>
          ))}
        </AdminTable>
        <p className="text-[11px] text-muted-foreground">
          Restore and automatic daily backups are coming later.
        </p>
      </section>
    </AdminPage>
  );
}
