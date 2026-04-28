import { db } from "../../../shared/services/firebaseService";
import type { Ticket } from "../../../shared/types";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    Timestamp,
    limit,
} from "firebase/firestore";

export const subscribeToTickets = (callback: (tickets: Ticket[]) => void) => {
    const q = query(
        collection(db, "tickets"),
        where("status", "in", ["waiting", "in_progress"]),
        orderBy("date", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Ticket[];

        callback(data);
    });

    return unsub;
};

export const addTicket = async (clientName: string, serviceId: string) => {
    await addDoc(collection(db, "tickets"), {
        client_name: clientName,
        client_uid: null,
        barber_uid: null,
        service_id: serviceId,
        status: "waiting",
        date: Timestamp.now(), 
    });
};

export const startService = async (ticketId: string) => {
    const q = query(
        collection(db, "tickets"),
        where("status", "==", "in_progress")
    );

    const snap = await getDocs(q);

    await Promise.all(
        snap.docs.map((docSnap) =>
            updateDoc(doc(db, "tickets", docSnap.id), {
                status: "done",
                time_end: Timestamp.now(), 
            })
        )
    );

    await updateDoc(doc(db, "tickets", ticketId), {
        status: "in_progress",
        time_start: Timestamp.now(), 
    });
};

export const finishService = async (
    ticketId: string,
    data: {
        price: number;
        payment_method: "cash" | "nequi";
    }
) => {
    await updateDoc(doc(db, "tickets", ticketId), {
        status: "done",
        price: data.price,
        payment_method: data.payment_method,
        finished_at: Timestamp.now(), 
    });

};

export const startNextWaiting = async () => {
    const q = query(
        collection(db, "tickets"),
        where("status", "==", "waiting"),
        orderBy("date", "asc"),
        limit(1)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
        const next = snap.docs[0];
        await updateDoc(doc(db, "tickets", next.id), {
            status: "in_progress",
            time_start: Timestamp.now(), 
        });
    }
};

export const markNoShow = async (ticketId: string) => {
    await updateDoc(doc(db, "tickets", ticketId), {
        status: "no_show",
        time_end: Timestamp.now(), 
    });

};