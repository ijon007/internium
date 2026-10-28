type SettingsPlaceholderProps = {
  title: string;
  description: string;
};

export function SettingsPlaceholder({
  title,
  description,
}: SettingsPlaceholderProps) {
  return (
    <section className="px-1">
      <h2 className="text-[22px] leading-tight font-semibold tracking-[-0.022em]">
        {title}
      </h2>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
