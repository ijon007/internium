import { auth } from "@clerk/nextjs/server";
import { api } from "@internium/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { FunctionArgs } from "convex/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const token =
    session.userId && (await session.getToken({ template: "convex" }));
  if (!token) return new Response("Sign-in required.", { status: 401 });

  const { id } = await params;
  if (!/^[a-z0-9]{32}$/.test(id)) {
    return new Response("Backup not found.", { status: 404 });
  }

  const backup = await fetchQuery(
    api.backups.download,
    { id: id as FunctionArgs<typeof api.backups.download>["id"] },
    { token },
  );
  if (!backup) return new Response("Backup not found.", { status: 404 });

  const archive = await fetch(backup.url, { cache: "no-store" });
  if (!archive.ok || !archive.body) {
    return new Response("Backup is temporarily unavailable.", { status: 502 });
  }

  const stamp = new Date(backup.at).toISOString().replaceAll(":", "-");
  return new Response(archive.body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="internium-${stamp}.json"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
