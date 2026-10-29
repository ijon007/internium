import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = {
  title: "Activity Log",
  description: "Read-only record of admin and user actions.",
};

export default function AdminActivityLogPage() {
  return (
    <AdminPlaceholder
      title="Activity Log"
      description="The full log with user, action, and date filters will go here."
    />
  );
}
