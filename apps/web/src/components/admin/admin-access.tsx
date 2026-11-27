"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { Button } from "@internium/ui/components/button";
import { Textarea } from "@internium/ui/components/textarea";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { type FormEvent, useState } from "react";
import { AdminDropdown } from "@/components/admin/admin-table";
import { SheetSection } from "@/components/sheet-section";
import { ROLE_LABELS, ROLES, type Role } from "@/constants/roles";

const roles = ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }));

export function AdminAccess() {
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const enabled = isSignedIn && isAuthenticated;
  const queue = useQuery(api.users.accessQueue, enabled ? {} : "skip");
  const invite = useMutation(api.users.invite);
  const approve = useMutation(api.users.approve);
  const [batch, setBatch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch {
      setMessage(
        "Could not save access changes. Check the entries and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function submitBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entries: { email: string; role: Role }[] = [];
    for (const line of batch.split(/\r?\n/).filter((line) => line.trim())) {
      const [email, value, extra] = line.split(",").map((part) => part.trim());
      const role = ROLES.find((role) => role === value);
      if (!email || !role || extra !== undefined) {
        setMessage("Enter one email and role per line, separated by a comma.");
        return;
      }
      entries.push({ email, role });
    }
    void run(async () => {
      await invite({ entries });
      setBatch("");
    }, "Access added. Users can claim it by signing in with a matching verified email.");
  }

  if (!enabled || queue === undefined)
    return <p role="status">Checking access…</p>;
  if (queue === null)
    return <p role="status">Administrator access required.</p>;

  return (
    <>
      <SheetSection title="Add users by email">
        <form onSubmit={submitBatch} className="flex flex-col gap-2">
          <label htmlFor="access-batch">
            Enter one email and role per line.
          </label>
          <p id="access-batch-help" className="text-muted-foreground">
            Roles are {ROLES.join(", ")}.
          </p>
          <Textarea
            id="access-batch"
            aria-describedby="access-batch-help"
            placeholder="student@internium.com, student"
            value={batch}
            onChange={(event) => setBatch(event.target.value)}
            required
          />
          <Button type="submit" disabled={busy} className="self-end">
            Add batch
          </Button>
        </form>
        <p role="status">{message}</p>
      </SheetSection>
      <SheetSection title="Join requests">
        {queue.requests.length === 0 && <p>No pending requests.</p>}
        {queue.requests.map((request) => (
          <JoinRequest
            key={request._id}
            email={request.email}
            disabled={busy}
            onApprove={(role) =>
              void run(
                () => approve({ userId: request._id, role }),
                "Request approved.",
              )
            }
          />
        ))}
      </SheetSection>
      <SheetSection title="Unclaimed invitations">
        {queue.invitations.length === 0 && <p>No unclaimed invitations.</p>}
        <ul className="space-y-1">
          {queue.invitations.map((entry) => (
            <li key={entry._id}>
              {entry.email} · {ROLE_LABELS[entry.role]}
            </li>
          ))}
        </ul>
      </SheetSection>
    </>
  );
}

function JoinRequest({
  email,
  disabled,
  onApprove,
}: {
  email: string;
  disabled: boolean;
  onApprove: (role: Role) => void;
}) {
  const [role, setRole] = useState<Role>("student");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="break-all">{email}</span>
      <AdminDropdown
        label={`Role for ${email}`}
        items={roles}
        value={role}
        onChange={setRole}
      />
      <Button type="button" disabled={disabled} onClick={() => onApprove(role)}>
        Approve
      </Button>
    </div>
  );
}
