import { useEffect, useState } from "react";
import { subscribeToSettings } from "../services/settingsService";

import type { Settings } from "../../../shared/types";

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const unsub = subscribeToSettings(setSettings);
        return () => unsub();
    }, []);

    return {
        settings,
        companyName: settings?.company_name || "BarberApp",
        isOpen: settings?.is_open ?? true,
        workingDays: settings?.working_days || []
    };
}