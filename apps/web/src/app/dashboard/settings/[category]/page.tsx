import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SettingsPlaceholder } from "@/components/settings/settings-placeholder";
import { SETTINGS_TABS } from "@/constants/settings";

export function generateStaticParams() {
  return SETTINGS_TABS.map((tab) => ({ category: tab.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/settings/[category]">): Promise<Metadata> {
  const { category } = await params;
  const tab = SETTINGS_TABS.find((item) => item.slug === category);
  if (!tab) return { title: "Settings" };
  return {
    title: `${tab.title} · Settings`,
    description: tab.description,
  };
}

export default function SettingsCategoryPage(
  props: PageProps<"/dashboard/settings/[category]">,
) {
  return (
    <Suspense>
      <SettingsCategory params={props.params} />
    </Suspense>
  );
}

async function SettingsCategory({
  params,
}: {
  params: PageProps<"/dashboard/settings/[category]">["params"];
}) {
  const { category } = await params;
  const tab = SETTINGS_TABS.find((item) => item.slug === category);
  if (!tab) notFound();

  return (
    <SettingsPlaceholder title={tab.title} description={tab.description} />
  );
}
