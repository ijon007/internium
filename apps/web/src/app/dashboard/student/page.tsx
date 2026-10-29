import type { Metadata } from "next";
import { StudentDashboard } from "@/components/student/student-dashboard";

export const metadata: Metadata = {
  title: "Student",
};

export default function Page() {
  return <StudentDashboard />;
}