"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import { Input } from "@internium/ui/components/input";
import { CameraIcon, CheckIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  SettingsFieldRow,
  SettingsList,
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { ROLE_LABELS } from "@/constants/roles";
import { MOCK_USER } from "@/constants/user";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getInitials } from "@/utils/chat";

const ROW_INPUT =
  "h-8 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0 md:text-xs";

export function AccountSettings() {
  const role = useCurrentRole();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [avatar, setAvatar] = useState(MOCK_USER.avatar);
  const dirty =
    name !== MOCK_USER.name ||
    phone !== MOCK_USER.phone ||
    avatar !== MOCK_USER.avatar;

  return (
    <SettingsPane>
      <SettingsSection
        title="Profile"
        caption="Shown in chat, documents, and the sidebar."
        flush
        footer={
          <Button
            type="button"
            disabled={!dirty || name.trim().length === 0}
            onClick={() => toast.success("Profile saved")}
          >
            <CheckIcon weight="fill" data-icon="inline-start" />
            Save
          </Button>
        }
      >
        <SettingsList>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="relative shrink-0">
              <Avatar className="size-10" size="lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>
                  {getInitials(name || MOCK_USER.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon-xs"
                variant="outline"
                className="absolute -right-1 -bottom-1 rounded-full bg-background"
                onClick={() => fileRef.current?.click()}
              >
                <CameraIcon />
                <span className="sr-only">Change photo</span>
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setAvatar(URL.createObjectURL(file));
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">
                {name || "Your name"}
              </p>
              <p className="truncate text-[11px] leading-snug text-muted-foreground">
                {MOCK_USER.email}
              </p>
            </div>
            {avatar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAvatar("")}
              >
                Remove
              </Button>
            ) : null}
          </div>
          <SettingsFieldRow id="account-name" label="Name">
            <Input
              id="account-name"
              value={name}
              autoComplete="name"
              className={ROW_INPUT}
              onChange={(event) => setName(event.target.value)}
            />
          </SettingsFieldRow>
          <SettingsFieldRow id="account-phone" label="Phone">
            <Input
              id="account-phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              placeholder="Optional"
              className={ROW_INPUT}
              onChange={(event) => setPhone(event.target.value)}
            />
          </SettingsFieldRow>
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Sign-in"
        caption="Email and role come from the school directory."
        flush
      >
        <SettingsList>
          <SettingsFieldRow id="account-email" label="Email">
            <p
              id="account-email"
              className="truncate text-xs text-muted-foreground"
            >
              {MOCK_USER.email}
            </p>
          </SettingsFieldRow>
          <SettingsFieldRow id="account-role" label="Role">
            <div id="account-role" className="flex justify-end">
              <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
            </div>
          </SettingsFieldRow>
        </SettingsList>
      </SettingsSection>
    </SettingsPane>
  );
}
