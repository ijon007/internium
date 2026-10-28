import type { Metadata } from "next";
import { SettingsChrome } from "@/components/settings/settings-chrome";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account, appearance, and school preferences.",
};

export default function SettingsLayout({
  children,
}: LayoutProps<"/dashboard/settings">) {
  return (
    <div className="flex min-h-0 w-full max-w-[40rem] flex-1 flex-col pt-1">
      <SettingsChrome />
      <SettingsContent>{children}</SettingsContent>
    </div>
  );
}
