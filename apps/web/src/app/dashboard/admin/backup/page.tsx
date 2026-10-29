import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export const metadata: Metadata = {
  title: "Backup",
  description: "Run and download Internium backups.",
};

export default function AdminBackupPage() {
  return (
    <AdminPlaceholder
      title="Backup"
      description="Backup history and restore will live here. Use Run backup on the dashboard for now."
    />
  );
}
