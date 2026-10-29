"use client";

import { ICON_WEIGHT } from "@/constants/navigation";
import { Button } from "@internium/ui/components/button";
import { Calendar } from "@internium/ui/components/calendar";
import { Checkbox } from "@internium/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@internium/ui/components/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@internium/ui/components/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@internium/ui/components/sheet";
import { CaretDownIcon, EraserIcon, PaperPlaneTiltIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { PRESS } from "@/components/admin/admin-table";
import {
  DOCUMENT_FIELDS,
  type DocField,
  type FieldValue,
  type FieldValues,
  isFilled,
} from "@/constants/document-fields";
import { ME, type StudentDocument } from "@/constants/student";
import { ParsedTemplate } from "@/components/documents/parsed-template";
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";

/** Underline-only control sitting on the text baseline: dashed while empty, solid once filled (payment-tracking). */
const INLINE =
  "mx-0.5 inline-block h-[1.45em] max-w-full border-0 border-b bg-transparent px-1 align-baseline text-[13px] font-medium text-neutral-900 outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:font-normal placeholder:text-neutral-400 hover:bg-neutral-100/70 focus:border-neutral-900 focus:bg-neutral-100/70";
const blankBorder = (filled: boolean) => (filled ? "border-solid border-neutral-400" : "border-dashed border-neutral-300");

/** The page: real document typography for mammoth's HTML. */
const PAPER = cn(
  "mx-auto w-full max-w-[720px] rounded-sm bg-white px-10 py-12 text-[13px] leading-7 text-neutral-800 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-8px_rgb(0_0_0/0.18)] ring-1 ring-black/5 sm:px-16",
  "[&>p:first-child]:text-center [&>p:first-child]:text-[10px] [&>p:first-child]:font-medium [&>p:first-child]:tracking-[0.12em] [&>p:first-child]:text-neutral-400",
  "[&_h1]:mt-2 [&_h1]:text-center [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-neutral-900",
  "[&_h1+p]:mb-6 [&_h1+p]:border-b [&_h1+p]:border-neutral-200 [&_h1+p]:pb-6 [&_h1+p]:text-center [&_h1+p]:text-neutral-500",
  "[&_h2]:mt-6 [&_h2]:mb-1 [&_h2]:text-[11px] [&_h2]:font-semibold [&_h2]:tracking-[0.08em] [&_h2]:text-neutral-500 [&_h2]:uppercase",
  "[&_p]:my-1.5",
);

const DRAFTS = new Map<string, FieldValues>();

function initialValues(doc: StudentDocument): FieldValues {
  return DRAFTS.get(doc.id) ?? { studentName: ME.name, schoolYear: "2026/2027" };
}

/** In-app filling of a generated document: the template is drawn as paper with inline blanks. */
export function DocumentFillSheet({
  doc,
  onClose,
  onSubmit,
}: {
  doc: StudentDocument | null;
  onClose: () => void;
  onSubmit: (doc: StudentDocument, values: FieldValues) => void;
}) {
  const shown = useRetained(doc);
  return (
    <Sheet open={doc !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent showCloseButton={false} className="gap-0 data-[side=right]:sm:max-w-[min(900px,90vw)]">
        {shown ? <FillForm key={shown.id} doc={shown} onClose={onClose} onSubmit={onSubmit} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function FillForm({
  doc,
  onClose,
  onSubmit,
}: {
  doc: StudentDocument;
  onClose: () => void;
  onSubmit: (doc: StudentDocument, values: FieldValues) => void;
}) {
  const schema = DOCUMENT_FIELDS[doc.id];
  const [values, setValues] = useState<FieldValues>(() => initialValues(doc));
  const [tried, setTried] = useState(false);
  const all = schema.sections.flatMap((s) => s.fields);
  const fields = new Map(all.map((f) => [f.id, f]));
  const required = all.filter((f) => f.required);
  const done = required.filter((f) => isFilled(f, values[f.id])).length;
  const complete = done === required.length;
  const set = (id: string, v: FieldValue) => setValues((cur) => ({ ...cur, [id]: v }));

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 py-2.5 pr-2.5 pl-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <SheetTitle className="truncate text-sm leading-tight font-medium tracking-tight">Fill in {doc.label}</SheetTitle>
          <SheetDescription className="text-[11px] tabular-nums">
            {done} of {required.length} required fields
          </SheetDescription>
        </div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
            style={{ width: `${required.length ? (done / required.length) * 100 : 100}%` }}
          />
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Close" className={PRESS} onClick={onClose}>
          <XIcon weight="bold" />
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto bg-muted/50 px-6 py-6">
        <article className={PAPER}>
          <ParsedTemplate
            url={`/templates/${doc.id}.docx`}
            renderBlank={(id) => {
              const f = fields.get(id);
              if (!f) return `{{${id}}}`;
              return (
                <InlineBlank
                  field={f}
                  value={values[id]}
                  invalid={tried && !!f.required && !isFilled(f, values[id])}
                  onChange={(v) => set(id, v)}
                />
              );
            }}
          />
        </article>
      </div>

      <SheetFooter className="flex-row items-center">
        <span className="mr-auto text-[11px] text-muted-foreground">
          {tried && !complete ? "Fill the highlighted fields to submit." : "Drafts are kept until you submit."}
        </span>
        <Button
          variant="ghost"
          className={PRESS}
          onClick={() => {
            DRAFTS.set(doc.id, values);
            onClose();
          }}
        >
          Save draft
        </Button>
        <Button
          className={PRESS}
          onClick={() => {
            setTried(true);
            if (!complete) return;
            DRAFTS.delete(doc.id);
            onSubmit(doc, values);
          }}
        >
          <PaperPlaneTiltIcon weight={ICON_WEIGHT} />
          Submit
        </Button>
      </SheetFooter>
    </>
  );
}

/** A blank in the running text, swapped for the control its field type calls for. */
function InlineBlank({
  field,
  value,
  invalid,
  onChange,
}: {
  field: DocField;
  value: FieldValue | undefined;
  invalid: boolean;
  onChange: (v: FieldValue) => void;
}) {
  const filled = isFilled(field, value);
  const text = typeof value === "string" ? value : "";
  const line = cn(blankBorder(filled), invalid && "border-red-400 bg-red-50/60");

  switch (field.type) {
    case "checkbox":
      return (
        <Checkbox
          aria-label={field.label}
          checked={value === true}
          onCheckedChange={(c) => onChange(c === true)}
          className={cn("mr-1 translate-y-[2px]", invalid && "border-red-400")}
        />
      );
    case "text":
      return (
        <input
          aria-label={field.label}
          value={text}
          placeholder={field.label}
          onChange={(e) => onChange(e.target.value)}
          style={{ fieldSizing: "content" } as React.CSSProperties}
          className={cn(INLINE, line, field.width === "sm" ? "min-w-16" : "min-w-36")}
        />
      );
    case "textarea":
      return (
        <textarea
          aria-label={field.label}
          rows={3}
          value={text}
          placeholder={field.placeholder ?? field.label}
          onChange={(e) => onChange(e.target.value)}
          style={{ fieldSizing: "content" } as React.CSSProperties}
          className={cn(
            "block min-h-[4.5rem] w-full resize-none border-0 border-b bg-[repeating-linear-gradient(transparent,transparent_23px,rgb(0_0_0/0.07)_24px)] px-0.5 text-[13px] leading-6 text-neutral-900 outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-neutral-900",
            line,
          )}
        />
      );
    case "dropdown":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={field.label}
            render={<button type="button" className={cn(INLINE, line, "inline-flex cursor-pointer items-baseline gap-1 text-left")} />}
          >
            <span className={cn(!text && "text-neutral-400")}>{text || field.label}</span>
            <CaretDownIcon weight="bold" className="size-2.5 self-center text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44">
            <DropdownMenuRadioGroup value={text} onValueChange={(v) => onChange(String(v))}>
              {field.options.map((o) => (
                <DropdownMenuRadioItem key={o} value={o}>
                  {o}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    case "date":
      return <DateBlank label={field.label} value={text} className={line} onChange={onChange} />;
    case "signature":
      return <SignaturePad value={text} invalid={invalid} onChange={onChange} />;
  }
}

function DateBlank({
  label,
  value,
  className,
  onChange,
}: {
  label: string;
  value: string;
  className: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(`${value}T00:00:00`) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={label}
            className={cn(INLINE, className, "cursor-pointer text-left tabular-nums")}
          />
        }
      >
        {date ? (
          date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        ) : (
          <span className="tracking-widest text-neutral-400">__ / __ / ____</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => {
            if (!d) return;
            const pad = (n: number) => String(n).padStart(2, "0");
            onChange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/** Draw-to-sign pad; stores a PNG data URL. */
function SignaturePad({ value, invalid, onChange }: { value: string; invalid: boolean; onChange: (v: string) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * ratio;
    c.height = c.offsetHeight * ratio;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#171717";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.offsetWidth, c.offsetHeight);
      img.src = value;
    }
    // Only restore once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  return (
    <span
      className={cn(
        "relative mt-1 inline-block h-20 w-64 max-w-full align-top rounded-md border bg-neutral-50/60 transition-colors",
        value ? "border-solid border-neutral-300" : "border-dashed border-neutral-300",
        invalid && "border-red-400",
      )}
    >
      <canvas
        ref={canvas}
        className="size-full cursor-crosshair touch-none"
        onPointerDown={(e) => {
          const ctx = e.currentTarget.getContext("2d");
          if (!ctx) return;
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          ctx.beginPath();
          ctx.moveTo(...point(e));
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = e.currentTarget.getContext("2d");
          ctx?.lineTo(...point(e));
          ctx?.stroke();
        }}
        onPointerUp={(e) => {
          if (!drawing.current) return;
          drawing.current = false;
          onChange(e.currentTarget.toDataURL("image/png"));
        }}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear signature"
          onClick={() => {
            const c = canvas.current;
            c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
            onChange("");
          }}
          className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700"
        >
          <EraserIcon weight={ICON_WEIGHT} className="size-3.5" />
        </button>
      ) : (
        <span className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] text-neutral-400">
          Sign here
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-4 bottom-7 border-b border-neutral-200" />
    </span>
  );
}
