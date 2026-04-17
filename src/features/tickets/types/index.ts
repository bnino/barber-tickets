// 🟦 TIPOS
export type TicketStatus =
    | "waiting"
    | "in_progress"
    | "done"
    | "no_show"
    | "cancelled";

export interface Ticket {
    id: string;
    client_name: string;
    service_id: string;
    status: TicketStatus;
    date?: any;
    price?: number;
    payment_method?: "cash" | "nequi";
    finished_at?: any;
}

export interface EnrichedTicket extends Ticket {
    clientNameFormatted: string;
    serviceName: string;
}

export interface Service {
    id: string;
    name: string;
    price: number;
}

