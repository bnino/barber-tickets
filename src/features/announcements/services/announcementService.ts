import { db } from "../../../shared/services/firebaseService";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import type { Announcement } from "../../../shared/types";

export async function createAnnouncement(data: Announcement) {
  return await addDoc(collection(db, "announcements"), {
    ...data,
    active: true,
    created_at: serverTimestamp()
  });
}

export function subscribeToActiveAnnouncements(callback: (data: Announcement[]) => void) {

  const q = query(
    collection(db, "announcements"),
    where("active", "==", true)
  );

  return onSnapshot(q, (snap) => {
    const now = new Date();

    const data: Announcement[] = snap.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Announcement, "id">)
      }))
      .filter(a => {
        if (!a.startDate || !a.endDate) return false;

        const start = a.startDate instanceof Timestamp
          ? a.startDate.toDate()
          : new Date(a.startDate);

        const end = a.endDate instanceof Timestamp
          ? a.endDate.toDate()
          : new Date(a.endDate);
        return now >= start && now <= end;
      });

    callback(data);
  });
}