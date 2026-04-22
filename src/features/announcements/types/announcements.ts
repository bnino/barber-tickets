import { Timestamp } from "firebase/firestore";

export type Announcement = {
  id?: string;
  message: string;
  type: "info" | "warning" | "success";
  start_date: Timestamp;
  end_date: Timestamp;
  active?: boolean;
  created_at?: Timestamp;
};