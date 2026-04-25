import { useEffect, useState } from "react";
import { subscribeToActiveAnnouncements } from "../services/announcementService";
import type { Announcement } from "../../../shared/types";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const unsub = subscribeToActiveAnnouncements(setAnnouncements);
    return () => unsub();
  }, []);

  return announcements;
}