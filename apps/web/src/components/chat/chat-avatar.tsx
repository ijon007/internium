import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@internium/ui/components/avatar";
import { getInitials } from "@/utils/chat";

const SQUIRCLE = "rounded-md after:rounded-md";

type ChatAvatarProps = {
  name: string;
  src: string;
  size?: "default" | "sm" | "lg";
};

export function ChatAvatar({ name, src, size = "default" }: ChatAvatarProps) {
  return (
    <Avatar size={size} className={SQUIRCLE}>
      <AvatarImage src={src} alt={name} className="rounded-md" />
      <AvatarFallback className="rounded-md">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
