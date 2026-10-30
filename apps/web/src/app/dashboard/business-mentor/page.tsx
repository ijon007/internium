import type { Metadata } from "next";
import { MentorDashboard } from "@/components/business-mentor/mentor-dashboard";

export const metadata: Metadata = {
  title: "Business Mentor",
};

export default function Page() {
  return <MentorDashboard />;
}
