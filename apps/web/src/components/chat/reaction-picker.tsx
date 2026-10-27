"use client";

import { REACTION_EMOJIS } from "@/constants/chat";

type ReactionPickerProps = {
  onPick: (emoji: string) => void;
};

export function ReactionPicker({ onPick }: ReactionPickerProps) {
  return (
    <div className="flex gap-0.5">
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onPick(emoji)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-base transition-colors duration-150 ease-out-strong hover:bg-muted active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
