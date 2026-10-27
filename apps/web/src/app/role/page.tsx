import type { Metadata } from "next";
import { RolePicker } from "@/components/role/role-picker";

export const metadata: Metadata = {
  title: "Choose Role",
  description: "Choose your role to continue in Internium.",
};

export default function RolePage() {
  return <RolePicker />;
}
