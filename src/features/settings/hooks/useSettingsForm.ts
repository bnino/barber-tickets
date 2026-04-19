import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";
import { updateSettings } from "../services/settingsService";
import { sanitizeText } from "../../../shared/utils/sanitize";

export function useSettingsForm() {
    const { settings } = useSettings();

    const [companyName, setCompanyName] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [workingDays, setWorkingDays] = useState<string[]>([]);

    const cleanCompanyName = sanitizeText(companyName);

    useEffect(() => {
        if (settings) {
            setCompanyName(settings.company_name);
            setIsOpen(settings.is_open);
            setWorkingDays(settings.working_days || []);
        }
    }, [settings]);

    const toggleDay = (day: string) => {
        setWorkingDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const save = async () => {
        await updateSettings({
            company_name: cleanCompanyName,
            is_open: isOpen,
            working_days: workingDays
        });
    };

    return {
        companyName,
        setCompanyName,
        isOpen,
        setIsOpen,
        workingDays,
        toggleDay,
        save
    };
}