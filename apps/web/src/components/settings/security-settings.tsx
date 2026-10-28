"use client";

import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@internium/ui/components/dialog";
import { Field, FieldGroup, FieldLabel } from "@internium/ui/components/field";
import { Input } from "@internium/ui/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@internium/ui/components/item";
import { useState } from "react";
import { toast } from "sonner";
import {
  SettingsPane,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsSwitchField } from "@/components/settings/settings-switch-field";

const INITIAL_SESSIONS = [
  {
    id: "this",
    device: "Chrome on Windows",
    detail: "Bucharest · This device",
    current: true,
  },
  {
    id: "phone",
    device: "Safari on iPhone",
    detail: "Cluj-Napoca · 2 days ago",
    current: false,
  },
];

export function SecuritySettings({ description }: { description: string }) {
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  return (
    <SettingsPane description={description}>
      <SettingsSection
        title="Password"
        description="Used with your school email. A coordinator cannot see it."
      >
        <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
          <DialogTrigger render={<Button variant="outline" />}>
            Change password
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>
                Use at least 8 characters. You will stay signed in on this
                device.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="security-current">
                  Current password
                </FieldLabel>
                <Input
                  id="security-current"
                  type="password"
                  autoComplete="current-password"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="security-new">New password</FieldLabel>
                <Input
                  id="security-new"
                  type="password"
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="security-confirm">
                  Confirm new password
                </FieldLabel>
                <Input
                  id="security-confirm"
                  type="password"
                  autoComplete="new-password"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setPasswordOpen(false);
                  toast.success("Password updated");
                }}
              >
                Update password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsSection>

      <SettingsSection
        title="Two-factor authentication"
        description="Ask for a code from your authenticator app after your password."
      >
        <SettingsSwitchField
          id="security-2fa"
          label="Require a second step"
          description="Recommended for coordinators and anyone who reviews documents."
          checked={twoFactor}
          onCheckedChange={(checked) => {
            setTwoFactor(checked);
            toast.success(
              checked ? "Two-factor turned on" : "Two-factor turned off",
            );
          }}
        />
      </SettingsSection>

      <SettingsSection
        title="Sessions"
        description="Devices that are currently signed in to Internium."
        footer={
          sessions.some((session) => !session.current) ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSessions((current) =>
                  current.filter((session) => session.current),
                );
                toast.success("Signed out of other devices");
              }}
            >
              Sign out of other devices
            </Button>
          ) : null
        }
      >
        <ItemGroup className="gap-1">
          {sessions.map((session) => (
            <Item key={session.id} size="sm">
              <ItemContent>
                <ItemTitle>{session.device}</ItemTitle>
                <ItemDescription>{session.detail}</ItemDescription>
              </ItemContent>
              <ItemActions>
                {session.current ? (
                  <Badge variant="secondary">This device</Badge>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSessions((current) =>
                        current.filter((item) => item.id !== session.id),
                      );
                      toast.success(`Signed out of ${session.device}`);
                    }}
                  >
                    Sign out
                  </Button>
                )}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SettingsSection>
    </SettingsPane>
  );
}
