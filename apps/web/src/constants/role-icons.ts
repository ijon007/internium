import {
  BuildingsIcon,
  ChalkboardTeacherIcon,
  ShieldCheckIcon,
  StudentIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import type { Role } from "@/constants/roles";

export const ROLE_ICONS: Record<Role, typeof StudentIcon> = {
  student: StudentIcon,
  teacher: ChalkboardTeacherIcon,
  coordinator: UsersThreeIcon,
  admin: ShieldCheckIcon,
  "business-mentor": BuildingsIcon,
};
