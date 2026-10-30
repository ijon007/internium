"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Calendar } from "@internium/ui/components/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import { Field, FieldGroup, FieldLabel } from "@internium/ui/components/field";
import { Popover, PopoverContent, PopoverTrigger } from "@internium/ui/components/popover";
import { Textarea } from "@internium/ui/components/textarea";
import { CalendarBlankIcon, UserMinusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { PRESS } from "@/components/admin/admin-table";
import { dateFormat } from "@/lib/date-format";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function AddAbsenceDialog({
  open,
  studentName,
  onClose,
  onAdd,
}: {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onAdd: (date: string, reason: string) => void;
}) {
  const [date, setDate] = useState(() => ymd(new Date()));
  const [reason, setReason] = useState("");
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(ymd(new Date()));
    setReason("");
  }, [open]);

  const selected = new Date(`${date}T00:00:00`);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add absence</DialogTitle>
          <DialogDescription>Recorded by you for {studentName}.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Popover open={picking} onOpenChange={setPicking}>
              <PopoverTrigger
                render={<Button variant="outline" className={cn("w-full justify-start gap-1.5 font-normal tabular-nums", PRESS)} />}
              >
                <CalendarBlankIcon weight={ICON_WEIGHT} className="text-muted-foreground" />
                {dateFormat({ day: "numeric", month: "short", year: "numeric" }).format(selected)}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selected}
                  defaultMonth={selected}
                  disabled={{ after: new Date() }}
                  onSelect={(d) => {
                    if (!d) return;
                    setDate(ymd(d));
                    setPicking(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="absence-reason">Reason</FieldLabel>
            <Textarea
              id="absence-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Sick, doctor appointment"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="ghost" className={PRESS} onClick={onClose}>
            Cancel
          </Button>
          <Button className={PRESS} disabled={!reason.trim()} onClick={() => onAdd(date, reason.trim())}>
            <UserMinusIcon weight={ICON_WEIGHT} />
            Add absence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
