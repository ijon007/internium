import type { Metadata } from "next";
import { TeacherDocuments } from "@/components/teacher/teacher-documents";

export const metadata: Metadata = {
  title: "Documents",
};

export default function Page() {
  return <TeacherDocuments />;
}
