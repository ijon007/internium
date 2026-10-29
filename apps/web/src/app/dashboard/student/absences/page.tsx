import type { Metadata } from "next";
import { StudentAbsences } from "@/components/student/student-absences";

export const metadata: Metadata = {
  title: "My Absences",
};

export default function Page() {
  return <StudentAbsences />;
}