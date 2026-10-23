import {
  ArchiveIcon,
  BellIcon,
  BuildingsIcon,
  CalendarCheckIcon,
  ChalkboardTeacherIcon,
  ChartBarIcon,
  ChatCircleIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  DatabaseIcon,
  FileMagnifyingGlassIcon,
  FilePlusIcon,
  FilesIcon,
  FileTextIcon,
  GearIcon,
  HandshakeIcon,
  IdentificationCardIcon,
  KeyIcon,
  SquaresFourIcon,
  StudentIcon,
  UserCircleIcon,
  UserMinusIcon,
  UsersIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import type { Role } from "@/constants/roles";
import type { NavGroup, NavItem } from "@/types/navigation";

export const ICON_WEIGHT = "fill";

export const SHARED_NAV: NavItem[] = [
  { title: "Chat", path: "chat", icon: ChatCircleIcon },
  { title: "Notifications", path: "notifications", icon: BellIcon },
];

export const ACCOUNT_NAV: NavItem[] = [
  { title: "Settings", path: "settings", icon: GearIcon },
  { title: "Profile", path: "profile", icon: UserCircleIcon },
];

const OVERVIEW_GROUP: NavGroup = {
  label: "Overview",
  items: [{ title: "Dashboard", path: "", icon: SquaresFourIcon }],
};

export const ROLE_NAV: Record<Role, NavGroup[]> = {
  admin: [
    OVERVIEW_GROUP,
    {
      label: "Management",
      items: [
        { title: "Users", path: "users", icon: UsersIcon },
        { title: "Roles & Credentials", path: "roles", icon: KeyIcon },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Backup", path: "backup", icon: DatabaseIcon },
        { title: "Activity Log", path: "activity-log", icon: ClockCounterClockwiseIcon },
      ],
    },
  ],
  coordinator: [
    OVERVIEW_GROUP,
    {
      label: "People",
      items: [
        { title: "Classes", path: "classes", icon: UsersThreeIcon },
        { title: "Students", path: "students", icon: StudentIcon },
        { title: "Teachers", path: "teachers", icon: ChalkboardTeacherIcon },
      ],
    },
    {
      label: "Companies",
      items: [
        { title: "Companies", path: "companies", icon: BuildingsIcon },
        { title: "Assignments", path: "assignments", icon: HandshakeIcon },
      ],
    },
    {
      label: "Documents",
      items: [
        { title: "Documents Overview", path: "documents", icon: FilesIcon },
        { title: "Generate Documents", path: "generate-documents", icon: FilePlusIcon },
      ],
    },
    {
      label: "Records",
      items: [
        { title: "Reports", path: "reports", icon: ChartBarIcon },
        { title: "Archive", path: "archive", icon: ArchiveIcon },
      ],
    },
  ],
  teacher: [
    OVERVIEW_GROUP,
    {
      label: "My Students",
      items: [
        { title: "My Classes", path: "classes", icon: UsersThreeIcon },
        { title: "Student Profile", path: "students", icon: IdentificationCardIcon },
      ],
    },
    {
      label: "Work",
      items: [
        { title: "Documents to Review", path: "review", icon: FileMagnifyingGlassIcon },
        { title: "Absences", path: "absences", icon: UserMinusIcon },
      ],
    },
  ],
  student: [
    OVERVIEW_GROUP,
    {
      label: "Me",
      items: [{ title: "My Data", path: "my-data", icon: IdentificationCardIcon }],
    },
    {
      label: "Practice",
      items: [
        { title: "My Documents", path: "documents", icon: FileTextIcon },
        { title: "My Absences", path: "absences", icon: UserMinusIcon },
      ],
    },
  ],
  "business-mentor": [
    OVERVIEW_GROUP,
    {
      label: "Students",
      items: [
        { title: "My Students", path: "students", icon: StudentIcon },
        { title: "Student Documents", path: "documents", icon: ClipboardTextIcon },
      ],
    },
    {
      label: "Attendance",
      items: [{ title: "Weekly Attendance", path: "attendance", icon: CalendarCheckIcon }],
    },
  ],
};
