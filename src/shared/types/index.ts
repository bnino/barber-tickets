import type { Timestamp } from "firebase/firestore";

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
  date?: Timestamp;
  createdAt?: Timestamp;
  started_at?: Timestamp;
  finished_at?: Timestamp;
};

export type Service = {
  id?: string;
  name: string;
  price: number;
  createdAt?: Timestamp;
};

export type UserDB = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: Timestamp;
};

export type Settings = {
  company_name: string;
  is_open: boolean;
  working_days: string[];
};

export type Announcement = {
  id?: string;
  message: string;
  type: "info" | "warning" | "success";
  startDate: Timestamp;
  endDate: Timestamp;
  active?: boolean;
  createdAt?: Timestamp;
};

