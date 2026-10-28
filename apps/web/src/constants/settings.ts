export const SETTINGS_TABS = [
  { slug: "account", title: "Account" },
  { slug: "notifications", title: "Notifications" },
  { slug: "chat", title: "Chat" },
  { slug: "security", title: "Security" },
  { slug: "school", title: "School" },
] as const;

export type SettingsCategory = (typeof SETTINGS_TABS)[number]["slug"];

export const DEFAULT_SETTINGS_CATEGORY: SettingsCategory = "account";

export const SETTINGS_TAB_PARAM = "tab";

export function parseSettingsTab(value: string | null): SettingsCategory {
  return SETTINGS_TABS.some((tab) => tab.slug === value)
    ? (value as SettingsCategory)
    : DEFAULT_SETTINGS_CATEGORY;
}
