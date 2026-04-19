import { db } from "../../../shared/services/firebaseService";
import { 
    collection, 
    onSnapshot, 
    orderBy, 
    query,
    addDoc,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore";
import type { Service } from "../types";

export const subscribeToServices = (callback: (services: Service[]) => void) => {

    const q = query(collection(db, "services"), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
        const data: Service[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Service, "id">),
        }));
        callback(data);
    });
    return unsub;
};