import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc
} from "firebase/firestore";
import { db } from "../../../shared/services/firebaseService";

export type AppUser = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
};

export function useUsers() {
    const [users, setUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        const ref = collection(db, "users");

        const unsub = onSnapshot(ref, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<AppUser, "id">)
            }));
            setUsers(data);
        });

        return () => unsub();
    }, []);

    const updateRole = async (userId: string, role: "admin" | "user") => {
        const ref = doc(db, "users", userId);
        await updateDoc(ref, { role });
    };

    return {
        users,
        updateRole
    };
}