import { disableNetwork, enableNetwork } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebaseService";

async function checkRealConnectivity(): Promise<boolean> {
    try {
        await fetch(`https://www.gstatic.com/generate_204?_=${Date.now()}`, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
        });
        return true;
    } catch {
        return false;
    }
}

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const goOnline = () => {
            setIsOnline(true);
            enableNetwork(db).catch(() => {});
        };

        const goOffline = () => {
            setIsOnline(false);
            disableNetwork(db).catch(() => {});
        };

        checkRealConnectivity().then((real) => {
            if (!real) goOffline();
        });

        const interval = setInterval(async () => {
            const real = await checkRealConnectivity();
            setIsOnline(prev => {
                if (!real && prev) { goOffline(); return false; }
                if (real && !prev) { goOnline(); return true; }
                return prev;
            });
        }, 8000);

        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        return () => {
            clearInterval(interval);
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    return { isOnline };
}