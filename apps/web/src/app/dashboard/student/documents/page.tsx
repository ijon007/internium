import type { Metadata } from "next";
import { StudentDocuments } from "@/components/student/student-documents";

export const metadata: Metadata = {
  title: "My Documents",
};

export default function Page() {
  return <StudentDocuments />;
}