import type { Role } from "@/constants/roles";

export type AdminActivityAction =
  | "created-user"
  | "changed-role"
  | "reset-password"
  | "deactivated-user"
  | "reactivated-user"
  | "ran-backup";

export type AdminActivity = {
  id: string;
  at: string;
  actor: string;
  action: AdminActivityAction;
  target: string;
};

export const ADMIN_ACTIVITY_LABELS: Record<AdminActivityAction, string> = {
  "created-user": "Created user",
  "changed-role": "Changed role",
  "reset-password": "Reset password",
  "deactivated-user": "Deactivated",
  "reactivated-user": "Reactivated",
  "ran-backup": "Ran backup",
};

export const ADMIN_STATS = {
  totalUsers: 189,
  activeUsers: 176,
  usersByRole: {
    student: 142,
    teacher: 18,
    coordinator: 4,
    "business-mentor": 22,
    admin: 3,
  } satisfies Record<Role, number>,
};

export const ADMIN_BACKUP = {
  at: "2026-10-28T04:12:00.000Z",
  size: "24.6 MB",
  status: "Complete" as const,
};

export const ADMIN_ACTIVITY: AdminActivity[] = [
  {
    id: "act-1",
    at: "2026-10-29T07:41:00.000Z",
    actor: "Jane Doe",
    action: "created-user",
    target: "Noah Keller",
  },
  {
    id: "act-2",
    at: "2026-10-29T07:18:00.000Z",
    actor: "Jane Doe",
    action: "changed-role",
    target: "Mira Santos → Teacher",
  },
  {
    id: "act-3",
    at: "2026-10-28T16:04:00.000Z",
    actor: "System",
    action: "ran-backup",
    target: "Nightly snapshot",
  },
  {
    id: "act-4",
    at: "2026-10-28T14:22:00.000Z",
    actor: "Jane Doe",
    action: "reset-password",
    target: "Eli Marin",
  },
  {
    id: "act-5",
    at: "2026-10-28T11:09:00.000Z",
    actor: "Lena Vogt",
    action: "deactivated-user",
    target: "Guest trainer",
  },
  {
    id: "act-6",
    at: "2026-10-27T09:55:00.000Z",
    actor: "Jane Doe",
    action: "reactivated-user",
    target: "Sofia Berg",
  },
  {
    id: "act-7",
    at: "2026-10-27T08:12:00.000Z",
    actor: "Jane Doe",
    action: "created-user",
    target: "Acme Mentors",
  },
  {
    id: "act-8",
    at: "2026-10-26T18:40:00.000Z",
    actor: "System",
    action: "ran-backup",
    target: "Manual snapshot",
  },
];
