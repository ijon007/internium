"use client";

import { useState } from "react";
import {
  SettingsList,
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

export function NotificationsSettings() {
  const [prefs, setPrefs] = useState(INITIAL);

  function toggle(key: keyof NotificationPrefs) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <SettingsPane>
      <SettingsSection
        title="In the app"
        caption="Banners while you are signed in."
        flush
      >
        <SettingsList>
          <SettingsSwitchField
            id="notify-app-documents"
            label="Documents"
            description="Signature, review, or upload."
            checked={prefs.inAppDocuments}
            onCheckedChange={() => toggle("inAppDocuments")}
          />
          <SettingsSwitchField
            id="notify-app-absences"
            label="Absences"
            description="Submitted, approved, or declined."
            checked={prefs.inAppAbsences}
            onCheckedChange={() => toggle("inAppAbsences")}
          />
          <SettingsSwitchField
            id="notify-app-chat"
            label="Chat"
            description="New message in a thread you follow."
            checked={prefs.inAppChat}
            onCheckedChange={() => toggle("inAppChat")}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Email"
        caption="Sent to the address on your account."
        flush
      >
        <SettingsList>
          <SettingsSwitchField
            id="notify-email-documents"
            label="Documents"
            description="Daily digest of what is waiting."
            checked={prefs.emailDocuments}
            onCheckedChange={() => toggle("emailDocuments")}
          />
          <SettingsSwitchField
            id="notify-email-absences"
            label="Absences"
            description="Only when status changes."
            checked={prefs.emailAbsences}
            onCheckedChange={() => toggle("emailAbsences")}
          />
          <SettingsSwitchField
            id="notify-email-chat"
            label="Chat"
            description="Overnight summary if you missed messages."
            checked={prefs.emailChat}
            onCheckedChange={() => toggle("emailChat")}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Quiet hours"
        caption="Pauses banners and email from 21:00 to 07:00. Same-day absences still come through."
        flush
      >
        <SettingsSwitchField
          id="notify-quiet-hours"
          label="Use quiet hours"
          checked={prefs.quietHours}
          onCheckedChange={() => toggle("quietHours")}
        />
      </SettingsSection>
    </SettingsPane>
  );
}
