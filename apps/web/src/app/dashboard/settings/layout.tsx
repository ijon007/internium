import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account, appearance, and school preferences.",
};

export default function SettingsLayout({
  children,
}: LayoutProps<"/dashboard/settings">) {
  return (
    <div className="flex min-h-0 w-full max-w-[40rem] flex-1 flex-col gap-5 pt-1">
      <h1 className="text-[28px] leading-none font-semibold tracking-[-0.03em]">
        Settings
      </h1>
      {children}
    </div>
  );
}
