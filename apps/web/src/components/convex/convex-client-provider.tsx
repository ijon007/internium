"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@internium/backend/convex/_generated/api";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type ReactNode, useEffect, useRef, useState } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }
    const nextClient = new ConvexReactClient(url);
    setClient(nextClient);
    return () => {
      void nextClient.close();
    };
  }, [url]);

  if (!client) {
    return children;
  }

  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      <StoreUserOnSignIn />
      {children}
    </ConvexProviderWithClerk>
  );
}

function StoreUserOnSignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const store = useMutation(api.users.store);
  const storedForSession = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      storedForSession.current = false;
      return;
    }
    if (storedForSession.current) {
      return;
    }

    let cancelled = false;
    store()
      .then(() => {
        if (!cancelled) {
          storedForSession.current = true;
        }
      })
      .catch(() => {
        // Auth may not be ready on the first attempt; a later render retries.
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, store]);

  return null;
}
