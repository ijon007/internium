import type { Role } from "@/constants/roles";

export type AdminUserStatus = "active" | "inactive";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AdminUserStatus;
  createdAt: string;
  className?: string;
  company?: string;
};

export const ADMIN_CLASSES = ["12A", "12B", "13A", "13B"] as const;

export const ADMIN_USERS: AdminUser[] = [
  { id: "u-1", name: "Jane Doe", email: "jane.doe@internium.app", role: "admin", status: "active", createdAt: "2025-09-01T08:00:00.000Z" },
  { id: "u-2", name: "Lena Vogt", email: "lena.vogt@internium.app", role: "coordinator", status: "active", createdAt: "2025-09-02T08:00:00.000Z" },
  { id: "u-3", name: "Mira Santos", email: "mira.santos@internium.app", role: "teacher", status: "active", createdAt: "2025-09-04T08:00:00.000Z" },
  { id: "u-4", name: "Noah Keller", email: "noah.keller@internium.app", role: "student", status: "active", createdAt: "2026-10-29T07:41:00.000Z", className: "12A" },
  { id: "u-5", name: "Eli Marin", email: "eli.marin@internium.app", role: "student", status: "active", createdAt: "2026-02-11T08:00:00.000Z", className: "12B" },
  { id: "u-6", name: "Sofia Berg", email: "sofia.berg@internium.app", role: "student", status: "active", createdAt: "2026-01-20T08:00:00.000Z", className: "13A" },
  { id: "u-7", name: "Tom Richter", email: "tom@acmementors.com", role: "business-mentor", status: "active", createdAt: "2026-10-27T08:12:00.000Z", company: "Acme Mentors" },
  { id: "u-8", name: "Guest Trainer", email: "trainer@northwind.io", role: "business-mentor", status: "inactive", createdAt: "2026-03-05T08:00:00.000Z", company: "Northwind" },
  { id: "u-9", name: "Anna Weiss", email: "anna.weiss@internium.app", role: "teacher", status: "active", createdAt: "2025-09-06T08:00:00.000Z" },
  { id: "u-10", name: "Leo Brandt", email: "leo.brandt@internium.app", role: "student", status: "inactive", createdAt: "2025-10-14T08:00:00.000Z", className: "13B" },
];

export type AdminBackupStatus = "complete" | "failed" | "running";

export type AdminBackup = {
  id: string;
  at: string;
  size: string;
  status: AdminBackupStatus;
};

export const ADMIN_BACKUPS: AdminBackup[] = [
  { id: "b-1", at: "2026-10-28T04:12:00.000Z", size: "24.6 MB", status: "complete" },
  { id: "b-2", at: "2026-10-26T18:40:00.000Z", size: "24.3 MB", status: "complete" },
  { id: "b-3", at: "2026-10-25T04:10:00.000Z", size: "24.1 MB", status: "failed" },
  { id: "b-4", at: "2026-10-24T04:11:00.000Z", size: "23.9 MB", status: "complete" },
  { id: "b-5", at: "2026-10-21T04:09:00.000Z", size: "23.2 MB", status: "complete" },
  { id: "b-6", at: "2026-10-18T04:12:00.000Z", size: "22.8 MB", status: "complete" },
];
