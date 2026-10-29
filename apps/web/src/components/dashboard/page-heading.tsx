import type { ReactNode } from "react";

export function PageHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-heading text-lg font-medium tracking-tight">{children}</h1>
  );
}
