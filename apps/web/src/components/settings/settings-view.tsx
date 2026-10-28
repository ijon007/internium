"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@internium/ui/components/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingsPlaceholder } from "@/components/settings/settings-placeholder";
import {
  parseSettingsTab,
  SETTINGS_TAB_PARAM,
  SETTINGS_TABS,
  type SettingsCategory,
} from "@/constants/settings";
import { getSettingsHref } from "@/utils/navigation";

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
      className="gap-5"
    >
      <TabsList>
        {SETTINGS_TABS.map((item) => (
          <TabsTrigger key={item.slug} value={item.slug} className="px-3">
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {SETTINGS_TABS.map((item) => (
        <TabsContent
          key={item.slug}
          value={item.slug}
          className="animate-settings-pane motion-reduce:animate-none"
        >
          <SettingsPlaceholder
            title={item.title}
            description={item.description}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
