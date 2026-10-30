"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CHAT_PATH } from "@/constants/chat";
import { getRoleHref } from "@/utils/navigation";

/** Messaging hands off to Chat; the conversation itself lives there. */
export function useMentorMessage() {
  const router = useRouter();
  return (name: string) => {
    toast(`Opening chat with ${name}`);
    router.push(getRoleHref("business-mentor", CHAT_PATH));
  };
}
