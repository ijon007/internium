"use client";

import {
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  SURFACE,
  formatDate,
} from "@/components/admin/admin-table";
import { MY_ABSENCES, WEEKS_ATTENDED, WEEKS_TOTAL } from "@/constants/student";
import { cn } from "@/lib/utils";

export function StudentAbsences() {
  const stats: [string, string, string][] = [
    ["Total absences", String(MY_ABSENCES.length), MY_ABSENCES.length === 1 ? "day" : "days"],
    ["Weeks attended", `${WEEKS_ATTENDED}`, `of ${WEEKS_TOTAL}`],
  ];

  return (
    <AdminPage title="My Absences" description="Absences recorded by your teacher or business mentor.">
      <section className={cn(SURFACE, "grid grid-cols-2 divide-x divide-border/70 rounded-xl ring-1")}>
        {stats.map(([label, value, unit]) => (
          <div key={label} className="flex flex-col gap-1 px-4 py-3">
            <span className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">{label}</span>
            <span className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
              {value}
              <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">{unit}</span>
            </span>
          </div>
        ))}
      </section>

      <AdminTable
        head={[{ label: "Date" }, { label: "Reason" }, { label: "Recorded by" }]}
        empty={MY_ABSENCES.length === 0 ? <AdminTableEmpty>No absences recorded.</AdminTableEmpty> : undefined}
      >
        {MY_ABSENCES.map((a) => (
          <tr key={a.id}>
            <td className={cn(CELL, "font-medium tabular-nums")}>{formatDate(a.date)}</td>
            <td className={CELL}>{a.reason}</td>
            <td className={cn(CELL, "text-muted-foreground")}>
              {a.recorder}
              <span className="ml-1.5 text-muted-foreground/70">{a.recordedBy}</span>
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminPage>
  );
}
