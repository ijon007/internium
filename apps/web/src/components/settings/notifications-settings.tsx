"use client";

import { FieldGroup, FieldSeparator } from "@internium/ui/components/field";
import { useState } from "react";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsSwitchField } from "@/components/settings/settings-switch-field";

type NotificationPrefs = {
  inAppDocuments: boolean;
  inAppAbsences: boolean;
  inAppChat: boolean;
  emailDocuments: boolean;
  emailAbsences: boolean;
  emailChat: boolean;
  quietHours: boolean;
};

const INITIAL: NotificationPrefs = {
  inAppDocuments: true,
  inAppAbsences: true,
  inAppChat: true,
  emailDocuments: true,
  emailAbsences: true,
  emailChat: false,
  quietHours: false,
};

export function NotificationsSettings({
  description,
}: {
  description: string;
}) {
  const [prefs, setPrefs] = useState(INITIAL);

  function toggle(key: keyof NotificationPrefs) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <SettingsPane description={description}>
      <SettingsSection
        title="In the app"
        description="Banners in the sidebar while you are signed in."
      >
        <FieldGroup>
          <SettingsSwitchField
            id="notify-app-documents"
            label="Documents"
            description="A file needs a signature, review, or upload."
            checked={prefs.inAppDocuments}
            onCheckedChange={() => toggle("inAppDocuments")}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="notify-app-absences"
            label="Absences"
            description="A request is submitted, approved, or declined."
            checked={prefs.inAppAbsences}
            onCheckedChange={() => toggle("inAppAbsences")}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="notify-app-chat"
            label="Chat"
            description="A new message in a conversation you follow."
            checked={prefs.inAppChat}
            onCheckedChange={() => toggle("inAppChat")}
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Email"
        description="Sent to the address on your account. Chat stays off by default."
      >
        <FieldGroup>
          <SettingsSwitchField
            id="notify-email-documents"
            label="Documents"
            description="Daily digest when something is waiting on you."
            checked={prefs.emailDocuments}
            onCheckedChange={() => toggle("emailDocuments")}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="notify-email-absences"
            label="Absences"
            description="Only when a request changes status."
            checked={prefs.emailAbsences}
            onCheckedChange={() => toggle("emailAbsences")}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="notify-email-chat"
            label="Chat"
            description="A summary if you missed messages overnight."
            checked={prefs.emailChat}
            onCheckedChange={() => toggle("emailChat")}
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Quiet hours"
        description="Pause banners and email from 21:00 to 07:00, local time. Absences that need same-day action still come through."
      >
        <SettingsSwitchField
          id="notify-quiet-hours"
          label="Use quiet hours"
          description="Applies on this account, on every device."
          checked={prefs.quietHours}
          onCheckedChange={() => toggle("quietHours")}
        />
      </SettingsSection>
    </SettingsPane>
  );
}
