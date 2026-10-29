"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@internium/ui/components/tooltip";
import { AdminPage, SURFACE } from "@/components/admin/admin-table";
import { INTERNSHIP_SESSIONS, INTERNSHIP_TODAY, MY_ABSENCES, type StudentAbsence } from "@/constants/student";
import { dateFormat } from "@/lib/date-format";
import { cn } from "@/lib/utils";

/** Local-midnight date from YYYY-MM-DD, so comparisons never drift across time zones. */
const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y as number, (m as number) - 1, d);
};

type Session = { date: string; state: "present" | "absent" | "upcoming"; absence?: StudentAbsence };

function buildSessions(todayKey: string): Session[] {
  const byDay = new Map(MY_ABSENCES.map((a) => [a.date, a]));
  return INTERNSHIP_SESSIONS.map((date) => {
    const absence = byDay.get(date);
    return { date, absence, state: absence ? "absent" : date > todayKey ? "upcoming" : "present" };
  });
}

export function StudentAbsences() {
  const today = INTERNSHIP_TODAY;
  const sessions = buildSessions(today);
  const held = sessions.filter((s) => s.state !== "upcoming");
  const absent = held.filter((s) => s.state === "absent").length;
  const attended = held.length - absent;
  const rate = held.length ? Math.round((attended / held.length) * 100) : 100;

  return (
    <AdminPage title="My Absences" description="Absences recorded by your teacher or business mentor.">
      <section className={cn(SURFACE, "flex flex-col gap-5 rounded-xl px-5 py-4 ring-1")}>
        <dl className="grid grid-cols-3 gap-4">
          <Stat label="Attendance" value={`${rate}`} unit="%" ring={rate} />
          <Stat label="Absences" value={String(absent)} unit={absent === 1 ? "session" : "sessions"} />
          <Stat label="Attended" value={String(attended)} unit={`of ${held.length} so far`} />
        </dl>
        <Timeline sessions={sessions} today={today} />
      </section>

      <AbsenceList />
    </AdminPage>
  );
}

function Stat({ label, value, unit, ring }: { label: string; value: string; unit: string; ring?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {ring !== undefined ? <Ring value={ring} /> : null}
      <div className="flex flex-col gap-1">
        <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
        <dd className="font-heading text-xl leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {value}
          <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">{unit}</span>
        </dd>
      </div>
    </div>
  );
}

/** Thin neutral ring; the number carries the meaning, so no colour. */
function Ring({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={r} fill="none" strokeWidth="2.5" className="stroke-foreground/10" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        className="stroke-foreground transition-[stroke-dashoffset] duration-300 ease-out"
      />
    </svg>
  );
}

const DOT: Record<Session["state"], string> = {
  present: "bg-foreground/20",
  absent: "bg-red-500",
  upcoming: "border border-dashed border-foreground/25",
};

/** Only the days the internship actually meets, in date order, labelled by month. */
function Timeline({ sessions, today }: { sessions: Session[]; today: string }) {
  const months = new Map<string, Session[]>();
  for (const s of sessions) {
    const m = dateFormat({ month: "short" }).format(parse(s.date));
    months.set(m, [...(months.get(m) ?? []), s]);
  }

  return (
    <div className="flex flex-col gap-2">
      <TooltipProvider delay={80}>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {[...months].map(([month, items]) => (
            <div key={month} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">{month}</span>
              <div className="flex items-center gap-1">
                {items.map((s) => (
                  <SessionDot key={s.date} session={s} today={s.date === today} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
      <ul className="flex items-center gap-3">
        {(["present", "absent", "upcoming"] as const).map((k) => (
          <li key={k} className="flex items-center gap-1.5 text-[11px] text-muted-foreground capitalize">
            <span className={cn("size-2 rounded-full", DOT[k])} />
            {k}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SessionDot({ session: s, today }: { session: Session; today: boolean }) {
  const d = parse(s.date);
  const label = `${d.toLocaleDateString("en-GB", { weekday: "long" })}, ${dateFormat({ day: "numeric", month: "short", year: "numeric" }).format(d)}`;
  const status = s.state === "absent" ? "Absent" : s.state === "upcoming" ? "Upcoming" : "Present";
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="img"
            aria-label={`${label}, ${status}`}
            className={cn(
              "size-3.5 rounded-full transition-transform duration-150 ease-out hover:scale-125",
              DOT[s.state],
              today && "ring-[1.5px] ring-foreground ring-offset-2 ring-offset-background",
            )}
          />
        }
      />
      <TooltipContent>
        <span className="font-medium">{label}</span>
        <span className="opacity-70">
          · {today ? "Today" : status}
        </span>
      </TooltipContent>
    </Tooltip>
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
