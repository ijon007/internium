import type { Metadata } from "next";
import { CoordinatorClasses } from "@/components/coordinator/coordinator-classes";

export const metadata: Metadata = {
  title: "Classes",
};

export default function Page() {
  return <CoordinatorClasses />;
}
