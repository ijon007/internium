import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = {
  title: "Users",
  description: "Search, filter, and manage Internium accounts.",
};

export default function AdminUsersPage() {
  return (
    <AdminPlaceholder
      title="Users"
      description="User management is coming next. Search, role and status filters, and add or edit in a sheet."
    />
  );
}
