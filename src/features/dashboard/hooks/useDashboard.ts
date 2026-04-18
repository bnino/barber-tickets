import { useEffect, useState, useMemo } from "react";
import { getRecentTickets } from "../services/dashboardService";

import { subscribeToServices } from "../../tickets/services/servicesService";
import type { Service } from "../../tickets/types";

let cache: any = null;
let lastFetch = 0;
const CACHE_TIME = 1000 * 60 * 5; // 5 minutos

type FilterType = "today" | "week" | "month" | "lastSevenDays";

export function useDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState<FilterType>("today");
    const [loading, setLoading] = useState(true);

    const [services, setServices] = useState<Service[]>([]);

    const servicesMap = useMemo(
        () => Object.fromEntries(
            services.map(s => [s.id, { name: s.name, price: s.price }])
        ),
        [services]
    );

    useEffect(() => {

        if (cache && Date.now() - lastFetch < CACHE_TIME) {
            setData(cache);
            setLoading(false);
            return;
        }

        const load = async () => {
            const res = await getRecentTickets();
            cache = res;
            lastFetch = Date.now();
            setData(res);
            setLoading(false)
        };

        load();

        const unsubServices = subscribeToServices(setServices);
        return () => {
            unsubServices();
        };

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

        return { 
            total: Number(total) || 0, 
            count: Number(count) || 0, 
            average: Number(average) || 0 
        };
    }, [filteredData]);

    const incomeChart = useMemo(() => {
        const map: Record<string, number> = {};

        filteredData.forEach(t => {
            const date = t.finished_at.toDate();
            let key = "";

            if (filter === "today") {
                key = `${date.getHours()}:00`;
            }

            if (filter === "week" || filter === "month") {
                key = date.toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "2-digit"
                });
            }

            map[key] = (map[key] || 0) + (t.price || 0);
        });

        return Object.entries(map).map(([label, value]) => ({
            label,
            value
        }));
    }, [filteredData, filter]);

    const servicesChart = useMemo(() => {
        const map: Record<string, number> = {};

        filteredData.forEach(t => {
            const service = servicesMap[t.service_id]?.name || "Servicio";

            map[service] = (map[service] || 0) + 1;
        });

        return Object.entries(map).map(([name, count]) => ({
            name,
            count
        }));
    }, [filteredData, servicesMap]);

    const incomeByService = useMemo(() => {
        const map: Record<string, number> = {};

        filteredData.forEach(t => {
            const service = servicesMap[t.service_id]?.name || "Servicio";
            map[service] = (map[service] || 0) + (t.price || 0);
        });

        return Object.entries(map).map(([name, value]) => ({
            name,
            value
        }));
    }, [filteredData]);

    return {
        stats,
        filter,
        setFilter,
        loading,
        incomeChart,
        servicesChart,
        incomeByService
    };
}