import { useEffect, useState } from "react";
import type { Timestamp } from "firebase/firestore";

export function useElapsedTime(startedAt?: Timestamp) {
    const [elapsed, setElapsed] = useState("00:00");

    useEffect(() => {
        if (!startedAt) {
            setElapsed("00:00");
            return;
        }

        const startMs = startedAt.toDate().getTime();

        const tick = () => {
            const diff = Math.max(0, Date.now() - startMs);
            const totalSeconds = Math.floor(diff / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            setElapsed(
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return elapsed;
}