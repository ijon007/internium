"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@internium/ui/components/card";
import {
  ArrowRightIcon,
  BuildingsIcon,
  FilesIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  AdminPage,
  PRESS,
  SURFACE,
} from "@/components/admin/admin-table";
import { CLASSES, STUDENTS } from "@/constants/coordinator";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const unassigned = STUDENTS.filter(
  (s) => !s.companyId && !CLASSES.find((c) => c.id === s.classId)?.archived,
);
const missingDocs = STUDENTS.reduce(
  (sum, s) => sum + Object.values(s.documents).filter((d) => d === "missing").length,
  0,
);
const activeClasses = CLASSES.filter((c) => !c.archived);

const CARDS = [
  {
    label: "Students without a company",
    value: unassigned.length,
    hint: "Assign a company and business mentor",
    icon: BuildingsIcon,
    href: `${getRoleHref("coordinator", "students")}?filter=unassigned`,
    cta: "Assign students",
  },
  {
    label: "Documents missing",
    value: missingDocs,
    hint: "Across all active students",
    icon: FilesIcon,
    href: `${getRoleHref("coordinator", "documents")}?missing=1`,
    cta: "Open documents",
  },
  {
    label: "Classes",
    value: activeClasses.length,
    hint: `${CLASSES.length - activeClasses.length} archived`,
    icon: UsersThreeIcon,
    href: getRoleHref("coordinator", "classes"),
    cta: "View classes",
  },
];

export function CoordinatorDashboard() {
  return (
    <AdminPage
      title="Dashboard"
      description="Classes, placements, and documents at a glance."
    >
      <section className="grid gap-3 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.label} size="sm" className={cn(SURFACE, "justify-between")}>
            <CardHeader>
              <CardTitle className="text-[11px] font-medium tracking-[0.01em] text-muted-foreground">
                {card.label}
              </CardTitle>
              <CardAction>
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/12 text-foreground">
                  <card.icon weight={ICON_WEIGHT} className="size-3.5" />
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-2">
              <div>
                <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
                  {card.value}
                </p>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {card.hint}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={PRESS}
                nativeButton={false}
                render={<Link href={card.href} />}
              >
                {card.cta}
                <ArrowRightIcon weight={ICON_WEIGHT} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card size="sm" className={cn(SURFACE, "gap-0 py-0")}>
        <CardHeader className="border-b py-3">
          <CardTitle>Needs attention</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ul>
            {unassigned.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-2.5 text-xs",
                  i < unassigned.length - 1 && "border-b border-border/70",
                )}
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                  {CLASSES.find((c) => c.id === s.classId)?.name} · No company yet
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
