import {
  BuildingsIcon,
  CalendarCheckIcon,
  ChatCircleIcon,
  ClockCounterClockwiseIcon,
  DatabaseIcon,
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
  teacher: [
    {
      label: "Teacher",
      items: [
        { title: "Dashboard", path: "", icon: SquaresFourIcon },
        { title: "My Students", path: "students", icon: StudentIcon },
        { title: "Documents", path: "documents", icon: FilesIcon },
      ],
    },
  ],
  student: [
    {
      label: "Student",
      items: [
        { title: "Dashboard", path: "", icon: SquaresFourIcon },
        { title: "My Data", path: "my-data", icon: IdentificationCardIcon },
        { title: "My Documents", path: "documents", icon: FileTextIcon },
        { title: "My Absences", path: "absences", icon: UserMinusIcon },
      ],
    },
  ],
  "business-mentor": [
    {
      label: "Business Mentor",
      items: [
        { title: "Dashboard", path: "", icon: SquaresFourIcon },
        { title: "My Students", path: "students", icon: StudentIcon },
        { title: "Attendance", path: "attendance", icon: CalendarCheckIcon },
      ],
    },
  ],
};
