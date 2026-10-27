import { redirect } from "next/navigation";
import { ROLE_PATH } from "@/constants/roles";

export default function DashboardIndexPage() {
  redirect(ROLE_PATH);
}
