"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type ReactNode, useEffect } from "react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!client) return children;

  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      <StoreUserOnSignIn />
      {children}
    </ConvexProviderWithClerk>
  );
}

function StoreUserOnSignIn() {
  const { isAuthenticated } = useConvexAuth();
  const store = useMutation(api.users.store);

  useEffect(() => {
    if (isAuthenticated) {
      void store().catch(() => {
        // The access page retries and displays an error if setup fails.
      });
    }
  }, [isAuthenticated, store]);

  return null;
}
