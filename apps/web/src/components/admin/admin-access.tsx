"use client";

import { api } from "@internium/backend/convex/_generated/api";
import { Button } from "@internium/ui/components/button";
import { SheetFooter } from "@internium/ui/components/sheet";
import { Textarea } from "@internium/ui/components/textarea";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "convex/react";
import { type FormEvent, useRef, useState } from "react";
import { PRESS } from "@/components/admin/admin-table";
import {
  SHEET_LIST,
  SHEET_ROW,
  SheetBody,
  SheetSection,
} from "@/components/sheet-section";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_LABELS, ROLES, type Role } from "@/constants/roles";

type Entry = { email: string; role: Role };

function parseBatch(text: string): { entries: Entry[] } | { error: string } {
  const entries: Entry[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/).filter((line) => line.trim())) {
    const [email, value, extra] = line.split(",").map((part) => part.trim());
    const role = ROLES.find((role) => role === value);
    const key = email?.toLowerCase();
    if (!email || !role || extra !== undefined) {
      return {
        error: "Enter one email and role per line, separated by a comma.",
      };
    }
    if (seen.has(key)) {
      return { error: "Each email can appear only once per batch." };
    }
    seen.add(key);
    entries.push({ email, role });
  }
  if (entries.length === 0) {
    return { error: "Add at least one email and role." };
  }
  return { entries };
}

export function AdminAccess({ onClose }: { onClose: () => void }) {
  const invite = useMutation(api.users.invite);
  const fileRef = useRef<HTMLInputElement>(null);
  const [batch, setBatch] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<Entry[] | null>(null);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  function showError(error: string) {
    setFailed(true);
    setMessage(error);
  }

  async function submit(entries: Entry[]) {
    setBusy(true);
    setMessage("");
    try {
      await invite({ entries });
      setFailed(false);
      setMessage(
        "Invitations added. They show in the users table until claimed.",
      );
      setBatch("");
      setFileName("");
      setPreview(null);
    } catch {
      showError(
        "Could not save access changes. Check the entries and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function submitBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseBatch(batch);
    if ("error" in parsed) {
      showError(parsed.error);
      return;
    }
    void submit(parsed.entries);
  }

  function loadFile(file: File) {
    if (!/\.(txt|csv)$/i.test(file.name) && file.type !== "text/plain") {
      setPreview(null);
      setFileName("");
      showError("Upload a .txt or .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseBatch(text);
      setBatch(text.trimEnd());
      setFileName(file.name);
      if ("error" in parsed) {
        setPreview(null);
        showError(parsed.error);
        return;
      }
      setFailed(false);
      setMessage("");
      setPreview(parsed.entries);
    };
    reader.readAsText(file);
  }

  return (
    <form onSubmit={submitBatch} className="flex min-h-0 flex-1 flex-col">
      <SheetBody>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">Add by email</p>
            <p className="text-muted-foreground">
              One email and role per line, separated by a comma. Roles:{" "}
              {ROLES.join(", ")}.
            </p>
          </div>
          <Textarea
            id="access-batch"
            aria-label="Email and role list"
            placeholder="student@internium.com, student"
            value={batch}
            onChange={(event) => {
              setBatch(event.target.value);
              setPreview(null);
              setFileName("");
            }}
          />
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv,text/plain"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) loadFile(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className={`${PRESS} self-start`}
            onClick={() => fileRef.current?.click()}
          >
            <UploadSimpleIcon weight={ICON_WEIGHT} />
            {fileName || "Upload file"}
          </Button>
          {preview ? (
            <SheetSection title="To invite" count={preview.length}>
              <ul className={SHEET_LIST}>
                {preview.map((entry) => (
                  <li key={entry.email} className={SHEET_ROW}>
                    <span className="min-w-0 flex-1 truncate">
                      {entry.email}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {ROLE_LABELS[entry.role]}
                    </span>
                  </li>
                ))}
              </ul>
            </SheetSection>
          ) : null}
          {message ? (
            <p
              role="status"
              className={failed ? "text-destructive" : "text-muted-foreground"}
            >
              {message}
            </p>
          ) : null}
        </div>
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
        <Button
          type="submit"
          disabled={busy || !batch.trim()}
          className={PRESS}
        >
          Add batch
        </Button>
      </SheetFooter>
    </form>
  );
}
