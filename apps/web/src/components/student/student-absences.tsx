"use client";

import { useEffect, useState } from "react";
import { AdminPage, SURFACE } from "@/components/admin/admin-table";
import {
  INTERNSHIP_START,
  MY_ABSENCES,
  type StudentAbsence,
  WEEKS_ATTENDED,
  WEEKS_TOTAL,
} from "@/constants/student";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/** Local-midnight date from YYYY-MM-DD, so grid math never drifts across time zones. */
const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y as number, (m as number) - 1, d);
};
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Cell = { date: Date; key: string; state: "present" | "absent" | "upcoming"; absence?: StudentAbsence; today: boolean };

function buildWeeks(today: Date) {
  const start = parse(INTERNSHIP_START);
  const byDay = new Map(MY_ABSENCES.map((a) => [a.date, a]));
  const todayKey = iso(today);
  return Array.from({ length: WEEKS_TOTAL }, (_, w) =>
    WEEKDAYS.map((_, d): Cell => {
      const date = new Date(start.getTime() + (w * 7 + d) * DAY);
      const key = iso(date);
      const absence = byDay.get(key);
      const state = absence ? "absent" : date > today ? "upcoming" : "present";
      return { date, key, state, absence, today: key === todayKey };
    }),
  );
}

export function StudentAbsences() {
  // "Today" is only known on the client; the prerendered HTML uses the start date to avoid a hydration mismatch.
  const [today, setToday] = useState(() => parse(INTERNSHIP_START));
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
  }, []);
  const weeks = buildWeeks(today);
  const days = weeks.flat();
  const elapsed = days.filter((c) => c.state !== "upcoming").length;
  const absent = days.filter((c) => c.state === "absent").length;
  const rate = elapsed ? Math.round(((elapsed - absent) / elapsed) * 100) : 100;

  return (
    <AdminPage title="My Absences" description="Absences recorded by your teacher or business mentor.">
      <section className={cn(SURFACE, "flex flex-col gap-6 rounded-xl p-5 ring-1 sm:flex-row sm:items-center sm:gap-8")}>
        <div className="flex items-center gap-4">
          <Ring value={rate} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">Attendance</span>
            <span className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
              {rate}
              <span className="ml-0.5 text-sm font-normal text-muted-foreground">%</span>
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {elapsed - absent} of {elapsed} days so far
            </span>
          </div>
        </div>

        <dl className="grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-lg bg-border/60 ring-1 ring-border/60">
          <Stat label="Absences" value={String(MY_ABSENCES.length)} unit={MY_ABSENCES.length === 1 ? "day" : "days"} />
          <Stat label="Weeks attended" value={String(WEEKS_ATTENDED)} unit={`of ${WEEKS_TOTAL}`} />
        </dl>
      </section>

      <section className={cn(SURFACE, "flex flex-col gap-4 rounded-xl p-5 ring-1")}>
        <header className="flex items-baseline justify-between gap-3">
          <h2 className="text-[13px] font-semibold">Internship weeks</h2>
          <Legend />
        </header>
        <div className="overflow-x-auto">
          <div className="inline-grid grid-flow-col grid-rows-[auto_repeat(5,auto)] gap-1.5">
            <span />
            {WEEKDAYS.map((d) => (
              <span key={d} className="pr-2 text-[10px] leading-6 text-muted-foreground">
                {d}
              </span>
            ))}
            {weeks.map((week, w) => (
              <WeekColumn key={week[0]?.key} week={week} index={w} />
            ))}
          </div>
        </div>
      </section>

      <AbsenceList />
    </AdminPage>
  );
}

function WeekColumn({ week, index }: { week: Cell[]; index: number }) {
  const first = week[0]?.date;
  return (
    <>
      <span className="text-center text-[10px] leading-5 text-muted-foreground tabular-nums" title={first?.toDateString()}>
        W{index + 1}
      </span>
      {week.map((c) => (
        <span
          key={c.key}
          title={`${c.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${
            c.absence ? ` · Absent · ${c.absence.reason}` : c.state === "upcoming" ? " · Upcoming" : " · Present"
          }`}
          className={cn(
            "size-6 rounded-[5px] transition-transform duration-150 ease-out hover:scale-110",
            c.state === "present" && "bg-foreground/15",
            c.state === "absent" && "bg-red-500/85",
            c.state === "upcoming" && "border border-dashed border-border",
            c.today && "ring-2 ring-foreground/70 ring-offset-2 ring-offset-background",
          )}
        />
      ))}
    </>
  );
}

function Legend() {
  const items: [string, string][] = [
    ["Present", "bg-foreground/15"],
    ["Absent", "bg-red-500/85"],
    ["Upcoming", "border border-dashed border-border"],
  ];
  return (
    <ul className="flex items-center gap-3">
      {items.map(([label, cls]) => (
        <li key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className={cn("size-2.5 rounded-[3px]", cls)} />
          {label}
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col gap-1 bg-background px-4 py-3">
      <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="font-heading text-xl leading-none font-semibold tracking-[-0.02em] tabular-nums">
        {value}
        <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">{unit}</span>
      </dd>
    </div>
  );
}

/** Neutral progress ring; colour stays out of it, the number carries the meaning. */
function Ring({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 52 52" className="size-14 -rotate-90" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" className="stroke-foreground/10" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        className="stroke-foreground transition-[stroke-dashoffset] duration-300 ease-out"
      />
    </svg>
  );
}

function AbsenceList() {
  if (MY_ABSENCES.length === 0) {
    return (
      <section className={cn(SURFACE, "rounded-xl px-5 py-10 text-center text-[13px] text-muted-foreground ring-1")}>
        No absences recorded.
      </section>
    );
  }

  const groups = new Map<string, StudentAbsence[]>();
  for (const a of [...MY_ABSENCES].sort((x, y) => y.date.localeCompare(x.date))) {
    const month = parse(a.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    groups.set(month, [...(groups.get(month) ?? []), a]);
  }

  return (
    <section className="flex flex-col gap-5">
      {[...groups].map(([month, items]) => (
        <div key={month} className="flex flex-col gap-2">
          <h3 className="flex items-baseline gap-2 px-1 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
            {month}
            <span className="font-normal tracking-normal normal-case tabular-nums">
              {items.length} {items.length === 1 ? "day" : "days"}
            </span>
          </h3>
          <ul className={cn(SURFACE, "divide-y divide-border/60 overflow-hidden rounded-xl ring-1")}>
            {items.map((a) => {
              const d = parse(a.date);
              return (
                <li key={a.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="flex w-10 shrink-0 flex-col items-center rounded-md bg-muted/70 py-1 leading-none">
                    <span className="text-[9px] font-medium text-muted-foreground uppercase">
                      {d.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                    <span className="mt-0.5 text-[15px] font-semibold tabular-nums">{d.getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{a.reason}</span>
                  <span className="shrink-0 text-right text-[12px] text-muted-foreground">
                    {a.recorder}
                    <span className="block text-[11px] text-muted-foreground/70">{a.recordedBy}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
