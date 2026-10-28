"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { ROLE_LABELS } from "@/constants/roles";
import { MOCK_USER } from "@/constants/user";
import { useCurrentRole } from "@/hooks/use-current-role";
import { getInitials } from "@/utils/chat";

export function AccountSettings({ description }: { description: string }) {
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
    <SettingsPane description={description}>
      <SettingsSection
        title="Profile"
        description="This is what people see in chat, documents, and the sidebar."
        footer={
          <Button
            type="button"
            disabled={!dirty || name.trim().length === 0}
            onClick={() => toast.success("Profile saved")}
          >
            Save
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <Avatar className="size-14" size="lg">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {getInitials(name || MOCK_USER.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                Change photo
              </Button>
              {avatar ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAvatar("")}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-xs/relaxed text-muted-foreground">
              JPG or PNG. Shown as a circle.
            </p>
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
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="account-name">Name</FieldLabel>
            <Input
              id="account-name"
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="account-phone">Phone</FieldLabel>
            <Input
              id="account-phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              placeholder="Optional"
              onChange={(event) => setPhone(event.target.value)}
            />
            <FieldDescription>
              Mentors and coordinators can use this if they need to reach you.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Sign-in"
        description="Your email and role come from the school directory."
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="account-email">Email</FieldLabel>
            <Input
              id="account-email"
              type="email"
              value={MOCK_USER.email}
              readOnly
              disabled
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="account-role">Role</FieldLabel>
            <div id="account-role">
              <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
            </div>
            <FieldDescription>
              Switch roles from the picker if your school assigned more than
              one.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </SettingsSection>
    </SettingsPane>
  );
}
