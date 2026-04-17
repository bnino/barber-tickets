import { db } from "./firebaseService";
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
    serverTimestamp,
    limit,
} from "firebase/firestore";
import type { Ticket } from "../types";

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
        date: serverTimestamp(),
    });
};

export const startService = async (ticketId: string) => {
    const q = query(
        collection(db, "tickets"),
        where("status", "==", "in_progress")
    );

    const snap = await getDocs(q);

    // Finalizar el actual si existe
    snap.forEach(async (docSnap) => {
        await updateDoc(doc(db, "tickets", docSnap.id), {
            status: "done",
            time_end: serverTimestamp(),
        });
    });

    // Marcar el nuevo como atendiendo
    await updateDoc(doc(db, "tickets", ticketId), {
        status: "in_progress",
        time_start: serverTimestamp(),
    });
};

export const finishService = async (ticketId: string) => {
    await updateDoc(doc(db, "tickets", ticketId), {
        status: "done",
        time_end: serverTimestamp(),
    });

    await startNextWaiting();
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
            time_start: serverTimestamp(),
        });
    }
};

export const markNoShow = async (ticketId: string) => {
    await updateDoc(doc(db, "tickets", ticketId), {
        status: "no_show",
        time_end: serverTimestamp(),
    });

    await startNextWaiting();
};