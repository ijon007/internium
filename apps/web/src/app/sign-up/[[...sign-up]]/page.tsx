import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Internium account.",
};

export default function SignUpPage() {
  return (
    <AuthPage>
      <SignUp />
    </AuthPage>
  );
}
