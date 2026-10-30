import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";

export const metadata: Metadata = {
  title: "Teacher",
};

export default function Page() {
  return <TeacherDashboard />;
}
