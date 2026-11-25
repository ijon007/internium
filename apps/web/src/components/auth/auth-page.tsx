import type { ReactNode } from "react";
import { Suspense } from "react";

type AuthPageProps = {
  children: ReactNode;
};

// Clerk's SignIn/SignUp read request data, so they must sit under Suspense
// when cacheComponents is on. Renders a hint when Clerk keys are missing.
export function AuthPage({ children }: AuthPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <Suspense fallback={null}>{children}</Suspense>
      ) : (
        <p className="text-sm text-muted-foreground">
          Clerk is not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to
          enable sign in.
        </p>
      )}
    </main>
  );
}
