import { useEffect, useState, useMemo } from "react";
import { getRecentTickets } from "../services/dashboardService";

let cache: any = null;
let lastFetch = 0;
const CACHE_TIME = 1000 * 60 * 5; // 5 minutos

type FilterType = "today" | "week" | "month" | "lastSevenDays";

export function useDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState<FilterType>("today");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (cache && Date.now() - lastFetch < CACHE_TIME) {
            return;
        }

        const load = async () => {

            const res = await getRecentTickets();
            setData(res);
            setLoading(false)
        };
        load();
    }, []);

    const filteredData = useMemo(() => {
        const now = new Date();

        return data.filter(t => {
            if (!t.finished_at) return false;

            const date = t.finished_at.toDate();

            if (filter === "today") {
                return date.toDateString() === now.toDateString();
            }

            if (filter === "lastSevenDays") {
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo;
            }

            if (filter === "week") {
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay();
                const diff = day === 0 ? -6 : 1 - day;

                startOfWeek.setDate(now.getDate() + diff);
                startOfWeek.setHours(0, 0, 0, 0);

                return date >= startOfWeek;
            }

            if (filter === "month") {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return date >= startOfMonth;
            }

            return true;
        });
    }, [data, filter]);

    const stats = useMemo(() => {
        const total = filteredData.reduce((acc, t) => acc + (t.price || 0), 0);
        const count = filteredData.length;
        const average = count ? total / count : 0;

        return { total, count, average };
    }, [filteredData]);

    return {
        stats,
        filter,
        setFilter,
        loading
    };
}