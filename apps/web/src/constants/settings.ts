export const SETTINGS_TABS = [
  {
    slug: "account",
    title: "Account",
    description: "Your name, photo, and the details other people see.",
  },
  {
    slug: "appearance",
    title: "Appearance",
    description: "Theme and language for Internium on this device.",
  },
  {
    slug: "notifications",
    title: "Notifications",
    description: "What we tell you about documents, absences, and chat.",
  },
  {
    slug: "chat",
    title: "Chat",
    description: "Sounds, read receipts, and who can message you.",
  },
  {
    slug: "security",
    title: "Security",
    description: "Password, sessions, and two-factor authentication.",
  },
  {
    slug: "school",
    title: "School",
    description: "School-wide defaults for coordinators and admins.",
  },
] as const;

export type SettingsCategory = (typeof SETTINGS_TABS)[number]["slug"];

export const DEFAULT_SETTINGS_CATEGORY: SettingsCategory = "account";
