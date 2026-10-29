import type { Metadata } from "next";
import { CoordinatorCompanies } from "@/components/coordinator/coordinator-companies";

export const metadata: Metadata = {
  title: "Companies",
};

export default function Page() {
  return <CoordinatorCompanies />;
}
