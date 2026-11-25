import { welcomeMessage } from "@internium/ui";
import { AuthControls } from "@/components/auth/auth-controls";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-end gap-2 p-4">
        <AuthControls />
      </header>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-foreground">{welcomeMessage}</p>
      </div>
    </main>
  );
}
