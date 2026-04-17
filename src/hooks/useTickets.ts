import { useEffect, useMemo, useState } from "react";
import {
    subscribeToTickets,
    addTicket,
    startService,
    finishService,
    markNoShow
} from "../services/ticketService";
import { subscribeToServices } from "../services/servicesService";
import type { Ticket, Service } from "../types";
import Swal from "sweetalert2";

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Subscripciones
    useEffect(() => {
        const unsubTickets = subscribeToTickets(setTickets);
        const unsubServices = subscribeToServices(setServices);

        return () => {
            unsubTickets();
            unsubServices();
        };
    }, []);

    // Derivados
    const current = useMemo(
        () => tickets.find(t => t.status === "in_progress"),
        [tickets]
    );

    const hasActiveService = Boolean(current);

    const servicesMap = useMemo(
        () => Object.fromEntries(services.map(s => [s.id, s.name])),
        [services]
    );

    // Acciones
    const handleReserve = async (clientName: string, serviceId: string) => {
        if (!clientName || !serviceId) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Debes ingresar nombre y servicio"
            });
            return false;
        }

        await addTicket(clientName, serviceId);
        return true;
    };

    const startServiceHandler = async (ticketId: string) => {
        try {
            setLoadingId(ticketId);
            await startService(ticketId);
        } finally {
            setLoadingId(null);
        }
    };

    const handleFinish = async (ticketId: string) => {
        try {
            setLoadingId(ticketId);
            await finishService(ticketId);
        } finally {
            setLoadingId(null);
        }
    };

    const handleNoShow = async (ticketId: string) => {
        const result = await Swal.fire({
            title: "¿El cliente no llegó?",
            text: "Se marcará como cancelado y se llamará el siguiente turno",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí"
        });

        if (result.isConfirmed) {
            try {
                setLoadingId(ticketId);
                await markNoShow(ticketId);
                Swal.fire({
                    title: "Cancelado",
                    text: "El turno fue marcado como no presentado",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            } finally {
                setLoadingId(null);
            }
        }
    };

    return {
        tickets,
        services,
        current,
        hasActiveService,
        servicesMap,
        loadingId,
        handleReserve,
        startServiceHandler,
        handleFinish,
        handleNoShow
    };
}