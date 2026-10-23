import { DASHBOARD_PATH, ROLES, type Role } from "@/constants/roles";

export function isRole(value: string | undefined): value is Role {
  return ROLES.includes(value as Role);
}

export function getRoleFromPathname(pathname: string): Role {
  const segment = pathname.replace(DASHBOARD_PATH, "").split("/")[1];
  return isRole(segment) ? segment : "student";
}

export function getRoleHref(role: Role, path: string): string {
  return [DASHBOARD_PATH, role, path].filter(Boolean).join("/");
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href;
}