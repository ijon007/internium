"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

export function useAccountProfile() {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const current = useQuery(
    api.users.current,
    user && isAuthenticated ? {} : "skip",
  );
  const profile = user && current?.clerkId === user.id ? current : null;

  return {
    user,
    ready: Boolean(profile?.role && profile.status !== "inactive"),
    name: profile?.name || user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress ?? profile?.email ?? "",
    avatar: user?.hasImage ? user.imageUrl : "",
    phone: profile?.phone ?? "",
    role: profile?.role,
  };
}
