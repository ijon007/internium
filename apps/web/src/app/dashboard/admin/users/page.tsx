import type { Metadata } from "next";
import { AdminUsers } from "@/components/admin/admin-users";

export const metadata: Metadata = {
  title: "Users",
  description: "Search, filter, and manage Internium accounts.",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
