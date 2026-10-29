import { ICON_WEIGHT } from "@/constants/navigation";
"use client";

import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
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
  ArrowCounterClockwiseIcon,
  CopyIcon,
  DotsThreeIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  UserSwitchIcon,
  ProhibitIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
  ADMIN_CLASSES,
  ADMIN_USERS,
  type AdminUser,
  type AdminUserStatus,
} from "@/constants/admin-users";
import { ROLE_LABELS, ROLE_PICKER_ORDER, type Role } from "@/constants/roles";
import { cn } from "@/lib/utils";

type RoleFilter = Role | "all";
type StatusFilter = AdminUserStatus | "all";

const ROLE_FILTER_ITEMS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  ...ROLE_PICKER_ORDER.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
];
const STATUS_FILTER_ITEMS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const CLASS_ITEMS = ADMIN_CLASSES.map((item) => ({ value: item, label: item }));
const ROLE_ITEMS = ROLE_PICKER_ORDER.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

type Draft = {
  name: string;
  email: string;
  role: Role;
  className: string;
  company: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  email: "",
  role: "student",
  className: ADMIN_CLASSES[0],
  company: "",
};

function makePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const values = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

export function AdminUsers() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<AdminUser | "new" | null>(null);
  const [deactivating, setDeactivating] = useState<AdminUser | null>(null);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (user) =>
        (role === "all" || user.role === role) &&
        (status === "all" || user.status === status) &&
        (!q ||
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)),
    );
  }, [users, query, role, status]);

  function update(id: string, patch: Partial<AdminUser>) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, ...patch } : user)),
    );
  }

  function save(draft: Draft, invite: boolean) {
    const extras = {
      className: draft.role === "student" ? draft.className : undefined,
      company: draft.role === "business-mentor" ? draft.company : undefined,
    };
    if (editing && editing !== "new") {
      update(editing.id, {
        name: draft.name,
        email: draft.email,
        role: draft.role,
        ...extras,
      });
      toast.success("User updated");
      setEditing(null);
      return;
    }
    setUsers((current) => [
      {
        id: `u-${Date.now()}`,
        name: draft.name,
        email: draft.email,
        role: draft.role,
        status: "active",
        createdAt: new Date().toISOString(),
        ...extras,
      },
      ...current,
    ]);
    setEditing(null);
    if (invite) {
      toast.success(`Invite sent to ${draft.email}`);
    } else {
      setCredentials({ email: draft.email, password: makePassword() });
    }
  }

  return (
    <AdminPage
      title="Users"
      description="Search, filter, and manage Internium accounts."
      actions={
        <Button className={PRESS} onClick={() => setEditing("new")}>
          <PlusIcon weight="bold" />
          Add user
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <MagnifyingGlassIcon
            weight={ICON_WEIGHT}
            className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or email"
            aria-label="Search users"
            className="pl-7"
          />
        </div>
        <AdminDropdown
          label="Filter by role"
          items={ROLE_FILTER_ITEMS}
          value={role}
          onChange={setRole}
          className="w-36"
        />
        <AdminDropdown
          label="Filter by status"
          items={STATUS_FILTER_ITEMS}
          value={status}
          onChange={setStatus}
          className="w-32"
        />
      </div>

      <AdminTable
        head={[
          { label: "Name" },
          { label: "Email" },
          { label: "Role" },
          { label: "Status" },
          { label: "Created" },
          { label: "", className: "w-10" },
        ]}
        empty={
          visible.length === 0 ? (
            <AdminTableEmpty>No users match these filters.</AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((user) => {
          const inactive = user.status === "inactive";
          return (
            <tr
              key={user.id}
              className={cn(
                "transition-colors hover:bg-muted/40",
                inactive && "text-muted-foreground",
              )}
            >
              <td className={cn(CELL, "font-medium", inactive && "opacity-60")}>
                {user.name}
                {user.className || user.company ? (
                  <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                    {user.className ?? user.company}
                  </span>
                ) : null}
              </td>
              <td className={cn(CELL, inactive && "opacity-60")}>
                {user.email}
              </td>
              <td className={cn(CELL, inactive && "opacity-60")}>
                {ROLE_LABELS[user.role]}
              </td>
              <td className={CELL}>
                <Badge variant={inactive ? "outline" : "secondary"}>
                  {inactive ? "Inactive" : "Active"}
                </Badge>
              </td>
              <td
                className={cn(
                  CELL,
                  "tabular-nums text-muted-foreground",
                  inactive && "opacity-60",
                )}
              >
                {formatDate(user.createdAt)}
              </td>
              <td className={cn(CELL, "px-1 text-right")}>
                <RowMenu
                  user={user}
                  onEdit={() => setEditing(user)}
                  onRole={(next) => {
                    update(user.id, { role: next });
                    toast.success(`${user.name} is now ${ROLE_LABELS[next]}`);
                  }}
                  onReset={() =>
                    setCredentials({
                      email: user.email,
                      password: makePassword(),
                    })
                  }
                  onDeactivate={() => setDeactivating(user)}
                  onReactivate={() => {
                    update(user.id, { status: "active" });
                    toast.success(`${user.name} reactivated`);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <UserSheet
        key={editing === "new" ? "new" : (editing?.id ?? "closed")}
        user={editing}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <Dialog
        open={deactivating !== null}
        onOpenChange={(open) => {
          if (!open) setDeactivating(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Deactivate {deactivating?.name}?</DialogTitle>
            <DialogDescription>
              They can no longer sign in. Their account and data stay in the
              table, and you can reactivate them anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (deactivating) {
                  update(deactivating.id, { status: "inactive" });
                  toast.success(`${deactivating.name} deactivated`);
                }
                setDeactivating(null);
              }}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={credentials !== null}
        onOpenChange={(open) => {
          if (!open) setCredentials(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Login details</DialogTitle>
            <DialogDescription>
              Share these now. The temporary password is shown only once and
              must be changed at first sign-in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 px-3 py-2.5 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Email</span>
              <span className="truncate font-medium">{credentials?.email}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Password</span>
              <span className="flex items-center gap-1">
                <code className="font-mono font-medium">
                  {credentials?.password}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy password"
                  className={PRESS}
                  onClick={() => {
                    if (!credentials) return;
                    void navigator.clipboard.writeText(credentials.password);
                    toast.success("Password copied");
                  }}
                >
                  <CopyIcon weight={ICON_WEIGHT} />
                </Button>
              </span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button />}>Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

function RowMenu({
  user,
  onEdit,
  onRole,
  onReset,
  onDeactivate,
  onReactivate,
}: {
  user: AdminUser;
  onEdit: () => void;
  onRole: (role: Role) => void;
  onReset: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}) {
  const inactive = user.status === "inactive";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${user.name}`}
            className={PRESS}
          />
        }
      >
        <DotsThreeIcon weight={ICON_WEIGHT} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onClick={onEdit}>
          <PencilSimpleIcon weight={ICON_WEIGHT} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserSwitchIcon weight={ICON_WEIGHT} />
            Change role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={user.role}
              onValueChange={(value) => onRole(value as Role)}
            >
              {ROLE_PICKER_ORDER.map((role) => (
                <DropdownMenuRadioItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={onReset} disabled={inactive}>
          <KeyIcon weight={ICON_WEIGHT} />
          Reset password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {inactive ? (
          <DropdownMenuItem onClick={onReactivate}>
            <ArrowCounterClockwiseIcon weight={ICON_WEIGHT} />
            Reactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem variant="destructive" onClick={onDeactivate}>
            <ProhibitIcon weight={ICON_WEIGHT} />
            Deactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserSheet({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser | "new" | null;
  onClose: () => void;
  onSave: (draft: Draft, invite: boolean) => void;
}) {
  const isNew = user === "new";
  const [draft, setDraft] = useState<Draft>(() =>
    user && user !== "new"
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          className: user.className ?? ADMIN_CLASSES[0],
          company: user.company ?? "",
        }
      : EMPTY_DRAFT,
  );
  const [invite, setInvite] = useState(false);
  const valid =
    draft.name.trim() !== "" &&
    /.+@.+\..+/.test(draft.email) &&
    (draft.role !== "business-mentor" || draft.company.trim() !== "");

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <Sheet
      open={user !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="sm:max-w-sm">
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) onSave(draft, invite);
          }}
        >
          <SheetHeader>
            <SheetTitle>{isNew ? "Add user" : "Edit user"}</SheetTitle>
            <SheetDescription>
              {isNew
                ? "Create an account and share the login."
                : "Update this account's details."}
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="flex-1 gap-3 px-4">
            <Field>
              <FieldLabel htmlFor="user-name">Full name</FieldLabel>
              <Input
                id="user-name"
                value={draft.name}
                onChange={(event) => set("name", event.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input
                id="user-email"
                type="email"
                value={draft.email}
                onChange={(event) => set("email", event.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <AdminDropdown
                label="Role"
                items={ROLE_ITEMS}
                value={draft.role}
                onChange={(value) => set("role", value)}
                className="w-full"
              />
            </Field>
            {draft.role === "student" ? (
              <Field>
                <FieldLabel>Class</FieldLabel>
                <AdminDropdown
                  label="Class"
                  items={CLASS_ITEMS}
                  value={draft.className}
                  onChange={(value) => set("className", value)}
                  className="w-full"
                />
              </Field>
            ) : null}
            {draft.role === "business-mentor" ? (
              <Field>
                <FieldLabel htmlFor="user-company">Company</FieldLabel>
                <Input
                  id="user-company"
                  value={draft.company}
                  onChange={(event) => set("company", event.target.value)}
                />
              </Field>
            ) : null}
            {isNew ? (
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={invite}
                  onChange={(event) => setInvite(event.target.checked)}
                  className="size-3.5 accent-primary"
                />
                Send an invite via Clerk instead of a temporary password
              </label>
            ) : null}
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={!valid} className={PRESS}>
              {isNew ? (invite ? "Send invite" : "Create user") : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
