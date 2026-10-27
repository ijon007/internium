import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { getInitials } from "@/utils/chat";

const SQUIRCLE =
  "rounded-[calc(var(--radius-sm)+2px)] after:rounded-[calc(var(--radius-sm)+2px)]";

type ChatAvatarProps = {
  name: string;
  src: string;
  size?: "default" | "sm" | "lg";
};

export function ChatAvatar({ name, src, size = "default" }: ChatAvatarProps) {
  return (
    <Avatar size={size} className={SQUIRCLE}>
      <AvatarImage
        src={src}
        alt={name}
        className="rounded-[calc(var(--radius-sm)+2px)]"
      />
      <AvatarFallback className="rounded-[calc(var(--radius-sm)+2px)]">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
