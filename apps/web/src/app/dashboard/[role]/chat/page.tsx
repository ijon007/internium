import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { isRole } from "@/utils/navigation";

export const metadata: Metadata = {
  title: "Chat",
  description: "Message the people you work with.",
};

export default function ChatPage(props: PageProps<"/dashboard/[role]/chat">) {
  return (
    <Suspense>
      <ChatPageContent {...props} />
    </Suspense>
  );
}

async function ChatPageContent({
  params,
}: PageProps<"/dashboard/[role]/chat">) {
  const { role } = await params;
  if (!isRole(role)) notFound();

  return <ChatWorkspace />;
}
