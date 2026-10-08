import { welcomeMessage } from "@internium/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-black">{welcomeMessage}</p>
    </main>
  );
}
