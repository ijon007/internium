"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { BuildingsIcon, ChatCircleIcon, EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PRESS, SURFACE } from "@/components/admin/admin-table";
import { ME, MY_COMPANY, MY_PEOPLE } from "@/constants/student";
import { cn } from "@/lib/utils";
import { getRoleHref } from "@/utils/navigation";

const CARD = cn(SURFACE, "rounded-xl ring-1");
const LINK = "transition-colors duration-150 ease-out [@media(hover:hover)]:hover:text-foreground";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-foreground/70 ring-1 ring-foreground/5",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="px-1 text-[11px] font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** Stacked key-value: quiet label above, value below. Reads as one unit. */
function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="truncate text-xs">{children}</dd>
    </div>
  );
}

const tel = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export function StudentMyData() {
  const chatHref = getRoleHref("student", "chat");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 py-2">
      <header className="flex flex-col items-center gap-2.5 pt-2 text-center">
        <Avatar name={ME.name} className="size-16 text-xl tracking-tight" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg leading-tight font-semibold tracking-tight text-foreground">{ME.name}</h1>
          <p className="text-xs text-muted-foreground tabular-nums">
            Class {ME.className} · {ME.schoolYear}
          </p>
        </div>
      </header>

      <Section title="Personal">
        <dl className={cn(CARD, "grid grid-cols-2 gap-x-6 gap-y-3 p-3")}>
          <Field label="Full name">{ME.name}</Field>
          <Field label="Email">
            <a href={`mailto:${ME.email}`} className={LINK}>
              {ME.email}
            </a>
          </Field>
          <Field label="Class">{ME.className}</Field>
          <Field label="School year">
            <span className="tabular-nums">{ME.schoolYear}</span>
          </Field>
        </dl>
      </Section>

      <Section title="My mentors">
        <div className="grid gap-2 sm:grid-cols-2">
          {MY_PEOPLE.map((p) => (
            <article key={p.role} className={cn(CARD, "flex flex-col gap-3 p-3")}>
              <div className="flex items-center gap-2.5">
                <Avatar name={p.name} className="size-9 text-xs" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm leading-tight font-medium tracking-tight">{p.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{p.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <a href={`mailto:${p.email}`} className={cn(LINK, "flex min-w-0 items-center gap-2")}>
                  <EnvelopeSimpleIcon weight={ICON_WEIGHT} className="size-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{p.email}</span>
                </a>
                <a href={tel(p.phone)} className={cn(LINK, "flex items-center gap-2 tabular-nums")}>
                  <PhoneIcon weight={ICON_WEIGHT} className="size-3.5 shrink-0 opacity-70" />
                  {p.phone}
                </a>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className={cn(PRESS, "w-full")}
                nativeButton={false}
                render={<Link href={chatHref} />}
              >
                <ChatCircleIcon weight={ICON_WEIGHT} className="text-muted-foreground" />
                Message
              </Button>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Company">
        {MY_COMPANY ? (
          <div className={cn(CARD, "flex flex-col gap-3 p-3")}>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-foreground/5">
                <BuildingsIcon weight={ICON_WEIGHT} className="size-4.5 text-muted-foreground" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm leading-tight font-medium tracking-tight">{MY_COMPANY.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">{MY_COMPANY.address}</span>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-x-6 gap-y-3 border-t border-border/60 pt-3">
              <Field label="Contact">{MY_COMPANY.contact}</Field>
              <Field label="Email">
                <a href={`mailto:${MY_COMPANY.email}`} className={LINK}>
                  {MY_COMPANY.email}
                </a>
              </Field>
              <Field label="Phone">
                <a href={tel(MY_COMPANY.phone)} className={cn(LINK, "tabular-nums")}>
                  {MY_COMPANY.phone}
                </a>
              </Field>
            </dl>
          </div>
        ) : (
          <div className={cn(CARD, "flex flex-col items-center gap-2 px-3 py-6 text-center text-xs text-muted-foreground")}>
            <BuildingsIcon weight={ICON_WEIGHT} className="size-5 text-muted-foreground/70" />
            Your coordinator hasn't assigned your company yet.
          </div>
        )}
      </Section>
    </div>
  );
}
