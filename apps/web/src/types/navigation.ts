import type { Icon } from "@phosphor-icons/react";

export type NavItem = {
  title: string;
  path: string;
  icon: Icon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
