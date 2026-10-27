import type { Notification } from "@/types/notifications";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Weekly report due",
    body: "Submit this week's practice report by Thursday.",
    time: "2h",
    read: false,
  },
  {
    id: "2",
    title: "Document approved",
    body: "Maria Popescu approved your internship agreement.",
    time: "5h",
    read: false,
  },
  {
    id: "3",
    title: "Absence recorded",
    body: "Your absence for Oct 24 was added by your mentor.",
    time: "1d",
    read: true,
  },
  {
    id: "4",
    title: "New assignment",
    body: "You were assigned to Acme Logistics for practice.",
    time: "3d",
    read: true,
  },
];
