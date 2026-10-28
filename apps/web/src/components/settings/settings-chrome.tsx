import { SettingsTabs } from "@/components/settings/settings-tabs";

export function SettingsChrome() {
  return (
    <header className="flex flex-col items-start gap-5">
      <h1 className="text-[28px] leading-none font-semibold tracking-[-0.03em]">
        Settings
      </h1>
      <SettingsTabs />
    </header>
  );
}
