import type { Metadata } from "next";
import { MentorStudents } from "@/components/business-mentor/mentor-students";

export const metadata: Metadata = {
  title: "My Students",
};

export default function Page() {
  return <MentorStudents />;
}
