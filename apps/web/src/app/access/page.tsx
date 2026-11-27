import { Suspense } from "react";
import { AccessRequest } from "@/components/auth/access-request";

export default function AccessPage() {
  return (
    <Suspense>
      <AccessRequest />
    </Suspense>
  );
}
