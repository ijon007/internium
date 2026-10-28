type SettingsPlaceholderProps = {
  title: string;
  description: string;
};

export function SettingsPlaceholder({
  title,
  description,
}: SettingsPlaceholderProps) {
  return (
    <section>
      <h2 className="font-heading text-sm font-medium tracking-tight">
        {title}
      </h2>
      <p className="mt-1 max-w-lg text-sm text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
