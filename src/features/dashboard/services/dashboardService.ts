import { db } from "../../../shared/services/firebaseService";
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp
} from "firebase/firestore";
import type { Ticket } from "../../../shared/types";

export async function getRecentTickets(): Promise<Ticket[]> {
    const start = new Date();
    start.setDate(start.getDate() - 30); // últimos 30 días

    const q = query(
        collection(db, "tickets"),
        //where("status", "==", "done"),
        where("finished_at", ">=", Timestamp.fromDate(start))
    );

    const snap = await getDocs(q);

    const tickets = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));

    return tickets;
};