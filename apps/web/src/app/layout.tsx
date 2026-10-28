import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@internium/ui/components/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Internium",
  description: "Welcome to Internium",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = (
    <html
      lang="en"
      className={cn("h-full", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );

  if (!publishableKey) {
    return content;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>
  );
}
