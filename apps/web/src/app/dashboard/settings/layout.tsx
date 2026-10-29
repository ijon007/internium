import type { Metadata } from "next";
import { PageHeading } from "@/components/dashboard/page-heading";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account, notifications, and school preferences.",
};

export default function SettingsLayout({
  children,
}: LayoutProps<"/dashboard/settings">) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-4 pt-4 text-left">
      <PageHeading>Settings</PageHeading>
      {children}
    </div>
  );
}
