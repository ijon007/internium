import { welcomeMessage } from "@internium/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-foreground">{welcomeMessage}</p>
    </main>
  );
}
