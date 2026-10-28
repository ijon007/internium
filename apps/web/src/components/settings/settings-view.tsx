"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@internium/ui/components/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountSettings } from "@/components/settings/account-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { ChatSettings } from "@/components/settings/chat-settings";
import { NotificationsSettings } from "@/components/settings/notifications-settings";
import { SchoolSettings } from "@/components/settings/school-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import {
  parseSettingsTab,
  SETTINGS_TAB_PARAM,
  SETTINGS_TABS,
  type SettingsCategory,
} from "@/constants/settings";
import { getSettingsHref } from "@/utils/navigation";

const SETTINGS_PANES = {
  account: AccountSettings,
  appearance: AppearanceSettings,
  notifications: NotificationsSettings,
  chat: ChatSettings,
  security: SecuritySettings,
  school: SchoolSettings,
} as const;

export function SettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = parseSettingsTab(searchParams.get(SETTINGS_TAB_PARAM));
  const [tab, setTab] = useState<SettingsCategory>(urlTab);

  useEffect(() => {
    setTab(urlTab);
  }, [urlTab]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (typeof value !== "string") return;
        const next = parseSettingsTab(value);
        setTab(next);
        router.replace(getSettingsHref(next), { scroll: false });
      }}
      className="gap-4"
    >
      <TabsList>
        {SETTINGS_TABS.map((item) => (
          <TabsTrigger key={item.slug} value={item.slug} className="px-3">
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {SETTINGS_TABS.map((item) => {
        const Pane = SETTINGS_PANES[item.slug];
        return (
          <TabsContent
            key={item.slug}
            value={item.slug}
            className="animate-settings-pane motion-reduce:animate-none"
          >
            <Pane description={item.description} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
