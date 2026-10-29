import type { Metadata } from "next";
import { CoordinatorDashboard } from "@/components/coordinator/coordinator-dashboard";

export const metadata: Metadata = {
  title: "Coordinator",
  description: "Coordinator dashboard for organizing internship programs.",
};

export default function CoordinatorPage() {
  return <CoordinatorDashboard />;
}