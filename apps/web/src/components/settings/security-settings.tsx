"use client";

import { Badge } from "@internium/ui/components/badge";
import { Button } from "@internium/ui/components/button";
import {
  Dialog,
  DialogClose,
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
  CheckIcon,
  DeviceMobileIcon,
  MonitorIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  SettingsList,
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
    kind: "desktop",
  },
  {
    id: "phone",
    device: "Safari on iPhone",
    detail: "Cluj-Napoca · 2 days ago",
    current: false,
    kind: "phone",
  },
] as const;

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessions, setSessions] = useState(() => [...INITIAL_SESSIONS]);

  return (
    <SettingsPane>
      <SettingsSection title="Sign-in" flush>
        <SettingsList>
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <span className="text-xs leading-none font-medium">Password</span>
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                Change
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change password</DialogTitle>
                  <DialogDescription>
                    At least 8 characters. You stay signed in here.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="gap-3">
                  <Field>
                    <FieldLabel htmlFor="security-current">Current</FieldLabel>
                    <Input
                      id="security-current"
                      type="password"
                      autoComplete="current-password"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="security-new">New</FieldLabel>
                    <Input
                      id="security-new"
                      type="password"
                      autoComplete="new-password"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="security-confirm">Confirm</FieldLabel>
                    <Input
                      id="security-confirm"
                      type="password"
                      autoComplete="new-password"
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                  <Button
                    type="button"
                    onClick={() => {
                      setPasswordOpen(false);
                      toast.success("Password updated");
                    }}
                  >
                    <CheckIcon weight="fill" />
                    Update password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <SettingsSwitchField
            id="security-2fa"
            label="Two-factor authentication"
            description="Code from your authenticator app."
            checked={twoFactor}
            onCheckedChange={(checked) => {
              setTwoFactor(checked);
              toast.success(
                checked ? "Two-factor turned on" : "Two-factor turned off",
              );
            }}
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Sessions"
        caption="Devices signed in to Internium."
        flush
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
        <SettingsList>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-2.5 px-3 py-2"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {session.kind === "phone" ? (
                  <DeviceMobileIcon className="size-3.5" />
                ) : (
                  <MonitorIcon className="size-3.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs leading-none font-medium">
                  {session.device}
                </p>
                <p className="mt-0.5 truncate text-[11px] leading-snug text-muted-foreground">
                  {session.detail}
                </p>
              </div>
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
            </div>
          ))}
        </SettingsList>
      </SettingsSection>
    </SettingsPane>
  );
}
