"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@internium/ui/components/tabs";
import {
  ArrowCounterClockwiseIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PlusIcon,
  ProhibitIcon,
  UserPlusIcon,
  UserSwitchIcon,
} from "@phosphor-icons/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  addManagedUser,
  editManagedUser,
  resetManagedPassword,
  setManagedUserStatus,
} from "@/app/dashboard/admin/users/actions";
import { AdminAccess } from "@/components/admin/admin-access";
import {
  AdminDropdown,
  AdminPage,
  AdminTable,
  AdminTableEmpty,
  CELL,
  formatDate,
  PRESS,
} from "@/components/admin/admin-table";
import { SheetBody, SheetSection } from "@/components/sheet-section";
import { ADMIN_CLASSES } from "@/constants/admin-users";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_LABELS, ROLE_PICKER_ORDER, type Role } from "@/constants/roles";
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";

type AdminUser = NonNullable<
  FunctionReturnType<typeof api.users.directory>
>[number];
type AccessQueue = NonNullable<
  FunctionReturnType<typeof api.users.accessQueue>
>;

type AccountRow = AdminUser & { kind: "account" };
type RequestRow = {
  kind: "request";
  id: AccessQueue["requests"][number]["_id"];
  name: string;
  email: string;
  status: "requested";
  createdAt: number;
};
type InvitationRow = {
  kind: "invitation";
  id: AccessQueue["invitations"][number]["_id"];
  name: string;
  email: string;
  role: Role;
  status: "invited";
  createdAt: number;
  className?: string;
  company?: string;
};
type DirectoryRow = AccountRow | RequestRow | InvitationRow;
type RowStatus = DirectoryRow["status"];

type RoleFilter = Role | "all";
type StatusFilter = RowStatus | "all";

const ROLE_FILTER_ITEMS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  ...ROLE_PICKER_ORDER.map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })),
];
const STATUS_FILTER_ITEMS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "requested", label: "Requested" },
  { value: "invited", label: "Invited" },
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

export function AdminUsers() {
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const enabled = isSignedIn && isAuthenticated;
  const users = useQuery(api.users.directory, enabled ? {} : "skip");
  const queue = useQuery(api.users.accessQueue, enabled ? {} : "skip");
  const updateAccount = useMutation(api.users.updateAccount);
  const approve = useMutation(api.users.approve);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<AdminUser | "new" | null>(null);
  const shownUser = useRetained(editing);
  const [deactivating, setDeactivating] = useState<AdminUser | null>(null);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const rows = useMemo(() => {
    if (!users) return [];
    const accounts: DirectoryRow[] = users.map((user) => ({
      kind: "account",
      ...user,
    }));
    const requests: DirectoryRow[] = (queue?.requests ?? []).map((request) => ({
      kind: "request",
      id: request._id,
      name: request.name || request.email,
      email: request.email,
      status: "requested",
      createdAt: request.createdAt,
    }));
    const invitations: DirectoryRow[] = (queue?.invitations ?? []).map(
      (entry) => ({
        kind: "invitation",
        id: entry._id,
        name: entry.name || entry.email,
        email: entry.email,
        role: entry.role,
        status: "invited",
        createdAt: entry._creationTime,
        className: entry.className,
        company: entry.company,
      }),
    );
    return [...accounts, ...requests, ...invitations].sort(
      (a, b) => b.createdAt - a.createdAt,
    );
  }, [users, queue]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (role === "all" || (row.kind !== "request" && row.role === role)) &&
        (status === "all" || row.status === status) &&
        (!q ||
          row.name.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q)),
    );
  }, [rows, query, role, status]);

  async function run(action: () => Promise<void>) {
    try {
      await action();
    } catch {
      toast.error("Could not save the account change.");
    }
  }

  async function save(draft: Draft, invite: boolean) {
    const profile = {
      ...draft,
      className: draft.role === "student" ? draft.className : undefined,
      company: draft.role === "business-mentor" ? draft.company : undefined,
    };
    if (!editing) return;
    if (editing === "new") {
      const login = await addManagedUser(profile, invite);
      if (login) setCredentials(login);
      else toast.success(`Invite sent to ${draft.email}`);
    } else {
      const { requiresVerification } = await editManagedUser(
        editing.id,
        profile,
      );
      toast.success(
        requiresVerification
          ? "User updated. Verify the new email in Clerk, then save again to make it the login email."
          : "User updated",
      );
    }
    setEditing(null);
  }
  return (
    <AdminPage
      title="Users"
      description="Search, filter, and manage accounts, requests, and invitations."
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
          className="w-36"
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
            <AdminTableEmpty>
              {users === undefined || queue === undefined
                ? "Loading users…"
                : users === null
                  ? "Administrator access required."
                  : "No users match these filters."}
            </AdminTableEmpty>
          ) : undefined
        }
      >
        {visible.map((row) => {
          const inactive = row.status === "inactive";
          return (
            <tr
              key={`${row.kind}-${row.id}`}
              className={cn(
                "transition-colors hover:bg-muted/40",
                inactive && "text-muted-foreground",
              )}
            >
              <td className={cn(CELL, "font-medium", inactive && "opacity-60")}>
                {row.name}
                {row.kind !== "request" && (row.className || row.company) ? (
                  <span className="ml-1.5 font-normal text-[11px] text-muted-foreground">
                    {row.className ?? row.company}
                  </span>
                ) : null}
              </td>
              <td className={cn(CELL, inactive && "opacity-60")}>
                {row.email}
              </td>
              <td className={cn(CELL, inactive && "opacity-60")}>
                {row.kind === "request" ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  ROLE_LABELS[row.role]
                )}
              </td>
              <td className={CELL}>
                <StatusBadge status={row.status} />
              </td>
              <td
                className={cn(
                  CELL,
                  "tabular-nums text-muted-foreground",
                  inactive && "opacity-60",
                )}
              >
                {formatDate(new Date(row.createdAt).toISOString())}
              </td>
              <td className={cn(CELL, "px-1 text-right")}>
                {row.kind === "account" ? (
                  <RowMenu
                    user={row}
                    onEdit={() => setEditing(row)}
                    onRole={(next) =>
                      void run(async () => {
                        await updateAccount({ id: row.id, role: next });
                        toast.success(
                          `${row.name} is now ${ROLE_LABELS[next]}`,
                        );
                      })
                    }
                    onReset={() =>
                      void run(async () =>
                        setCredentials(await resetManagedPassword(row.id)),
                      )
                    }
                    onDeactivate={() => setDeactivating(row)}
                    onReactivate={() =>
                      void run(async () => {
                        await setManagedUserStatus(row.id, "active");
                        toast.success(`${row.name} reactivated`);
                      })
                    }
                  />
                ) : row.kind === "request" ? (
                  <ApproveMenu
                    email={row.email}
                    onApprove={(next) =>
                      void run(async () => {
                        await approve({ userId: row.id, role: next });
                        toast.success(
                          `${row.email} approved as ${ROLE_LABELS[next]}`,
                        );
                      })
                    }
                  />
                ) : null}
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <UserSheet
        open={editing !== null}
        user={shownUser}
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
            <DialogClose render={<Button variant="ghost" className={PRESS} />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              className={PRESS}
              onClick={() => {
                if (!deactivating) return;
                void run(async () => {
                  await setManagedUserStatus(deactivating.id, "inactive");
                  toast.success(`${deactivating.name} deactivated`);
                  setDeactivating(null);
                });
              }}
            >
              <ProhibitIcon weight={ICON_WEIGHT} />
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
            <DialogClose render={<Button className={PRESS} />}>
              <CheckIcon weight={ICON_WEIGHT} />
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

const STATUS_BADGE: Record<RowStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className:
      "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  inactive: {
    label: "Inactive",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  requested: {
    label: "Requested",
    className:
      "border-transparent bg-amber-500/15 text-amber-800 dark:text-amber-300",
  },
  invited: {
    label: "Invited",
    className:
      "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
};

function StatusBadge({ status }: { status: RowStatus }) {
  const { label, className } = STATUS_BADGE[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

function ApproveMenu({
  email,
  onApprove,
}: {
  email: string;
  onApprove: (role: Role) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Approve ${email}`}
            className={PRESS}
          />
        }
      >
        <DotsThreeIcon weight="bold" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CheckIcon weight={ICON_WEIGHT} />
            Approve as
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {ROLE_PICKER_ORDER.map((role) => (
              <DropdownMenuItem key={role} onClick={() => onApprove(role)}>
                {ROLE_LABELS[role]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
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
        <DotsThreeIcon weight="bold" />
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
  open,
  user,
  onClose,
  onSave,
}: {
  open: boolean;
  user: AdminUser | "new" | null;
  onClose: () => void;
  onSave: (draft: Draft, invite: boolean) => Promise<void>;
}) {
  const isNew = user === "new";
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [invite, setInvite] = useState(false);
  const [tab, setTab] = useState("one");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft(
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
    setInvite(false);
    setTab("one");
  }, [open, user]);
  const valid =
    draft.name.trim() !== "" &&
    /.+@.+\..+/.test(draft.email) &&
    (draft.role !== "business-mentor" || draft.company.trim() !== "");

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const formHeader = (
    <SheetHeader>
      <SheetTitle>{isNew ? "Add user" : "Edit user"}</SheetTitle>
      <SheetDescription>
        {isNew
          ? "Create an account and share the login."
          : "Update this account's details."}
      </SheetDescription>
    </SheetHeader>
  );
  const form = (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid || saving) return;
        setSaving(true);
        void onSave(draft, invite)
          .catch(() =>
            toast.error(
              "Could not save the user. Check the email and try again.",
            ),
          )
          .finally(() => setSaving(false));
      }}
    >
      <SheetBody>
        <SheetSection title="Profile">
          <FieldGroup className="gap-3">
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
          </FieldGroup>
        </SheetSection>
        <SheetSection title="Access">
          <FieldGroup className="gap-3">
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
        </SheetSection>
      </SheetBody>
      <SheetFooter>
        <Button
          type="button"
          variant="ghost"
          className={PRESS}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!valid || saving} className={PRESS}>
          {isNew ? (
            invite ? (
              <PaperPlaneTiltIcon weight={ICON_WEIGHT} />
            ) : (
              <UserPlusIcon weight={ICON_WEIGHT} />
            )
          ) : (
            <CheckIcon weight={ICON_WEIGHT} />
          )}
          {isNew ? (invite ? "Send invite" : "Create user") : "Save"}
        </Button>
      </SheetFooter>
    </form>
  );

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent>
        {formHeader}
        {isNew ? (
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as string)}
            className="min-h-0 flex-1"
          >
            <TabsList className="mx-5 w-auto">
              <TabsTrigger value="one">Add one</TabsTrigger>
              <TabsTrigger value="batch">Add Batch</TabsTrigger>
            </TabsList>
            <TabsContent value="one" className="flex min-h-0 flex-col">
              {form}
            </TabsContent>
            <TabsContent value="batch" className="flex min-h-0 flex-col">
              {open && tab === "batch" && <AdminAccess onClose={onClose} />}
            </TabsContent>
          </Tabs>
        ) : (
          form
        )}
      </SheetContent>
    </Sheet>
  );
}
