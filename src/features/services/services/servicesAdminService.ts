import { db } from "../../../shared/services/firebaseService";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const createService = async (data: { name: string; price: number }) => {
    if (!data.name || data.price <= 0) {
        throw new Error("Datos inválidos");
    }
    const res = await addDoc(collection(db, "services"), data);

    return res;
};

export const updateService = async (
    id: string,
    data: { name: string; price: number }
) => {
    await updateDoc(doc(db, "services", id), data);
};

export const deleteService = async (id: string) => {
    await deleteDoc(doc(db, "services", id));
};