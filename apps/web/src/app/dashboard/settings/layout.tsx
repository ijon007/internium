import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account, notifications, and school preferences.",
};

export default function SettingsLayout({
  children,
}: LayoutProps<"/dashboard/settings">) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 text-left">
      <h1 className="font-heading text-lg font-medium tracking-tight">
        Settings
      </h1>
      {children}
    </div>
  );
}
