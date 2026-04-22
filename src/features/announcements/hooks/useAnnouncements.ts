import { useEffect, useState } from "react";
import { subscribeToActiveAnnouncements } from "../services/announcementService";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeToActiveAnnouncements(setAnnouncements);
    return () => unsub();
  }, []);

  return announcements;
}