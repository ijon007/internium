"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@internium/ui/components/sheet";
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  PRESS,
} from "@/components/admin/admin-table";
import {
  CLASSES,
  COMPANIES,
  type Company,
  type Mentor,
  STUDENTS,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";

const EMPTY_COMPANY: Company = {
  id: "",
  name: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  mentors: [],
};

export function CoordinatorCompanies() {
  const [companies, setCompanies] = useState(COMPANIES);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const visible = companies.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const open =
    openId === "new"
      ? { ...EMPTY_COMPANY, id: "new" }
      : (companies.find((c) => c.id === openId) ?? null);

  return (
    <AdminPage
      title="Companies"
      description="Host companies, their contacts, and business mentors."
      actions={
        <Button className={PRESS} onClick={() => setOpenId("new")}>
          <PlusIcon weight="bold" />
          Add company
        </Button>
      }
    >
      <div className="relative max-w-xs">
        <MagnifyingGlassIcon
          weight={ICON_WEIGHT}
          className="-translate-y-1/2 absolute top-1/2 left-2.5 size-3.5 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies"
          className="pl-8"
        />
      </div>

      <AdminTable
        head={[
          { label: "Name" },
          { label: "Contact" },
          { label: "Business mentors" },
          { label: "Students", className: "text-right" },
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>No companies match.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((c) => (
          <tr
            key={c.id}
            tabIndex={0}
            onClick={() => setOpenId(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setOpenId(c.id);
            }}
            className="cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
          >
            <td className={cn(CELL, "font-medium")}>{c.name}</td>
            <td className={CELL}>
              {c.contact}
              <span className="ml-1.5 text-muted-foreground">{c.email}</span>
            </td>
            <td className={CELL}>{c.mentors.map((m) => m.name).join(", ") || "—"}</td>
            <td className={cn(CELL, "text-right tabular-nums")}>
              {STUDENTS.filter((s) => s.companyId === c.id).length}
            </td>
          </tr>
        ))}
      </AdminTable>

      {open ? (
        <CompanySheet
          key={open.id}
          company={open}
          onClose={() => setOpenId(null)}
          onSave={(next) => {
            setCompanies((cur) =>
              next.id === "new"
                ? [...cur, { ...next, id: `co-${Date.now()}` }]
                : cur.map((c) => (c.id === next.id ? next : c)),
            );
            toast.success(`${next.name} saved`);
            setOpenId(null);
          }}
        />
      ) : null}
    </AdminPage>
  );
}

function CompanySheet({
  company,
  onClose,
  onSave,
}: {
  company: Company;
  onClose: () => void;
  onSave: (company: Company) => void;
}) {
  const [draft, setDraft] = useState(company);
  const [editing, setEditing] = useState<string | null>(null);
  const placed = STUDENTS.filter((s) => s.companyId === company.id);
  const isNew = company.id === "new";

  function set<K extends keyof Company>(key: K, value: Company[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function setMentor(id: string, patch: Partial<Mentor>) {
    set(
      "mentors",
      draft.mentors.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }

  const fields = [
    ["name", "Name"],
    ["contact", "Contact person"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["address", "Address"],
  ] as const;

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isNew ? "New company" : company.name}</SheetTitle>
          <SheetDescription>
            {isNew ? "Add a host company." : `${placed.length} students placed`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-xs">
          <FieldGroup className="grid grid-cols-2 gap-3">
            {fields.map(([key, label]) => (
              <Field key={key} className={cn(key === "address" && "col-span-2")}>
                <FieldLabel htmlFor={`company-${key}`}>{label}</FieldLabel>
                <Input
                  id={`company-${key}`}
                  value={draft[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </Field>
            ))}
          </FieldGroup>

          <section className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Business mentors</h3>
              <Button
                variant="ghost"
                size="sm"
                className={PRESS}
                onClick={() => {
                  const id = `m-${Date.now()}`;
                  set("mentors", [...draft.mentors, { id, name: "", email: "", phone: "" }]);
                  setEditing(id);
                }}
              >
                <PlusIcon weight="bold" />
                Add mentor
              </Button>
            </div>
            {draft.mentors.length === 0 ? (
              <p className="text-muted-foreground">No mentors yet.</p>
            ) : (
              <ul className="divide-y divide-border/70 rounded-lg bg-muted/50">
                {draft.mentors.map((m) =>
                  editing === m.id ? (
                    <li key={m.id} className="flex items-center gap-1.5 px-2 py-1.5">
                      <Input
                        autoFocus
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => setMentor(m.id, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        value={m.email}
                        onChange={(e) => setMentor(m.id, { email: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Done"
                        disabled={!m.name.trim()}
                        onClick={() => setEditing(null)}
                      >
                        <CheckIcon weight={ICON_WEIGHT} />
                      </Button>
                    </li>
                  ) : (
                    <li key={m.id} className="flex items-center gap-2 px-3 py-1.5">
                      <span className="font-medium">{m.name}</span>
                      <span className="truncate text-muted-foreground">{m.email}</span>
                      <span className="ml-auto flex">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${m.name}`}
                          onClick={() => setEditing(m.id)}
                        >
                          <PencilSimpleIcon weight={ICON_WEIGHT} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${m.name}`}
                          onClick={() =>
                            set(
                              "mentors",
                              draft.mentors.filter((x) => x.id !== m.id),
                            )
                          }
                        >
                          <TrashIcon weight={ICON_WEIGHT} />
                        </Button>
                      </span>
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>

          {!isNew ? (
            <section className="flex flex-col gap-1.5">
              <h3 className="font-medium">Placed students</h3>
              {placed.length === 0 ? (
                <p className="text-muted-foreground">Nobody placed here yet.</p>
              ) : (
                <ul className="divide-y divide-border/70 rounded-lg bg-muted/50">
                  {placed.map((s) => (
                    <li key={s.id} className="flex items-center justify-between px-3 py-1.5">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground">
                        {CLASSES.find((c) => c.id === s.classId)?.name} ·{" "}
                        {draft.mentors.find((m) => m.id === s.mentorId)?.name ?? "No mentor"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <Button variant="outline" className={PRESS} onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={PRESS}
            disabled={!draft.name.trim()}
            onClick={() =>
              onSave({ ...draft, mentors: draft.mentors.filter((m) => m.name.trim()) })
            }
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
