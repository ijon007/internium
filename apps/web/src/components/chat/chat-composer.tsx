"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@internium/ui/components/input-group";
import {
  AtIcon,
  PaperPlaneRightIcon,
  PlusIcon,
  SmileyIcon,
} from "@phosphor-icons/react";
import { type FormEvent, type KeyboardEvent, useState } from "react";

type ChatComposerProps = {
  name: string;
};

export function ChatComposer({ name }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0;

  const clearIfSendable = () => {
    if (!canSend) return;
    setDraft("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearIfSendable();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    clearIfSendable();
  };

  return (
    <form className="px-4 pt-1 pb-3" onSubmit={onSubmit}>
      <InputGroup className="h-auto items-stretch rounded-lg bg-background shadow-none">
        <InputGroupTextarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Message ${name}`}
          rows={1}
          className="max-h-40 min-h-10 px-3 py-2.5 text-sm"
        />
        <InputGroupAddon
          align="block-end"
          className="justify-between px-1.5 pb-1.5"
        >
          <div className="flex items-center gap-0.5">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              aria-label="Attach file"
            >
              <PlusIcon />
            </InputGroupButton>
            <InputGroupButton size="icon-xs" variant="ghost" aria-label="Emoji">
              <SmileyIcon />
            </InputGroupButton>
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              aria-label="Mention"
            >
              <AtIcon />
            </InputGroupButton>
          </div>
          <InputGroupButton
            type="submit"
            size="icon-xs"
            variant={canSend ? "default" : "ghost"}
            disabled={!canSend}
            aria-label="Send"
          >
            <PaperPlaneRightIcon weight="fill" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
