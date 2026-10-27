"use client";

import { Card, CardContent } from "@internium/ui/components/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@internium/ui/components/item";
import { CaretRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { ICON_WEIGHT } from "@/constants/navigation";
import { ROLE_ICONS } from "@/constants/role-icons";
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLE_PICKER_ORDER,
} from "@/constants/roles";
import { getRoleHref } from "@/utils/navigation";

export function RolePicker() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="size-12"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-3xl tracking-tight">
              Choose your role
            </h1>
            <p className="text-muted-foreground text-sm">
              Internium looks different for each person in the school. Pick the
              workspace that matches how you work.
            </p>
          </div>
        </header>
        <Card className="w-full">
          <CardContent>
            <ItemGroup className="gap-2">
              {ROLE_PICKER_ORDER.map((role) => {
                const Icon = ROLE_ICONS[role];
                return (
                  <Item
                    key={role}
                    variant="outline"
                    className="active:scale-[0.98] motion-reduce:active:scale-100"
                    render={<Link href={getRoleHref(role, "")} />}
                  >
                    <ItemMedia variant="icon">
                      <Icon weight={ICON_WEIGHT} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{ROLE_LABELS[role]}</ItemTitle>
                      <ItemDescription>
                        {ROLE_DESCRIPTIONS[role]}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <CaretRightIcon weight={ICON_WEIGHT} />
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
