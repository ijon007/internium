import { Badge } from "@internium/ui/components/badge";
import {
  DOCUMENT_STATUS_LABELS,
  type DocumentStatus,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";

export const DOCUMENT_STATUS_STYLES: Record<DocumentStatus, string> = {
  missing: "bg-muted text-muted-foreground",
  uploaded: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  returned: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

export function DocumentStatusBadge({
  status,
  className,
}: {
  status: DocumentStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(DOCUMENT_STATUS_STYLES[status], className)}
    >
      {DOCUMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
