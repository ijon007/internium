"use client";

import { Button } from "@internium/ui/components/button";
import { Checkbox } from "@internium/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@internium/ui/components/dialog";
import { CheckIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PRESS } from "@/components/admin/admin-table";
import { ICON_WEIGHT } from "@/constants/navigation";
import {
  CLASSES,
  DOCUMENT_TEMPLATES,
  type Student,
} from "@/constants/coordinator";
import { cn } from "@/lib/utils";

const STEPS = ["Template", "Students", "Preview"] as const;

function PlaceholderQr({ seed }: { seed: string }) {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const cells: boolean[] = [];
  for (let i = 0; i < 121; i++) {
    hash = (hash * 1103515245 + 12345) | 0;
    cells.push(((hash >>> 16) & 1) === 1);
  }
  const finder = (x: number, y: number) =>
    (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
  return (
    <svg viewBox="0 0 11 11" className="size-14" role="img" aria-label="QR code">
      {cells.map((on, i) => {
        const x = i % 11;
        const y = Math.floor(i / 11);
        return on || finder(x, y) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static grid
          <rect key={i} x={x} y={y} width={1} height={1} className="fill-foreground" />
        ) : null;
      })}
    </svg>
  );
}

export function GenerateDocumentDialog({
  open,
  onOpenChange,
  students,
  initialStudentIds = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  initialStudentIds?: string[];
}) {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<string>(DOCUMENT_TEMPLATES[0].id);
  const [picked, setPicked] = useState<string[]>(initialStudentIds);
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setPicked(initialStudentIds);
    // biome-ignore lint/correctness/useExhaustiveDependencies: sync on open only
  }, [open]);
  const chosen = DOCUMENT_TEMPLATES.find((t) => t.id === template);
  const selected = students.filter((s) => picked.includes(s.id));

  function close(next: boolean) {
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate document</DialogTitle>
          <DialogDescription>
            <span className="flex items-center gap-1.5">
              {STEPS.map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    "flex items-center gap-1",
                    i === step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums",
                      i < step
                        ? "bg-primary text-primary-foreground"
                        : i === step
                          ? "bg-foreground text-background"
                          : "bg-muted",
                    )}
                  >
                    {i < step ? (
                      <CheckIcon weight={ICON_WEIGHT} className="size-2.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {label}
                  {i < STEPS.length - 1 ? (
                    <span className="text-muted-foreground">·</span>
                  ) : null}
                </span>
              ))}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto text-xs">
          {step === 0 ? (
            <ul className="flex flex-col gap-1.5">
              {DOCUMENT_TEMPLATES.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left ring-1 transition-colors",
                      PRESS,
                      template === t.id
                        ? "bg-primary/10 ring-primary"
                        : "ring-border hover:bg-muted/50",
                    )}
                  >
                    <p className="font-medium">{t.label}</p>
                    <p className="text-muted-foreground">{t.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {step === 1 ? (
            <ul className="rounded-lg bg-muted/50">
              {students.map((s, i) => (
                <li
                  key={s.id}
                  className={cn(i < students.length - 1 && "border-b border-border/70")}
                >
                  <label className="flex cursor-pointer items-center gap-2 px-3 py-2">
                    <Checkbox
                      checked={picked.includes(s.id)}
                      onCheckedChange={(checked) =>
                        setPicked((cur) =>
                          checked ? [...cur, s.id] : cur.filter((id) => id !== s.id),
                        )
                      }
                    />
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-auto text-muted-foreground">
                      {CLASSES.find((c) => c.id === s.classId)?.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-2">
              {selected.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-3 rounded-lg bg-card p-3 ring-1 ring-border"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">{chosen?.label}</p>
                    <p className="font-medium">{s.name}</p>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className="h-1 w-40 rounded-full bg-muted" />
                      <span className="h-1 w-32 rounded-full bg-muted" />
                      <span className="h-1 w-36 rounded-full bg-muted" />
                    </div>
                  </div>
                  <PlaceholderQr seed={`${template}-${s.id}`} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-row gap-2">
          {step > 0 ? (
            <Button variant="outline" className={PRESS} onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : null}
          {step < 2 ? (
            <Button
              className={cn("ml-auto", PRESS)}
              disabled={step === 1 && picked.length === 0}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              className={cn("ml-auto", PRESS)}
              onClick={() => {
                toast.success(
                  `${selected.length} ${selected.length === 1 ? "document" : "documents"} downloaded`,
                );
                close(false);
              }}
            >
              <DownloadSimpleIcon weight={ICON_WEIGHT} />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
