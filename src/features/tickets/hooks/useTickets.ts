import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
    subscribeToTickets,
    addTicket,
    startService,
    finishService,
    markNoShow,
    startNextWaiting,
} from "../services/ticketService";
import { subscribeToServices } from "../services/servicesService";
import type { Ticket, Service } from "../../../shared/types";
import { capitalizeWords } from "../../../shared/utils/format";

type ApiResponse = { ok: true } | { ok: false; message: string };

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const shouldAutoStart = useRef(false);

    const servicesMap = useMemo(
        () => Object.fromEntries(services.map(s => [s.id, s])),
        [services]
    );

    const enrichedTickets = useMemo(
        () =>
            tickets.map(t => ({
                ...t,
                clientNameFormatted: t.client_name
                ? capitalizeWords(t.client_name)
                : "Sin nombre",
                serviceName: servicesMap[t.service_id]?.name ?? "Servicio",
            })),
        [tickets, servicesMap]
    );

    useEffect(() => {

        const unsubTickets = subscribeToTickets((data) => {
            setTickets(data);
            setLoading(false);

            if (shouldAutoStart.current) {
                const hasActive = data.some(t => t.status === "in_progress");
                const nextWaiting = data.find(t => t.status === "waiting");

                if (!hasActive && nextWaiting) {
                    shouldAutoStart.current = false;
                    startNextWaiting().catch(() => {});
                } else {
                    shouldAutoStart.current = false;
                }
            }
        });

        const unsubServices = subscribeToServices(setServices);

        return () => {
            unsubTickets();
            unsubServices();
        };
    }, []);

    const handleReserve = useCallback(async (
        clientName: string,
        serviceId: string
    ): Promise<ApiResponse> => {
        if (!clientName || !serviceId) {
            return { ok: false, message: "Campos incompletos" };
        }
        addTicket(clientName, serviceId).catch(() => {});
        return { ok: true };
    }, []);

    const startServiceHandler = useCallback(async (
        ticketId: string
    ): Promise<ApiResponse> => {
        setLoadingId(ticketId);
        startService(ticketId).catch(() => {});
        setLoadingId(null);
        return { ok: true };
    }, []);

    const handleFinish = useCallback(async (
        ticketId: string,
        data: { price: number; payment_method: "cash" | "nequi" }
    ): Promise<ApiResponse> => {
        setLoadingId(ticketId);
        shouldAutoStart.current = true;
        finishService(ticketId, data).catch(() => {});
        setLoadingId(null);
        return { ok: true };
    }, []);

    const handleNoShow = useCallback(async (
        ticketId: string
    ): Promise<ApiResponse> => {
        setLoadingId(ticketId);
        shouldAutoStart.current = true;
        markNoShow(ticketId).catch(() => {});
        setLoadingId(null);
        return { ok: true };
    }, []);

    const hasActiveService = enrichedTickets.some(t => t.status === "in_progress");
    const current = enrichedTickets.find(t => t.status === "in_progress") ?? null;
    const waitingTickets = enrichedTickets.filter(t => t.status === "waiting");

    return {
        tickets: enrichedTickets,   
        services,                   
        current,                    
        loading,
        loadingId,
        hasActiveService,
        waitingTickets,
        handleReserve,
        startServiceHandler,
        handleFinish,               
        handleNoShow,               
    };
}