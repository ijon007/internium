"use client";

import { dateFormat } from "@/lib/date-format";
import { ICON_WEIGHT } from "@/constants/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@internium/ui/components/card";
import {
  ArrowRightIcon,
  ArrowUUpLeftIcon,
  CalendarDotsIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileDashedIcon,
  UserMinusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { AdminPage, SURFACE, formatDate } from "@/components/admin/admin-table";
import { StatusBadge, statusVars } from "@/components/status-badge";
import {
  MY_ABSENCES,
  MY_DOCUMENTS,
  type StudentDocStatus,
} from "@/constants/student";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const DOCS_HREF = getRoleHref("student", "documents");

const approved = MY_DOCUMENTS.filter((d) => d.status === "approved").length;
const returned = MY_DOCUMENTS.filter((d) => d.status === "returned");
const nextDeadline = MY_DOCUMENTS.filter((d) => d.deadline && d.status !== "approved")
  .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))[0];
const thisYear = MY_ABSENCES.length;

type AttentionItem = {
  id: string;
  doc: string;
  status: StudentDocStatus;
  title: string;
  detail: string;
  icon: typeof ArrowUUpLeftIcon;
};

const ATTENTION: AttentionItem[] = [
  ...MY_DOCUMENTS.flatMap((d) =>
    (d.entries ?? [d]).filter((e) => e.status === "returned").map((e) => ({
      id: `${d.id}-${e.id}-r`,
      doc: d.id,
      status: "returned" as const,
      title: d.entries ? `${d.label} · ${e.label}` : d.label,
      detail: e.comment ?? "Returned by your teacher",
      icon: ArrowUUpLeftIcon,
    })),
  ),
  ...MY_DOCUMENTS.flatMap((d) =>
    (d.entries ?? [d]).filter((e) => e.status === "missing").map((e) => ({
      id: `${d.id}-${e.id}-m`,
      doc: d.id,
      status: "missing" as const,
      title: d.entries ? `${d.label} · ${e.label}` : d.label,
      detail: d.deadline ? `Due ${formatDate(d.deadline)}` : "Not uploaded yet",
      icon: FileDashedIcon,
    })),
  ),
  ...MY_DOCUMENTS.flatMap((d) =>
    (d.entries ?? [d]).filter((e) => e.status === "generated").map((e) => ({
      id: `${d.id}-${e.id}-g`,
      doc: d.id,
      status: "generated" as const,
      title: d.entries ? `${d.label} · ${e.label}` : d.label,
      detail: "New copy ready to download",
      icon: DownloadSimpleIcon,
    })),
  ),
];

const CARDS = [
  {
    label: "Documents approved",
    value: (
      <>
        {approved}
        <span className="text-muted-foreground/60">/{MY_DOCUMENTS.length}</span>
      </>
    ),
    hint: approved === MY_DOCUMENTS.length ? "All done" : `${MY_DOCUMENTS.length - approved} to go`,
    icon: CheckCircleIcon,
    tint: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    label: "Returned",
    value: returned.length,
    hint: returned.length ? "Needs your action" : "Nothing returned",
    icon: ArrowUUpLeftIcon,
    tint: returned.length
      ? "status-tint"
      : "bg-muted text-muted-foreground",
  },
  {
    label: "Next deadline",
    value: nextDeadline?.deadline
      ? dateFormat({ day: "numeric", month: "short" }).format(
          new Date(nextDeadline.deadline),
        )
      : "—",
    hint: nextDeadline?.label ?? "No upcoming deadlines",
    icon: CalendarDotsIcon,
    tint: "bg-primary/12 text-foreground",
  },
  {
    label: "Absences this year",
    value: thisYear,
    hint: thisYear === 1 ? "1 day" : `${thisYear} days`,
    icon: UserMinusIcon,
    tint: "bg-primary/12 text-foreground",
  },
];

export function StudentDashboard() {
  return (
    <AdminPage title="Dashboard" description="Your internship documents and attendance at a glance.">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Card key={card.label} size="sm" className={cn(SURFACE, "justify-between")}>
            <CardHeader>
              <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
                {card.label}
              </CardTitle>
              <CardAction>
                <span style={card.label === "Returned" ? statusVars("returned") : undefined}
                  className={cn("flex size-7 items-center justify-center rounded-full", card.tint)}>
                  <card.icon weight={ICON_WEIGHT} className="size-3.5" />
                </span>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
                {card.value}
              </p>
              <p className="mt-1.5 truncate text-[11px] leading-snug text-muted-foreground">
                {card.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card size="sm" className={cn(SURFACE, "gap-0 py-0")}>
        <CardHeader className="py-3">
          <CardTitle>Needs your attention</CardTitle>
          <CardAction>
            <Link
              href={DOCS_HREF}
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              All documents
              <ArrowRightIcon weight={ICON_WEIGHT} className="size-3" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="px-1.5 pb-1.5">
          {ATTENTION.length === 0 ? (
            <p className="px-2.5 py-8 text-center text-xs text-muted-foreground">
              You're all caught up.
            </p>
          ) : (
            <ul className="flex flex-col">
              {ATTENTION.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${DOCS_HREF}?doc=${item.doc}`}
                    className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors duration-150 [@media(hover:hover)]:hover:bg-muted/50"
                  >
                    <item.icon weight={ICON_WEIGHT} className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate font-medium">{item.title}</span>
                      <span className="truncate text-muted-foreground">
                        {item.detail}
                      </span>
                    </span>
                    <StatusBadge status={item.status} />
                    <ArrowRightIcon
                      weight={ICON_WEIGHT}
                      className="size-3 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AdminPage>
  );
}
