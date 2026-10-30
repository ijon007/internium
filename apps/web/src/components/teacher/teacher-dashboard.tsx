"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@internium/ui/components/card";
import {
  ArrowRightIcon,
  ChatsCircleIcon,
  FileMagnifyingGlassIcon,
  StarIcon,
  UserMinusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPage, SURFACE, formatDate } from "@/components/admin/admin-table";
import { StatusBadge, statusVars } from "@/components/status-badge";
import { CHAT_PATH, MOCK_CONVERSATIONS } from "@/constants/chat";
import {
  ABSENCE_THRESHOLD,
  TEACHER_STUDENTS,
  classOf,
  docTypeLabel,
  reviewQueue,
} from "@/constants/teacher";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const STUDENTS_HREF = getRoleHref("teacher", "students");
const DOCS_HREF = getRoleHref("teacher", "documents");
const CHAT_HREF = getRoleHref("teacher", CHAT_PATH);

const queue = reviewQueue(TEACHER_STUDENTS);
const aboveThreshold = TEACHER_STUDENTS.filter((s) => s.absences.length > ABSENCE_THRESHOLD);
const followed = TEACHER_STUDENTS.filter((s) => s.followed);
const unread = MOCK_CONVERSATIONS.reduce((n, c) => n + (c.unreadCount ?? 0), 0);
const latestAbsences = TEACHER_STUDENTS.flatMap((s) => s.absences.map((a) => ({ ...a, student: s })))
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 8);

const CARDS = [
  {
    label: "Waiting for review",
    value: queue.length,
    hint: queue[0] ? `Oldest from ${formatDate(queue[0].doc.uploadedAt ?? "")}` : "Nothing to review",
    icon: FileMagnifyingGlassIcon,
    href: DOCS_HREF,
    warn: false,
  },
  {
    label: "Above absence threshold",
    value: aboveThreshold.length,
    hint: `More than ${ABSENCE_THRESHOLD} absences`,
    icon: UserMinusIcon,
    href: `${STUDENTS_HREF}?absences=above`,
    warn: aboveThreshold.length > 0,
  },
  {
    label: "Students I follow",
    value: followed.length,
    hint: `of ${TEACHER_STUDENTS.length} students`,
    icon: StarIcon,
    href: STUDENTS_HREF,
    warn: false,
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

function ListCard({ title, href, link, empty, children }: {
  title: string; href: string; link: string; empty: string; children: ReactNode[];
}) {
  return (
    <Card size="sm" className={cn(SURFACE, "gap-0 py-0")}>
      <CardHeader className="py-3">
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Link href={href}
            className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            {link}
            <ArrowRightIcon weight={ICON_WEIGHT} className="size-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-1.5 pb-1.5">
        {children.length === 0 ? (
          <p className="px-2.5 py-8 text-center text-xs text-muted-foreground">{empty}</p>
        ) : (
          <ul className="flex flex-col">{children}</ul>
        )}
      </CardContent>
    </Card>
  );
}

const ROW =
  "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/50";

function RowArrow() {
  return (
    <ArrowRightIcon weight={ICON_WEIGHT}
      className="size-3 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
  );
}

export function TeacherDashboard() {
  return (
    <AdminPage title="Dashboard" description="Reviews, absences and messages for your students.">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Link key={card.label} href={card.href}
            className="rounded-xl transition-transform duration-150 ease-out active:scale-[0.98]">
            <Card size="sm" className={cn(SURFACE, "h-full justify-between transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/30")}>
              <CardHeader>
                <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
                  {card.label}
                </CardTitle>
                <CardAction>
                  <span style={card.warn ? statusVars("returned") : undefined}
                    className={cn("flex size-7 items-center justify-center rounded-full",
                      card.warn ? "status-tint" : "bg-primary/12 text-foreground")}>
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

      <section className="grid gap-3 lg:grid-cols-2">
        <ListCard title="Review next" href={DOCS_HREF} link="Review queue" empty="Nothing waiting for review.">
          {queue.slice(0, 6).map((item) => (
            <li key={item.key}>
              <Link href={`${DOCS_HREF}?review=${item.key}`} className={ROW}>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{item.student.name}</span>
                  <span className="truncate text-muted-foreground">
                    {docTypeLabel(item.type)} · {classOf(item.student.classId)?.name}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {formatDate(item.doc.uploadedAt ?? "")}
                </span>
                <StatusBadge status="uploaded" />
                <RowArrow />
              </Link>
            </li>
          ))}
        </ListCard>

        <ListCard title="Latest absences" href={STUDENTS_HREF} link="My students" empty="No absences recorded.">
          {latestAbsences.map((a) => (
            <li key={`${a.student.id}-${a.id}`}>
              <Link href={`${STUDENTS_HREF}?student=${a.student.id}&tab=absences`} className={ROW}>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{a.student.name}</span>
                  <span className="truncate text-muted-foreground">
                    {a.reason} · by {a.recordedBy === "Teacher" ? "you" : a.recorder}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{formatDate(a.date)}</span>
                <RowArrow />
              </Link>
            </li>
          ))}
        </ListCard>
      </section>
    </AdminPage>
  );
}
