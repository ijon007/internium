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
import { Input } from "@internium/ui/components/input";
import {
  ArrowRightIcon,
  CheckIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
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
const TITLES = ["Choose a template", "Choose students", "Review and download"] as const;

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
    <svg viewBox="0 0 11 11" className="size-12" role="img" aria-label="QR code">
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
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setQuery("");
    setPicked(initialStudentIds);
    // biome-ignore lint/correctness/useExhaustiveDependencies: sync on open only
  }, [open]);
  const chosen = DOCUMENT_TEMPLATES.find((t) => t.id === template);
  const selected = students.filter((s) => picked.includes(s.id));
  const q = query.trim().toLowerCase();
  const visible = q ? students.filter((s) => s.name.toLowerCase().includes(q)) : students;
  const className = (s: Student) => CLASSES.find((c) => c.id === s.classId)?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-lg">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-1" aria-hidden>
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "h-1 w-6 rounded-full transition-colors duration-200",
                  i <= step ? "bg-foreground" : "bg-muted",
                )}
              />
            ))}
          </div>
          <DialogTitle>{TITLES[step]}</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {STEPS.length}
          </DialogDescription>
        </DialogHeader>

        <div
          key={step}
          className="-mx-1 max-h-[52vh] min-h-0 overflow-y-auto px-1 text-xs duration-200 ease-out animate-in fade-in-0 slide-in-from-right-2 motion-reduce:slide-in-from-right-0"
        >
          {step === 0 ? (
            <div role="radiogroup" aria-label="Template" className="flex flex-col gap-0.5">
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
                      "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      PRESS,
                      on ? "bg-muted" : "hover:bg-muted/50",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-foreground/10">
                      <FileTextIcon weight={ICON_WEIGHT} className="size-4 text-muted-foreground" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{t.label}</span>
                      <span className="block truncate text-muted-foreground">{t.description}</span>
                    </span>
                    <CheckIcon
                      weight="bold"
                      className={cn(
                        "size-3.5 shrink-0 transition-opacity duration-150",
                        on ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <MagnifyingGlassIcon
                  weight={ICON_WEIGHT}
                  className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students"
                  className="pl-7"
                />
              </div>
              <div className="flex items-center justify-between px-2 text-muted-foreground">
                <span className="tabular-nums">{picked.length} selected</span>
                <button
                  type="button"
                  className="cursor-pointer font-medium text-foreground hover:underline"
                  onClick={() =>
                    setPicked(picked.length === students.length ? [] : students.map((s) => s.id))
                  }
                >
                  {picked.length === students.length ? "Clear" : "Select all"}
                </button>
              </div>
              <ul className="flex flex-col gap-0.5">
                {visible.map((s) => (
                  <li key={s.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-muted/50">
                      <Checkbox
                        checked={picked.includes(s.id)}
                        onCheckedChange={(checked) =>
                          setPicked((cur) =>
                            checked ? [...cur, s.id] : cur.filter((id) => id !== s.id),
                          )
                        }
                      />
                      <span className="font-medium">{s.name}</span>
                      <span className="ml-auto text-muted-foreground">{className(s)}</span>
                    </label>
                  </li>
                ))}
                {visible.length === 0 ? (
                  <li className="px-2 py-6 text-center text-muted-foreground">No students match.</li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {step === 2 ? (
            <ul className="flex flex-col gap-2">
              {selected.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground">{chosen?.label}</p>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-muted-foreground">{className(s)}</p>
                  </div>
                  <span className="rounded-md bg-background p-1.5 ring-1 ring-foreground/10">
                    <PlaceholderQr seed={`${template}-${s.id}`} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <DialogFooter className="flex-row items-center sm:justify-between">
          {step > 0 ? (
            <Button variant="ghost" className={PRESS} onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button
              className={PRESS}
              disabled={step === 1 && picked.length === 0}
              onClick={() => setStep(step + 1)}
            >
              Continue
              <ArrowRightIcon weight="bold" />
            </Button>
          ) : (
            <Button
              className={PRESS}
              onClick={() => {
                toast.success(
                  `${selected.length} ${selected.length === 1 ? "document" : "documents"} downloaded`,
                );
                onOpenChange(false);
              }}
            >
              <DownloadSimpleIcon weight={ICON_WEIGHT} />
              Download {selected.length > 1 ? `${selected.length} files` : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
