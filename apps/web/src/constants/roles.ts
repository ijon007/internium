export const ROLES = ["admin", "coordinator", "teacher", "student", "business-mentor"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  coordinator: "Coordinator",
  teacher: "Teacher",
  student: "Student",
  "business-mentor": "Business Mentor",
};

export const DASHBOARD_PATH = "/dashboard";

export const ROLE_PATH = "/role";
