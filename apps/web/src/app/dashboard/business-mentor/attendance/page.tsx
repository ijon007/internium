import type { Metadata } from "next";
import { MentorAttendance } from "@/components/business-mentor/mentor-attendance";

export const metadata: Metadata = {
  title: "Attendance",
};

export default function Page() {
  return <MentorAttendance />;
}
