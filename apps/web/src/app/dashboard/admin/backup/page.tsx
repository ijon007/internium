import type { Metadata } from "next";
import { AdminBackup } from "@/components/admin/admin-backup";

export const metadata: Metadata = {
  title: "Backup",
  description: "Run and download Internium backups.",
};

export default function AdminBackupPage() {
  return <AdminBackup />;
}
