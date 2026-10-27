"use client";

export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-muted-foreground text-xs">
      <span className="flex items-center gap-0.5" aria-hidden>
        <Dot delay="0ms" />
        <Dot delay="120ms" />
        <Dot delay="240ms" />
      </span>
      <span>{name} is typing…</span>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
      style={{ animationDelay: delay }}
    />
  );
}
