"use client";

import { useSidebar } from "@internium/ui/components/sidebar";
import { useEffect, useRef } from "react";

export function CollapseAppSidebar() {
  const { setOpen } = useSidebar();
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  useEffect(() => {
    setOpenRef.current(false);
  }, []);

  return null;
}
