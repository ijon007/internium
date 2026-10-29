import { StatusBadge } from "@/components/status-badge";
import type { DocumentStatus } from "@/constants/coordinator";

/** Cell tints for the coordinator documents grid. */
export const DOCUMENT_STATUS_STYLES: Record<DocumentStatus, string> = {
  missing: "bg-muted text-muted-foreground",
  uploaded: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  returned: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export function DocumentStatusBadge({
  status,
  className,
}: {
  status: DocumentStatus;
  className?: string;
}) {
  return <StatusBadge status={status} className={className} />;
}
