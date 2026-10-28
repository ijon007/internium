"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { SETTINGS_TABS } from "@/constants/settings";
import { cn } from "@/lib/utils";
import { getSettingsHref } from "@/utils/navigation";

export function SettingsTabs() {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, ready: false });

  const activeSlug =
    SETTINGS_TABS.find((tab) => pathname === getSettingsHref(tab.slug))?.slug ??
    SETTINGS_TABS[0].slug;

  useLayoutEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const update = () => {
      const active = root.querySelector<HTMLElement>(
        `[data-slug="${activeSlug}"]`,
      );
      if (!active) return;
      setIndicator({
        x: active.offsetLeft,
        w: active.offsetWidth,
        ready: true,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [activeSlug]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Settings"
      className="relative inline-flex max-w-full self-start overflow-x-auto rounded-full bg-muted/80 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 bottom-1 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
          indicator.ready
            ? "transition-[transform,width] duration-300 ease-out-strong motion-reduce:transition-none"
            : "opacity-0",
        )}
        style={{
          width: indicator.w,
          transform: `translate3d(${indicator.x}px,0,0)`,
        }}
      />
      {SETTINGS_TABS.map((tab) => {
        const href = getSettingsHref(tab.slug);
        const isActive = tab.slug === activeSlug;
        return (
          <Link
            key={tab.slug}
            href={href}
            role="tab"
            aria-selected={isActive}
            data-slug={tab.slug}
            className={cn(
              "relative z-10 shrink-0 rounded-full px-3.5 py-1.5 text-[13px] leading-none font-medium tracking-[-0.01em]",
              "transition-colors duration-150 active:scale-[0.97] motion-reduce:active:scale-100",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.title}
          </Link>
        );
      })}
    </div>
  );
}
