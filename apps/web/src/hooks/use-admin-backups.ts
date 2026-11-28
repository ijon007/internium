"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function formatSize(bytes: number | undefined) {
  if (bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function useAdminBackups() {
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const history = useQuery(
    api.backups.history,
    isSignedIn && isAuthenticated ? {} : "skip",
  );
  const start = useMutation(api.backups.start);
  const [starting, setStarting] = useState(false);
  const [requested, setRequested] = useState<string>();
  const backups = (history ?? []).map((item) => ({
    ...item,
    size: formatSize(item.bytes),
  }));
  const running =
    starting || backups.some((backup) => backup.status === "running");

  const requestedStatus = history?.find(
    (item) => item.id === requested,
  )?.status;
  useEffect(() => {
    if (requestedStatus === "complete") {
      toast.success("Backup complete");
      setRequested(undefined);
    } else if (requestedStatus === "failed") {
      toast.error("Backup failed. Try again.");
      setRequested(undefined);
    }
  }, [requestedStatus]);

  async function runBackup() {
    if (history === undefined || running) return;
    setStarting(true);
    try {
      setRequested(await start({}));
    } catch {
      toast.error("Could not start the backup. Try again.");
    } finally {
      setStarting(false);
    }
  }

  return {
    backups,
    running,
    canStart: history !== undefined && !running,
    runBackup,
  };
}
