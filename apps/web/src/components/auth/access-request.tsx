"use client";

import { SignOutButton } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { Button } from "@internium/ui/components/button";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AccessRequest() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const store = useMutation(api.users.store);
  const requestAccess = useMutation(api.users.requestAccess);
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      void store().catch(() =>
        setError("Could not set up your account. Reload to try again."),
      );
    }
  }, [isAuthenticated, store]);

  const role = user?.role;
  useEffect(() => {
    if (!role) return;
    const destination = next?.startsWith(`/dashboard/${role}/`)
      ? next
      : `/dashboard/${role}`;
    router.replace(destination);
  }, [next, role, router]);

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      await requestAccess({});
    } catch {
      setError(
        "Could not send your request. Make sure your Clerk email is verified.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Internium access</h1>
      {isLoading || (isAuthenticated && !user && !error) || role ? (
        <p role="status">Checking your account…</p>
      ) : !isAuthenticated ? (
        <p role="alert">
          Could not verify your session with Convex. Sign out and try again.
        </p>
      ) : user?.requestedAt ? (
        <p role="status">Your request is waiting for administrator approval.</p>
      ) : (
        <>
          <p>Ask an administrator to assign you a role.</p>
          <Button onClick={submit} disabled={!user || submitting}>
            Request access
          </Button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <SignOutButton redirectUrl="/sign-in">
        <Button variant="outline">Sign out</Button>
      </SignOutButton>
    </main>
  );
}
