"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@internium/ui/components/alert";
import { Button } from "@internium/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@internium/ui/components/select";
import { InfoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsSwitchField } from "@/components/settings/settings-switch-field";
import { useCurrentRole } from "@/hooks/use-current-role";

const TIMEZONES = [
  { value: "Europe/Bucharest", label: "Bucharest (EET)" },
  { value: "Europe/Athens", label: "Athens (EET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "UTC", label: "UTC" },
] as const;

const SCHOOL_LOCALES = [
  { value: "ro", label: "Română" },
  { value: "en", label: "English" },
] as const;

type Timezone = (typeof TIMEZONES)[number]["value"];
type SchoolLocale = (typeof SCHOOL_LOCALES)[number]["value"];

export function SchoolSettings({ description }: { description: string }) {
  const role = useCurrentRole();
  const canEdit = role === "admin" || role === "coordinator";
  const [name, setName] = useState("Colegiul Tehnic Internium");
  const [timezone, setTimezone] = useState<Timezone>("Europe/Bucharest");
  const [locale, setLocale] = useState<SchoolLocale>("ro");
  const [year, setYear] = useState("2026/2027");
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [lockAbsences, setLockAbsences] = useState(true);

  if (!canEdit) {
    return (
      <SettingsPane description={description}>
        <Alert>
          <InfoIcon />
          <AlertTitle>Only coordinators and admins can edit this</AlertTitle>
          <AlertDescription>
            School defaults apply to every student and mentor. Ask your
            coordinator if a date, language, or absence rule looks wrong.
          </AlertDescription>
        </Alert>
      </SettingsPane>
    );
  }

  return (
    <SettingsPane description={description}>
      <SettingsSection
        title="School"
        description="Shown on documents and in the directory."
        footer={
          <Button
            type="button"
            onClick={() => toast.success("School details saved")}
          >
            Save
          </Button>
        }
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="school-name">Name</FieldLabel>
            <Input
              id="school-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="school-year">School year</FieldLabel>
            <Input
              id="school-year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
            <FieldDescription>
              Used on internships, reports, and absence windows.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="school-timezone">Time zone</FieldLabel>
            <Select
              value={timezone}
              onValueChange={(value) => {
                if (TIMEZONES.some((item) => item.value === value)) {
                  setTimezone(value as Timezone);
                }
              }}
            >
              <SelectTrigger id="school-timezone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TIMEZONES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="school-locale">Default language</FieldLabel>
            <Select
              value={locale}
              onValueChange={(value) => {
                if (SCHOOL_LOCALES.some((item) => item.value === value)) {
                  setLocale(value as SchoolLocale);
                }
              }}
            >
              <SelectTrigger id="school-locale" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SCHOOL_LOCALES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              People can still pick their own language in Appearance.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Internship defaults"
        description="Rules for every placement this year."
      >
        <FieldGroup>
          <SettingsSwitchField
            id="school-weekly-reports"
            label="Weekly reports"
            description="Students submit a report every week. Mentors get a reminder on Thursday."
            checked={weeklyReports}
            onCheckedChange={setWeeklyReports}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="school-lock-absences"
            label="Lock absences after Friday"
            description="Same-week absence requests close at 16:00 on Friday."
            checked={lockAbsences}
            onCheckedChange={setLockAbsences}
          />
        </FieldGroup>
      </SettingsSection>
    </SettingsPane>
  );
}
