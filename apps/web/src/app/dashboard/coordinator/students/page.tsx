import type { Metadata } from "next";
import { CoordinatorStudents } from "@/components/coordinator/coordinator-students";

export const metadata: Metadata = {
  title: "Students",
};

export default function Page() {
  return <CoordinatorStudents />;
}
