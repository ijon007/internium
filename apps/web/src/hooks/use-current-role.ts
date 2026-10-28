"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Role } from "@/constants/roles";
import {
  getRoleSegment,
  readLastRole,
  writeLastRole,
} from "@/utils/navigation";

export function useCurrentRole(): Role {
  const pathname = usePathname();
  const pathRole = getRoleSegment(pathname);
  const [lastRole, setLastRole] = useState<Role>(pathRole ?? "student");

  if (pathRole && pathRole !== lastRole) {
    setLastRole(pathRole);
  }

  useEffect(() => {
    if (pathRole) {
      writeLastRole(pathRole);
      return;
    }
    setLastRole(readLastRole());
  }, [pathRole]);

  return pathRole ?? lastRole;
}
