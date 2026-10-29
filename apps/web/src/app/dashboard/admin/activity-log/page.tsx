import type { Metadata } from "next";
import { AdminActivityLog } from "@/components/admin/admin-activity-log";

export const metadata: Metadata = {
  title: "Activity Log",
  description: "Read-only record of admin and user actions.",
};

export default function AdminActivityLogPage() {
  return <AdminActivityLog />;
}
