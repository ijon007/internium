"use client";

import { useSidebar } from "@internium/ui/components/sidebar";
import { useEffect } from "react";

export function CollapseAppSidebar() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return null;
}
