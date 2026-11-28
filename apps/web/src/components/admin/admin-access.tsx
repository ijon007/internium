"use client";

import { api } from "@internium/backend/convex/_generated/api";
import { Button } from "@internium/ui/components/button";
import { Textarea } from "@internium/ui/components/textarea";
import { useMutation } from "convex/react";
import { type FormEvent, useState } from "react";
import { PRESS } from "@/components/admin/admin-table";
import { ROLES, type Role } from "@/constants/roles";

export function AdminAccess() {
  const invite = useMutation(api.users.invite);
  const [batch, setBatch] = useState("");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setFailed(false);
      setMessage(success);
    } catch {
      setFailed(true);
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
        setFailed(true);
        setMessage("Enter one email and role per line, separated by a comma.");
        return;
      }
      entries.push({ email, role });
    }
    void run(async () => {
      await invite({ entries });
      setBatch("");
    }, "Invitations added. They show in the users table until claimed.");
  }

  return (
    <form onSubmit={submitBatch} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="access-batch" className="font-medium text-foreground">
          Add by email
        </label>
        <p id="access-batch-help" className="text-muted-foreground">
          One email and role per line, separated by a comma. Roles:{" "}
          {ROLES.join(", ")}.
        </p>
      </div>
      <Textarea
        id="access-batch"
        aria-describedby="access-batch-help"
        placeholder="student@internium.com, student"
        value={batch}
        onChange={(event) => setBatch(event.target.value)}
        required
      />
      <Button type="submit" disabled={busy} className={`${PRESS} self-end`}>
        Add batch
      </Button>
      {message ? (
        <p
          role="status"
          className={failed ? "text-destructive" : "text-muted-foreground"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
