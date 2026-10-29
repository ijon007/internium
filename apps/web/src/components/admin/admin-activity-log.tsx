"use client";

import { Badge } from "@internium/ui/components/badge";
import { Input } from "@internium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@internium/ui/components/select";
import { useMemo, useState } from "react";
import {
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  formatDate,
} from "@/components/admin/admin-table";
import {
  ADMIN_ACTIVITY,
  ADMIN_ACTIVITY_LABELS,
  type AdminActivityAction,
} from "@/constants/admin-dashboard";
import { cn } from "@/lib/utils";

const USER_ITEMS = [
  { value: "all", label: "All users" },
  ...Array.from(new Set(ADMIN_ACTIVITY.map((item) => item.actor))).map(
    (actor) => ({ value: actor, label: actor }),
  ),
];

const ACTION_ITEMS = [
  { value: "all", label: "All actions" },
  ...(Object.keys(ADMIN_ACTIVITY_LABELS) as AdminActivityAction[]).map(
    (action) => ({ value: action, label: ADMIN_ACTIVITY_LABELS[action] }),
  ),
];

export function AdminActivityLog() {
  const [actor, setActor] = useState("all");
  const [action, setAction] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const visible = useMemo(
    () =>
      ADMIN_ACTIVITY.filter((item) => {
        const day = item.at.slice(0, 10);
        return (
          (actor === "all" || item.actor === actor) &&
          (action === "all" || item.action === action) &&
          (!from || day >= from) &&
          (!to || day <= to)
        );
      }),
    [actor, action, from, to],
  );

  return (
    <AdminPage
      title="Activity Log"
      description="Every admin action, newest first."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={USER_ITEMS}
          value={actor}
          onValueChange={(value) => setActor((value as string) ?? "all")}
        >
          <SelectTrigger className="w-36" aria-label="Filter by user">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USER_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={ACTION_ITEMS}
          value={action}
          onValueChange={(value) => setAction((value as string) ?? "all")}
        >
          <SelectTrigger className="w-36" aria-label="Filter by action">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            aria-label="From date"
            className="w-34"
          />
          <span>to</span>
          <Input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            aria-label="To date"
            className="w-34"
          />
        </div>
      </div>

      <AdminTable
        head={[
          { label: "Time" },
          { label: "User" },
          { label: "Action" },
          { label: "Target" },
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>No activity matches these filters.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((item) => (
          <tr key={item.id}>
            <td className={cn(CELL, "text-muted-foreground tabular-nums")}>
              {formatDate(item.at, true)}
            </td>
            <td className={cn(CELL, "font-medium")}>{item.actor}</td>
            <td className={CELL}>
              <Badge variant="secondary">
                {ADMIN_ACTIVITY_LABELS[item.action]}
              </Badge>
            </td>
            <td className={CELL}>{item.target}</td>
          </tr>
        ))}
      </AdminTable>
    </AdminPage>
  );
}
