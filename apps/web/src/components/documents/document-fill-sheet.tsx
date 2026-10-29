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
import { useRetained } from "@/hooks/use-retained";
import { cn } from "@/lib/utils";

/** Underlined blank on the paper: dashed while empty, solid once filled (borrowed from payment-tracking). */
const BLANK =
  "w-full border-0 border-b bg-transparent px-0.5 pb-0.5 text-[13px] text-neutral-900 outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-neutral-900";
const blankBorder = (filled: boolean) => (filled ? "border-solid border-neutral-400" : "border-dashed border-neutral-300");

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
  const required = schema.sections.flatMap((s) => s.fields).filter((f) => f.required);
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
        <article className="mx-auto flex w-full max-w-[680px] flex-col gap-7 rounded-sm bg-white px-10 py-11 text-neutral-900 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-8px_rgb(0_0_0/0.18)] ring-1 ring-black/5 sm:px-14">
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-5">
            <span className="text-[10px] font-medium tracking-[0.12em] text-neutral-400 uppercase">Internium · {ME.className}</span>
            <h2 className="text-xl font-semibold tracking-tight">{schema.title}</h2>
            <p className="text-[13px] text-neutral-500">{schema.subtitle}</p>
          </div>

          {schema.sections.map((section, i) => (
            <section key={section.title} className="flex flex-col gap-3.5">
              <h3 className="text-[11px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
                {i + 1}. {section.title}
              </h3>
              {section.intro ? <p className="text-[13px] leading-relaxed text-neutral-600">{section.intro}</p> : null}
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <FieldBlank
                    key={f.id}
                    field={f}
                    value={values[f.id]}
                    invalid={tried && !!f.required && !isFilled(f, values[f.id])}
                    onChange={(v) => set(f.id, v)}
                  />
                ))}
              </div>
            </section>
          ))}
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

function FieldBlank({
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
  const wide = field.type === "textarea" || field.type === "signature" || field.type === "checkbox" || (field.type === "text" && field.width === "full");

  if (field.type === "checkbox") {
    return (
      <label className={cn("flex cursor-pointer items-center gap-2.5 text-[13px] sm:col-span-2", invalid && "text-red-600")}>
        <Checkbox checked={value === true} onCheckedChange={(c) => onChange(c === true)} />
        {field.label}
        {field.required ? <Req /> : null}
      </label>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", wide && "sm:col-span-2")}>
      <span className={cn("text-[11px] text-neutral-500", invalid && "text-red-600")}>
        {field.label}
        {field.required ? <Req /> : null}
      </span>
      {field.type === "text" ? (
        <input
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(BLANK, blankBorder(filled), invalid && "border-red-400", field.width === "sm" && "max-w-32")}
        />
      ) : field.type === "textarea" ? (
        <textarea
          rows={3}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            BLANK,
            "resize-none rounded-none bg-[repeating-linear-gradient(transparent,transparent_23px,rgb(0_0_0/0.06)_24px)] leading-6",
            blankBorder(filled),
            invalid && "border-red-400",
          )}
        />
      ) : field.type === "dropdown" ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={cn(BLANK, blankBorder(filled), invalid && "border-red-400", "flex cursor-pointer items-center justify-between text-left")}
              />
            }
          >
            <span className={cn(!text && "text-neutral-400")}>{text || "Choose…"}</span>
            <CaretDownIcon weight={ICON_WEIGHT} className="size-3 text-neutral-400" />
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
      ) : field.type === "date" ? (
        <DateBlank value={text} invalid={invalid} onChange={onChange} />
      ) : (
        <SignaturePad value={text} invalid={invalid} onChange={onChange} />
      )}
    </div>
  );
}

function Req() {
  return <span className="ml-0.5 text-neutral-400">*</span>;
}

function DateBlank({ value, invalid, onChange }: { value: string; invalid: boolean; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(`${value}T00:00:00`) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(BLANK, blankBorder(!!value), invalid && "border-red-400", "cursor-pointer text-left tabular-nums")}
          />
        }
      >
        {date ? (
          date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        ) : (
          <span className="tracking-widest text-neutral-300">__ / __ / ____</span>
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
    <div
      className={cn(
        "group relative h-24 max-w-80 rounded-md border bg-neutral-50/60 transition-colors",
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
    </div>
  );
}
