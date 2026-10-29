import type { Metadata } from "next";
import { CoordinatorDocuments } from "@/components/coordinator/coordinator-documents";

export const metadata: Metadata = {
  title: "Documents",
};

export default function Page() {
  return <CoordinatorDocuments />;
}
