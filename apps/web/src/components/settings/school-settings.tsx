"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@internium/ui/components/alert";
import { Button } from "@internium/ui/components/button";
import { Input } from "@internium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@internium/ui/components/select";
import { BuildingsIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  SettingsFieldRow,
  SettingsList,
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

type Timezone = (typeof TIMEZONES)[number]["value"];

const ROW_CONTROL =
  "h-8 w-full border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0 md:text-xs";

export function SchoolSettings() {
  const role = useCurrentRole();
  const canEdit = role === "admin" || role === "coordinator";
  const [name, setName] = useState("Colegiul Tehnic Internium");
  const [timezone, setTimezone] = useState<Timezone>("Europe/Bucharest");
  const [year, setYear] = useState("2026/2027");
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [lockAbsences, setLockAbsences] = useState(true);

  if (!canEdit) {
    return (
      <SettingsPane>
        <Alert>
          <BuildingsIcon />
          <AlertTitle>Coordinators and admins only</AlertTitle>
          <AlertDescription>
            Ask your coordinator if a date or absence rule looks wrong.
          </AlertDescription>
        </Alert>
      </SettingsPane>
    );
  }

  return (
    <SettingsPane>
      <SettingsSection
        title="School"
        caption="Shown on documents and in the directory."
        flush
        footer={
          <Button
            type="button"
            onClick={() => toast.success("School details saved")}
          >
            Save
          </Button>
        }
      >
        <SettingsList>
          <SettingsFieldRow id="school-name" label="Name">
            <Input
              id="school-name"
              value={name}
              className={ROW_CONTROL}
              onChange={(event) => setName(event.target.value)}
            />
          </SettingsFieldRow>
          <SettingsFieldRow id="school-year" label="Year">
            <Input
              id="school-year"
              value={year}
              className={ROW_CONTROL}
              onChange={(event) => setYear(event.target.value)}
            />
          </SettingsFieldRow>
          <SettingsFieldRow id="school-timezone" label="Time zone">
            <Select
              value={timezone}
              onValueChange={(value) => {
                if (TIMEZONES.some((item) => item.value === value)) {
                  setTimezone(value as Timezone);
                }
              }}
            >
              <SelectTrigger
                id="school-timezone"
                className={`${ROW_CONTROL} justify-between`}
              >
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
          </SettingsFieldRow>
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Internship defaults"
        caption="Applies to every placement this year."
        flush
      >
        <SettingsList>
          <SettingsSwitchField
            id="school-weekly-reports"
            label="Weekly reports"
            description="Reminder to mentors on Thursday."
            checked={weeklyReports}
            onCheckedChange={setWeeklyReports}
          />
          <SettingsSwitchField
            id="school-lock-absences"
            label="Lock absences after Friday"
            description="Closes at 16:00 for the current week."
            checked={lockAbsences}
            onCheckedChange={setLockAbsences}
          />
        </SettingsList>
      </SettingsSection>
    </SettingsPane>
  );
}
