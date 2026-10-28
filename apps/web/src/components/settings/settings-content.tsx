"use client";

import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { SETTINGS_TABS } from "@/constants/settings";
import { cn } from "@/lib/utils";
import { getSettingsHref } from "@/utils/navigation";

export function SettingsContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const index = Math.max(
    0,
    SETTINGS_TABS.findIndex((tab) => pathname === getSettingsHref(tab.slug)),
  );
  const prevIndex = useRef(index);
  const direction =
    index === prevIndex.current ? 0 : index > prevIndex.current ? 1 : -1;

  useEffect(() => {
    prevIndex.current = index;
  }, [index]);

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div
        key={pathname}
        className={cn(
          direction !== 0 && "animate-settings-pane motion-reduce:animate-none",
        )}
        style={
          {
            "--settings-from": `${direction * 10}px`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
