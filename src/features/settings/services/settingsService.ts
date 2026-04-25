import { db } from "../../../shared/services/firebaseService";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import type { Settings } from "../../../shared/types";

export const subscribeToSettings = (callback: (data: Settings) => void) => {
    const ref = doc(db, "settings", "general");

    const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            callback(snap.data() as Settings);
        }
    });

    return unsub;
};

export const updateSettings = async (data: Partial<Settings>) => {
    const ref = doc(db, "settings", "general");
    await updateDoc(ref, data);
};