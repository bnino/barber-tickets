import { db } from "../../../shared/services/firebaseService";
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp
} from "firebase/firestore";

export const getRecentTickets = async () => {
    const start = new Date();
    start.setDate(start.getDate() - 30); // últimos 30 días

    const q = query(
        collection(db, "tickets"),
        where("status", "==", "done"),
        where("finished_at", ">=", Timestamp.fromDate(start))
    );

    const snap = await getDocs(q);

    const tickets = snap.docs.map(doc => doc.data());
    
    return tickets;
};