"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@/constants/roles";
import { getRoleFromPathname } from "@/utils/navigation";

export function useCurrentRole(): Role {
  return getRoleFromPathname(usePathname());
}
