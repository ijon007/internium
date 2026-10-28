"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@internium/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@internium/ui/components/select";
import { Skeleton } from "@internium/ui/components/skeleton";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@internium/ui/components/toggle-group";
import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";

const LOCALE_STORAGE_KEY = "internium:locale:v1";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "ro", label: "Română" },
] as const;

type Locale = (typeof LOCALES)[number]["value"];
type ThemeChoice = "system" | "light" | "dark";

function isLocale(value: string | null): value is Locale {
  return LOCALES.some((locale) => locale.value === value);
}

function isThemeChoice(value: string): value is ThemeChoice {
  return value === "system" || value === "light" || value === "dark";
}

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // ponytail: localStorage throws in some private-mode browsers
  }
  return "en";
}

export function AppearanceSettings({ description }: { description: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setMounted(true);
    setLocale(readLocale());
  }, []);

  const themeValue: ThemeChoice =
    mounted && theme && isThemeChoice(theme) ? theme : "system";

  return (
    <SettingsPane description={description}>
      <SettingsSection
        title="Theme"
        description="Applies to Internium on this device."
      >
        {mounted ? (
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[themeValue]}
            onValueChange={(next) => {
              const value = next[0];
              if (value && isThemeChoice(value)) setTheme(value);
            }}
          >
            <ToggleGroupItem value="system">
              <DesktopIcon data-icon="inline-start" />
              System
            </ToggleGroupItem>
            <ToggleGroupItem value="light">
              <SunIcon data-icon="inline-start" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark">
              <MoonIcon data-icon="inline-start" />
              Dark
            </ToggleGroupItem>
          </ToggleGroup>
        ) : (
          <Skeleton className="h-7 w-64" />
        )}
      </SettingsSection>

      <SettingsSection
        title="Language"
        description="Menus and labels on this device. Documents stay in the language they were written."
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="appearance-locale">
              Display language
            </FieldLabel>
            <Select
              value={locale}
              onValueChange={(value) => {
                if (typeof value !== "string" || !isLocale(value)) return;
                setLocale(value);
                try {
                  localStorage.setItem(LOCALE_STORAGE_KEY, value);
                } catch {
                  // ponytail: same private-mode ceiling as readLocale
                }
              }}
            >
              <SelectTrigger id="appearance-locale" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LOCALES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Romanian is the default for most partner schools.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </SettingsSection>
    </SettingsPane>
  );
}
