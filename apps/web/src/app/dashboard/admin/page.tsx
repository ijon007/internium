import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for managing Internium.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
