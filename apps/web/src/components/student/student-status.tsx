import { Badge } from "@internium/ui/components/badge";
import {
  STUDENT_STATUS_LABELS,
  type StudentDocStatus,
} from "@/constants/student";
import { cn } from "@/lib/utils";

/** One palette for every student surface: grey, violet, blue, green, red. */
export const STUDENT_STATUS_STYLES: Record<StudentDocStatus, string> = {
  missing: "bg-muted text-muted-foreground",
  generated: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  uploaded: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  returned: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export const STUDENT_STATUS_DOT: Record<StudentDocStatus, string> = {
  missing: "bg-muted-foreground/40",
  generated: "bg-violet-500",
  uploaded: "bg-sky-500",
  approved: "bg-emerald-500",
  returned: "bg-red-500",
};

export function StudentStatusBadge({
  status,
  className,
}: {
  status: StudentDocStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(STUDENT_STATUS_STYLES[status], className)}
    >
      {STUDENT_STATUS_LABELS[status]}
    </Badge>
  );
}
