import {
  DASHBOARD_PATH,
  LAST_ROLE_STORAGE_KEY,
  ROLES,
  type Role,
  SETTINGS_PATH,
} from "@/constants/roles";

export function isRole(value: string | undefined): value is Role {
  return ROLES.includes(value as Role);
}

export function getRoleSegment(pathname: string): Role | null {
  const segment = pathname.replace(DASHBOARD_PATH, "").split("/")[1];
  return isRole(segment) ? segment : null;
}

export function getRoleFromPathname(pathname: string): Role {
  return getRoleSegment(pathname) ?? "student";
}

export function getRoleHref(role: Role, path: string): string {
  return [DASHBOARD_PATH, role, path].filter(Boolean).join("/");
}

export function isSettingsPath(pathname: string): boolean {
  return pathname === SETTINGS_PATH || pathname.startsWith(`${SETTINGS_PATH}/`);
}

export function getSettingsHref(category = ""): string {
  return [SETTINGS_PATH, category].filter(Boolean).join("/");
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href;
}

export function readLastRole(): Role {
  try {
    const value = sessionStorage.getItem(LAST_ROLE_STORAGE_KEY);
    if (isRole(value ?? undefined)) return value;
  } catch {
    // ponytail: sessionStorage throws in some private-mode browsers
  }
  return "student";
}

export function writeLastRole(role: Role): void {
  try {
    sessionStorage.setItem(LAST_ROLE_STORAGE_KEY, role);
  } catch {
    // ponytail: same private-mode ceiling as readLastRole
  }
}
