"use client";

import {
  RadioGroup,
  RadioGroupItem,
} from "@internium/ui/components/radio-group";
import {
  BriefcaseIcon,
  BuildingsIcon,
  CheckIcon,
  type Icon,
  LockSimpleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  SettingsList,
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsSwitchField } from "@/components/settings/settings-switch-field";
import { cn } from "@/lib/utils";

const MESSAGE_POLICIES = [
  {
    value: "school",
    title: "Anyone at my school",
    icon: BuildingsIcon,
  },
  {
    value: "placement",
    title: "People on my placement",
    icon: BriefcaseIcon,
  },
  {
    value: "nobody",
    title: "People I already chat with",
    icon: LockSimpleIcon,
  },
] as const;

type MessagePolicy = (typeof MESSAGE_POLICIES)[number]["value"];

function MessagePolicyOption({
  value,
  title,
  icon: Icon,
  selected,
}: {
  value: MessagePolicy;
  title: string;
  icon: Icon;
  selected: boolean;
}) {
  const id = `chat-policy-${value}`;
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 px-3 py-2 transition-transform duration-100 ease-out",
        "active:scale-[0.99]",
        "has-[:focus-visible]:bg-muted/60",
      )}
    >
      <Icon
        className="size-4 shrink-0 text-muted-foreground"
        weight={selected ? "fill" : "regular"}
      />
      <span className="min-w-0 flex-1 text-xs leading-none font-medium">
        {title}
      </span>
      <span
        className={cn(
          "flex size-4 items-center justify-center text-primary",
          selected ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <CheckIcon className="size-3.5" weight="bold" />
      </span>
      <RadioGroupItem id={id} value={value} className="sr-only" />
    </label>
  );
}

export function ChatSettings() {
  const [sound, setSound] = useState(true);
  const [enterToSend, setEnterToSend] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [policy, setPolicy] = useState<MessagePolicy>("placement");

  return (
    <SettingsPane>
      <SettingsSection title="Messages" flush>
        <SettingsList>
          <SettingsSwitchField
            id="chat-sound"
            label="Message sound"
            checked={sound}
            onCheckedChange={setSound}
          />
          <SettingsSwitchField
            id="chat-enter"
            label="Enter to send"
            description="Shift + Enter adds a line."
            checked={enterToSend}
            onCheckedChange={setEnterToSend}
          />
          <SettingsSwitchField
            id="chat-receipts"
            label="Read receipts"
            checked={readReceipts}
            onCheckedChange={setReadReceipts}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Who can message you"
        caption="Coordinators can always reach you."
        flush
      >
        <RadioGroup
          value={policy}
          onValueChange={(value) => {
            if (MESSAGE_POLICIES.some((item) => item.value === value)) {
              setPolicy(value as MessagePolicy);
            }
          }}
          className="gap-0"
        >
          <SettingsList>
            {MESSAGE_POLICIES.map((item) => (
              <MessagePolicyOption
                key={item.value}
                value={item.value}
                title={item.title}
                icon={item.icon}
                selected={policy === item.value}
              />
            ))}
          </SettingsList>
        </RadioGroup>
      </SettingsSection>
    </SettingsPane>
  );
}
