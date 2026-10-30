"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import { Field, FieldLabel } from "@internium/ui/components/field";
import { Textarea } from "@internium/ui/components/textarea";
import { CheckIcon, UserMinusIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PRESS } from "@/components/admin/admin-table";
import { statusVars } from "@/components/status-badge";
import {
  ABSENCE_REASONS,
  type AttendanceEntry,
  weekEnd,
} from "@/constants/business-mentor";
import { useRetained } from "@/hooks/use-retained";
import { setAttendance } from "@/lib/attendance-store";
import { dateFormat } from "@/lib/date-format";
import { cn } from "@/lib/utils";

const DAY_MONTH = dateFormat({ day: "numeric", month: "short", timeZone: "UTC" });
const DAY_MONTH_YEAR = dateFormat({ day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "26 Oct – 30 Oct 2026" for the Monday–Friday of a week. */
export function weekLabel(week: string) {
  return `${DAY_MONTH.format(new Date(`${week}T00:00:00Z`))} – ${DAY_MONTH_YEAR.format(new Date(`${weekEnd(week)}T00:00:00Z`))}`;
}

type Target = { studentId: string; name: string; week: string; reason?: string };

/**
 * Present marks instantly; Absent asks for a reason first, then (mock) notifies the teacher.
 * Shared by the dashboard and the attendance page so both write the same session store.
 */
export function useMarkAttendance() {
  const [target, setTarget] = useState<Target | null>(null);

  function markPresent(studentId: string, name: string, week: string, previous: AttendanceEntry) {
    setAttendance([{ studentId, week, entry: { status: "present" } }]);
    toast.success("Marked present", {
      description: `${name} · ${weekLabel(week)}`,
      action: {
        label: "Undo",
        onClick: () => setAttendance([{ studentId, week, entry: previous }]),
      },
    });
  }

  const dialog = (
    <AbsentDialog
      target={target}
      onClose={() => setTarget(null)}
      onConfirm={(reason) => {
        if (!target) return;
        setAttendance([{ studentId: target.studentId, week: target.week, entry: { status: "absent", reason } }]);
        toast.success("Teacher notified", { description: `${target.name} absent · ${reason}` });
        setTarget(null);
      }}
    />
  );

  return { markPresent, askAbsent: setTarget, dialog };
}

function AbsentDialog({
  target,
  onClose,
  onConfirm,
}: {
  target: Target | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const shown = useRetained(target);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (target) setReason(target.reason ?? "");
  }, [target]);

  const valid = reason.trim().length > 0;

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mark absent</DialogTitle>
          <DialogDescription>
            {shown ? `${shown.name} · ${weekLabel(shown.week)}. The teacher is notified.` : null}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onConfirm(reason.trim());
          }}
        >
          <Field>
            <FieldLabel htmlFor="absent-reason">Reason</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {ABSENCE_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    "h-6 rounded-full px-2.5 text-[11px] font-medium ring-1 ring-border duration-150",
                    "transition-[background-color,color,transform] ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-muted",
                    reason === r && "bg-foreground text-background ring-foreground [@media(hover:hover)]:hover:bg-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <Textarea
              id="absent-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Required, e.g. sick, doctor appointment"
              className="min-h-16"
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" className={PRESS} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" className={PRESS} disabled={!valid}>
              <UserMinusIcon weight={ICON_WEIGHT} />
              Mark absent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Compact Present / Absent pair. The current choice is shown pressed; clicking Absent again edits the reason. */
export function AttendanceButtons({
  entry,
  disabled,
  onPresent,
  onAbsent,
}: {
  entry: AttendanceEntry;
  disabled?: boolean;
  onPresent: () => void;
  onAbsent: () => void;
}) {
  const present = entry.status === "present";
  const absent = entry.status === "absent";
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant={present ? "secondary" : "outline"}
        aria-pressed={present}
        disabled={disabled || present}
        onClick={onPresent}
        className={cn(PRESS, "disabled:opacity-100", present && "status-tint")}
        style={present ? statusVars("present") : undefined}
      >
        <CheckIcon weight={ICON_WEIGHT} />
        Present
      </Button>
      <Button
        size="sm"
        variant={absent ? "secondary" : "outline"}
        aria-pressed={absent}
        disabled={disabled}
        onClick={onAbsent}
        className={cn(PRESS, absent && "status-tint")}
        style={absent ? statusVars("absent") : undefined}
      >
        <XIcon weight={ICON_WEIGHT} />
        Absent
      </Button>
    </div>
  );
}
