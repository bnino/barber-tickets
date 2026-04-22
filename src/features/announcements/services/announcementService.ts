import { db } from "../../../shared/services/firebaseService";

import type { Announcement } from "../types/announcements";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

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

    const data = snap.docs
      .map(doc => ({ 
        id: doc.id, 
        ...(doc.data() as Omit<Announcement, "id">)
      }))
      .filter(a => {
        const start = a.start_date.toDate();
        const end = a.end_date.toDate();
        return now >= start && now <= end;
      });

    callback(data);
  });
}