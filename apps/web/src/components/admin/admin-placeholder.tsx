import { PageHeading } from "@/components/dashboard/page-heading";

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2 pt-4">
      <PageHeading>{title}</PageHeading>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
