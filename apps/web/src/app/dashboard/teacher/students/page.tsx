import type { Metadata } from "next";
import { TeacherStudents } from "@/components/teacher/teacher-students";

export const metadata: Metadata = {
  title: "My Students",
};

export default function Page() {
  return <TeacherStudents />;
}
