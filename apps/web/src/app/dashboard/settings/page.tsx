import { redirect } from "next/navigation";
import { DEFAULT_SETTINGS_CATEGORY } from "@/constants/settings";
import { getSettingsHref } from "@/utils/navigation";

export default function SettingsIndexPage() {
  redirect(getSettingsHref(DEFAULT_SETTINGS_CATEGORY));
}
