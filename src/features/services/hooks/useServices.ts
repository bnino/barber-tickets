import { useEffect, useState } from "react";
import type { Service } from "../../../shared/types";

import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";
import { db } from "../../../shared/services/firebaseService";


export function useServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "services"), orderBy("name", "asc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];

            setServices(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const createService = async (data: { name: string; price: number }) => {
        if (!data.name || data.price <= 0) {
            throw new Error("Datos inválidos");
        }
        await addDoc(collection(db, "services"), {
            name: data.name,
            price: data.price,
            is_active: true
        });
    };

    const updateService = async (
        id: string,
        data: { name: string; price: number }
    ) => {
        await updateDoc(doc(db, "services", id), data);
    };

    const deleteService = async (id: string) => {
        await deleteDoc(doc(db, "services", id));
    };

    return {
        services,
        loading,
        createService,
        updateService,
        deleteService
    };
}