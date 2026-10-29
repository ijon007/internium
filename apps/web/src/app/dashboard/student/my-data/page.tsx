import type { Metadata } from "next";
import { StudentMyData } from "@/components/student/student-my-data";

export const metadata: Metadata = {
  title: "My Data",
};

export default function Page() {
  return <StudentMyData />;
}