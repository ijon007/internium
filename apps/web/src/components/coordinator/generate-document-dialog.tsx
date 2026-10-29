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
      <DialogContent className="gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="gap-3 border-b px-5 pt-5 pb-4">
          <div className="flex flex-col gap-1">
            <DialogTitle>Generate document</DialogTitle>
            <DialogDescription>
              {step === 0
                ? "Pick the template to fill in."
                : step === 1
                  ? "Choose who gets a copy."
                  : `${selected.length} ${selected.length === 1 ? "document" : "documents"} ready, each with a verification QR.`}
            </DialogDescription>
          </div>
          <ol className="flex items-center gap-2 text-xs">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                <span
                  className={cn(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    i <= step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[10px] tabular-nums transition-colors",
                      i < step
                        ? "bg-primary text-primary-foreground"
                        : i === step
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i < step ? <CheckIcon weight="bold" className="size-3" /> : i + 1}
                  </span>
                  {label}
                </span>
                {i < STEPS.length - 1 ? (
                  <span
                    className={cn(
                      "h-px flex-1 transition-colors",
                      i < step ? "bg-primary" : "bg-border",
                    )}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto p-5 text-xs">
          {step === 0 ? (
            <div role="radiogroup" aria-label="Template" className="grid gap-2 sm:grid-cols-2">
              {DOCUMENT_TEMPLATES.map((t) => {
                const on = template === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      PRESS,
                      on ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{t.label}</p>
                      <p className="mt-0.5 text-muted-foreground">{t.description}</p>
                    </div>
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                    >
                      {on ? <CheckIcon weight="bold" className="size-2.5" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>
                  {picked.length} of {students.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={PRESS}
                  onClick={() =>
                    setPicked(picked.length === students.length ? [] : students.map((s) => s.id))
                  }
                >
                  {picked.length === students.length ? "Clear all" : "Select all"}
                </Button>
              </div>
              <ul className="overflow-hidden rounded-lg border">
                {students.map((s) => (
                  <li key={s.id} className="border-b last:border-b-0">
                    <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50">
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
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {selected.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">{chosen?.label}</p>
                    <p className="font-medium">{s.name}</p>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className="h-1 w-32 rounded-full bg-muted" />
                      <span className="h-1 w-24 rounded-full bg-muted" />
                      <span className="h-1 w-28 rounded-full bg-muted" />
                    </div>
                  </div>
                  <PlaceholderQr seed={`${template}-${s.id}`} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <DialogFooter className="m-0 flex-row justify-end gap-2 rounded-b-xl border-t px-5 py-3">
          {step > 0 ? (
            <Button variant="outline" className={PRESS} onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : null}
          {step < 2 ? (
            <Button
              className={PRESS}
              disabled={step === 1 && picked.length === 0}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              className={PRESS}
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
