"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@internium/ui/components/card";
import { ArrowRightIcon, CalendarCheckIcon, ChatsCircleIcon, StudentIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { AdminPage, SURFACE } from "@/components/admin/admin-table";
import { AttendanceButtons, useMarkAttendance, weekLabel } from "@/components/business-mentor/attendance-controls";
import { NoStudents } from "@/components/business-mentor/mentor-attendance";
import { StatusBadge, statusVars } from "@/components/status-badge";
import { CHAT_PATH, MOCK_CONVERSATIONS } from "@/constants/chat";
import { CURRENT_WEEK, MENTOR_COMPANY, MENTOR_STUDENTS, entryFor } from "@/constants/business-mentor";
import { classOf } from "@/constants/teacher";
import { useAttendance } from "@/lib/attendance-store";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const STUDENTS_HREF = getRoleHref("business-mentor", "students");
const ATTENDANCE_HREF = getRoleHref("business-mentor", "attendance");
const CHAT_HREF = getRoleHref("business-mentor", CHAT_PATH);
const unread = MOCK_CONVERSATIONS.reduce((n, c) => n + (c.unreadCount ?? 0), 0);

export function MentorDashboard() {
  const book = useAttendance();
  const { markPresent, askAbsent, dialog } = useMarkAttendance();
  const rows = MENTOR_STUDENTS.map((s) => ({ student: s, entry: entryFor(book, s.id, CURRENT_WEEK) }));
  const toConfirm = rows.filter((r) => r.entry.status === "pending").length;

  const cards = [
    {
      label: "Students at my company",
      value: MENTOR_STUDENTS.length,
      hint: MENTOR_COMPANY.name,
      icon: StudentIcon,
      href: STUDENTS_HREF,
      warn: false,
    },
    {
      label: "Attendance to confirm",
      value: toConfirm,
      hint: toConfirm ? "This week" : "All confirmed this week",
      icon: CalendarCheckIcon,
      href: ATTENDANCE_HREF,
      warn: toConfirm > 0,
    },
    {
      label: "Unread messages",
      value: unread,
      hint: unread ? "Open chat" : "All caught up",
      icon: ChatsCircleIcon,
      href: CHAT_HREF,
      warn: false,
    },
  ];

  return (
    <AdminPage title="Dashboard" description="Your interns, their weekly attendance and messages.">
      <section className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            <Card
              size="sm"
              className={cn(SURFACE, "h-full justify-between transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/30")}
            >
              <CardHeader>
                <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
                  {card.label}
                </CardTitle>
                <CardAction>
                  <span
                    style={card.warn ? statusVars("uploaded") : undefined}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full",
                      card.warn ? "status-tint" : "bg-primary/12 text-foreground",
                    )}
                  >
                    <card.icon weight={ICON_WEIGHT} className="size-3.5" />
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
                  {card.value}
                </p>
                <p className="mt-1.5 truncate text-[11px] leading-snug text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <Card size="sm" className={cn(SURFACE, "gap-0 py-0")}>
        <CardHeader className="py-3">
          <CardTitle>This week&apos;s attendance</CardTitle>
          <CardAction>
            <Link
              href={ATTENDANCE_HREF}
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {weekLabel(CURRENT_WEEK)}
              <ArrowRightIcon weight={ICON_WEIGHT} className="size-3" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="px-1.5 pb-1.5">
          {rows.length === 0 ? (
            <NoStudents />
          ) : (
            <ul className="flex flex-col">
              {rows.map(({ student: s, entry }) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/50"
                >
                  <Link href={`${STUDENTS_HREF}?student=${s.id}`} className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium">{s.name}</span>
                    <span className="truncate text-muted-foreground">
                      {classOf(s.classId)?.name ?? "—"}
                      {entry.reason ? ` · ${entry.reason}` : ""}
                    </span>
                  </Link>
                  <StatusBadge status={entry.status} />
                  <AttendanceButtons
                    entry={entry}
                    onPresent={() => markPresent(s.id, s.name, CURRENT_WEEK, entry)}
                    onAbsent={() => askAbsent({ studentId: s.id, name: s.name, week: CURRENT_WEEK, reason: entry.reason })}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      {dialog}
    </AdminPage>
  );
}
