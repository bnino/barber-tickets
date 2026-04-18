import { useEffect, useState } from "react";
import { subscribeToSettings } from "../services/settingsService";

type Settings = {
    company_name: string;
    is_open: boolean;
    working_days: any[];
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const unsub = subscribeToSettings(setSettings);
        return () => unsub();
    }, []);

    return {
        settings,
        companyName: settings?.company_name || "Mi Negocio",
        isOpen: settings?.is_open ?? true,
        workingDays: settings?.working_days || []
    };
}