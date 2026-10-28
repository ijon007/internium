"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@internium/ui/components/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@internium/ui/components/radio-group";
import { useState } from "react";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsSwitchField } from "@/components/settings/settings-switch-field";

const MESSAGE_POLICIES = [
  {
    value: "school",
    title: "Anyone at my school",
    description: "Teachers, coordinators, and students on the same campus.",
  },
  {
    value: "placement",
    title: "People on my placement",
    description: "Your mentor, coordinating teacher, and class group.",
  },
  {
    value: "nobody",
    title: "Only people I already chat with",
    description: "New conversations have to be started by a coordinator.",
  },
] as const;

type MessagePolicy = (typeof MESSAGE_POLICIES)[number]["value"];

export function ChatSettings({ description }: { description: string }) {
  const [sound, setSound] = useState(true);
  const [enterToSend, setEnterToSend] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [policy, setPolicy] = useState<MessagePolicy>("placement");

  return (
    <SettingsPane description={description}>
      <SettingsSection
        title="Messages"
        description="How chat behaves while you are in a conversation."
      >
        <FieldGroup>
          <SettingsSwitchField
            id="chat-sound"
            label="Message sound"
            description="A short tone for new messages in the open thread."
            checked={sound}
            onCheckedChange={setSound}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="chat-enter"
            label="Enter to send"
            description="Shift + Enter still adds a new line."
            checked={enterToSend}
            onCheckedChange={setEnterToSend}
          />
          <FieldSeparator />
          <SettingsSwitchField
            id="chat-receipts"
            label="Read receipts"
            description="Others can see when you have read their messages."
            checked={readReceipts}
            onCheckedChange={setReadReceipts}
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Who can message you"
        description="Coordinators can always reach you."
      >
        <FieldSet>
          <FieldLegend className="sr-only">Who can start a chat</FieldLegend>
          <RadioGroup
            value={policy}
            onValueChange={(value) => {
              if (MESSAGE_POLICIES.some((item) => item.value === value)) {
                setPolicy(value as MessagePolicy);
              }
            }}
            className="gap-4"
          >
            {MESSAGE_POLICIES.map((item) => (
              <FieldLabel
                key={item.value}
                htmlFor={`chat-policy-${item.value}`}
              >
                <Field orientation="horizontal">
                  <RadioGroupItem
                    id={`chat-policy-${item.value}`}
                    value={item.value}
                  />
                  <FieldContent>
                    <FieldTitle>{item.title}</FieldTitle>
                    <FieldDescription>{item.description}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      </SettingsSection>
    </SettingsPane>
  );
}
