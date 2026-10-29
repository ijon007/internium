/** Placeholder sheet of A4 paper while a page renders. */
export function PaperSkeleton({ width }: { width: number }) {
  return (
    <div
      style={{ width, height: width * 1.414 }}
      className="animate-pulse rounded-sm bg-white/70 ring-1 ring-black/5 dark:bg-white/10"
    />
  );
}
