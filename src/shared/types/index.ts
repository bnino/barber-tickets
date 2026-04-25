import type { Timestamp } from "firebase/firestore";

/* ========================
   TICKETS
======================== */

export type TicketStatus =
    | "waiting"
    | "in_progress"
    | "done"
    | "no_show";

export type Ticket = {
  id: string;
  client_name: string;
  clientNameFormatted: string;
  service_id: string;
  serviceName?: string;
  status: TicketStatus;
  price?: number; 
  payment_method?: "cash" | "nequi";
  createdAt: Timestamp;
  started_at?: Timestamp;
  finished_at?: Timestamp;
};

/* ========================
   SERVICES
======================== */
export type Service = {
  id?: string;
  name: string;
  price: number;
  createdAt?: Timestamp;
};

/* ========================
   USERS
======================== */
export type UserDB = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: Timestamp;
};

/* ========================
   SETTINGS
======================== */
export type Settings = {
  company_name: string;
  is_open: boolean;
  working_days: string[];
};

/* ========================
   ANNOUNCEMENTS
======================== */
export type Announcement = {
  id?: string;
  message: string;
  type: "info" | "warning" | "success";
  startDate: Timestamp;
  endDate: Timestamp;
  active?: boolean;
  createdAt?: Timestamp;
};

