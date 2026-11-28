"use client";

import { api } from "@internium/backend/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import { Input } from "@internium/ui/components/input";
import { CameraIcon, CheckIcon } from "@phosphor-icons/react";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  SettingsFieldRow,
  SettingsList,
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { ROLE_LABELS } from "@/constants/roles";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { getInitials } from "@/utils/chat";

const ROW_INPUT =
  "h-8 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0 md:text-xs";

export function AccountSettings() {
  const profile = useAccountProfile();
  return <AccountFields key={profile.user?.id} profile={profile} />;
}

function AccountFields({
  profile,
}: {
  profile: ReturnType<typeof useAccountProfile>;
}) {
  const updateProfile = useMutation(api.users.updateOwnProfile);
  const fileRef = useRef<HTMLInputElement>(null);
  const [draftName, setName] = useState<string>();
  const [draftPhone, setPhone] = useState<string>();
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>();
  const [saving, setSaving] = useState(false);
  const name = draftName ?? profile.name;
  const phone = draftPhone ?? profile.phone;
  const avatar = photo === undefined ? profile.avatar : (photo?.preview ?? "");
  const preview = photo?.preview;
  const dirty =
    name !== profile.name || phone !== profile.phone || photo !== undefined;

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  async function save() {
    if (!profile.user || !profile.ready || saving) return;
    setSaving(true);
    try {
      if (name !== profile.name || phone !== profile.phone) {
        await updateProfile({ name, phone });
      }
      if (photo !== undefined) {
        await profile.user.setProfileImage({ file: photo?.file ?? null });
        await profile.user.reload();
      }
      setName(undefined);
      setPhone(undefined);
      setPhoto(undefined);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsPane>
      <SettingsSection
        title="Profile"
        caption="Shown in chat, documents, and the sidebar."
        flush
        footer={
          <Button
            type="button"
            disabled={
              !profile.ready || saving || !dirty || name.trim().length === 0
            }
            onClick={() => void save()}
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
                  {getInitials(name || profile.email || "Account")}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon-xs"
                variant="outline"
                className="absolute -right-1 -bottom-1 rounded-full bg-background"
                disabled={!profile.ready || saving}
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
                  setPhoto({ file, preview: URL.createObjectURL(file) });
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">
                {name || "Your name"}
              </p>
              <p className="truncate text-[11px] leading-snug text-muted-foreground">
                {profile.email}
              </p>
            </div>
            {avatar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!profile.ready || saving}
                onClick={() => setPhoto(profile.avatar ? null : undefined)}
              >
                Remove
              </Button>
            ) : null}
          </div>
          <SettingsFieldRow id="account-name" label="Name">
            <Input
              id="account-name"
              disabled={!profile.ready || saving}
              value={name}
              autoComplete="name"
              className={ROW_INPUT}
              onChange={(event) => setName(event.target.value)}
            />
          </SettingsFieldRow>
          <SettingsFieldRow id="account-phone" label="Phone">
            <Input
              id="account-phone"
              disabled={!profile.ready || saving}
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
              {profile.email}
            </p>
          </SettingsFieldRow>
          <SettingsFieldRow id="account-role" label="Role">
            <div id="account-role" className="flex justify-end">
              <Badge variant="secondary">
                {profile.role ? ROLE_LABELS[profile.role] : "—"}
              </Badge>
            </div>
          </SettingsFieldRow>
        </SettingsList>
      </SettingsSection>
    </SettingsPane>
  );
}
