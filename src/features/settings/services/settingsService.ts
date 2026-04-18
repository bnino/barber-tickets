import { db } from "../../../shared/services/firebaseService";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export const subscribeToSettings = (callback: (data: any) => void) => {
    const ref = doc(db, "settings", "general");

    const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            callback(snap.data());
        }
    });

    return unsub;
};

export const updateSettings = async (data: any) => {
    const ref = doc(db, "settings", "general");
    await updateDoc(ref, data);
};