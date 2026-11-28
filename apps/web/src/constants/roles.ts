export const ROLES = [
  "admin",
  "coordinator",
  "teacher",
  "student",
  "business-mentor",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  coordinator: "Coordinator",
  teacher: "Teacher",
  student: "Student",
  "business-mentor": "Business Mentor",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  student: "Your internship, documents, and absences.",
  teacher: "Your students, their documents, and absences.",
  coordinator: "People, companies, and placements.",
  admin: "Users, access, and school operations.",
  "business-mentor": "Workplace students and weekly attendance.",
};

export const ROLE_PICKER_ORDER: Role[] = [
  "student",
  "teacher",
  "coordinator",
  "business-mentor",
  "admin",
];

export const DASHBOARD_PATH = "/dashboard";

export const SETTINGS_PATH = `${DASHBOARD_PATH}/settings`;

export const LAST_ROLE_STORAGE_KEY = "internium:last-role:v1";

export const ROLE_PATH = "/role";

/** ponytail: two-dev allowlist so we can open any role UI without swapping accounts. Drop when impersonation exists. */
const DEV_ROLE_SWITCH_EMAILS = new Set([
  "zuriqienea@gmail.com",
  "kushta.joni@gmail.com",
]);

export function canSwitchDashboardRoles(email: string | undefined) {
  return Boolean(
    email && DEV_ROLE_SWITCH_EMAILS.has(email.trim().toLowerCase()),
  );
}
