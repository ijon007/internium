"use client";

import { ICON_WEIGHT } from "@/constants/navigation";

import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import { Calendar } from "@internium/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@internium/ui/components/popover";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  AdminDropdown,
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  formatDate,
  PRESS,
} from "@/components/admin/admin-table";
import {
  ADMIN_ACTIVITY,
  ADMIN_ACTIVITY_LABELS,
  type AdminActivityAction,
} from "@/constants/admin-dashboard";
import { cn } from "@/lib/utils";

function toDay(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return "Any date";
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  if (!range.to || toDay(range.to) === toDay(range.from)) return fmt.format(range.from);
  return `${fmt.format(range.from)} – ${fmt.format(range.to)}`;
}

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
  const [range, setRange] = useState<DateRange | undefined>();
  const from = range?.from ? toDay(range.from) : "";
  const to = range?.to ? toDay(range.to) : from;

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
        <AdminDropdown
          label="Filter by user"
          items={USER_ITEMS}
          value={actor}
          onChange={setActor}
          className="w-36"
        />
        <AdminDropdown
          label="Filter by action"
          items={ACTION_ITEMS}
          value={action}
          onChange={setAction}
          className="w-36"
        />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "gap-1.5 font-normal",
                  PRESS,
                  !range?.from && "text-muted-foreground",
                )}
              />
            }
          >
            <CalendarBlankIcon weight={ICON_WEIGHT} />
            {formatRange(range)}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from ?? new Date(ADMIN_ACTIVITY[0]?.at ?? Date.now())}
            />
          </PopoverContent>
        </Popover>
        {range?.from ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={PRESS}
            onClick={() => setRange(undefined)}
          >
            Clear
          </Button>
        ) : null}
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
