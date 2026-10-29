import {
  BuildingsIcon,
  CalendarCheckIcon,
  ChatCircleIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  DatabaseIcon,
  FileMagnifyingGlassIcon,
  FilesIcon,
  FileTextIcon,
  IdentificationCardIcon,
  SquaresFourIcon,
  StudentIcon,
  UserMinusIcon,
  UsersIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import type { Role } from "@/constants/roles";
import type { NavGroup, NavItem } from "@/types/navigation";

export const ICON_WEIGHT = "fill";

export const SHARED_NAV: NavItem[] = [
  { title: "Chat", path: "chat", icon: ChatCircleIcon },
];

const OVERVIEW_GROUP: NavGroup = {
  label: "Overview",
  items: [{ title: "Dashboard", path: "", icon: SquaresFourIcon }],
};

export const ROLE_NAV: Record<Role, NavGroup[]> = {
  admin: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", path: "", icon: SquaresFourIcon },
        { title: "Users", path: "users", icon: UsersIcon },
        { title: "Backup", path: "backup", icon: DatabaseIcon },
        {
          title: "Activity Log",
          path: "activity-log",
          icon: ClockCounterClockwiseIcon,
        },
      ],
    },
  ],
  coordinator: [
    {
      label: "Coordinator",
      items: [
        { title: "Dashboard", path: "", icon: SquaresFourIcon },
        { title: "Classes", path: "classes", icon: UsersThreeIcon },
        { title: "Students", path: "students", icon: StudentIcon },
        { title: "Companies", path: "companies", icon: BuildingsIcon },
        { title: "Documents", path: "documents", icon: FilesIcon },
      ],
    },
  ],
  teacher: [    OVERVIEW_GROUP,
    {
      label: "My Students",
      items: [
        { title: "My Classes", path: "classes", icon: UsersThreeIcon },
        {
          title: "Student Profile",
          path: "students",
          icon: IdentificationCardIcon,
        },
      ],
    },
    {
      label: "Work",
      items: [
        {
          title: "Documents to Review",
          path: "review",
          icon: FileMagnifyingGlassIcon,
        },
        { title: "Absences", path: "absences", icon: UserMinusIcon },
      ],
    },
  ],
  student: [
    OVERVIEW_GROUP,
    {
      label: "Me",
      items: [
        { title: "My Data", path: "my-data", icon: IdentificationCardIcon },
      ],
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
        {
          title: "Student Documents",
          path: "documents",
          icon: ClipboardTextIcon,
        },
      ],
    },
    {
      label: "Attendance",
      items: [
        {
          title: "Weekly Attendance",
          path: "attendance",
          icon: CalendarCheckIcon,
        },
      ],
    },
  ],
};
