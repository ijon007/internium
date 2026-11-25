import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Internium account.",
};

export default function SignInPage() {
  return (
    <AuthPage>
      <SignIn />
    </AuthPage>
  );
}
