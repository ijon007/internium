import { welcomeMessage } from "@internium/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <p className="text-sm text-foreground">{welcomeMessage}</p>
      <Link className="underline underline-offset-4" href="/dashboard">
        Continue to Internium
      </Link>
    </main>
  );
}
