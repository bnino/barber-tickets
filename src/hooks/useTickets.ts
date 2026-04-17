import { useEffect, useMemo, useState } from "react"; 

import { capitalizeWords } from "../utils/format";

import { TICKET_STATUS } from "../constants/tickets";

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
    
    const servicesMap = useMemo(
        () => Object.fromEntries(services.map(s => [s.id, s.name])),
        [services]
    );

    const enrichedTickets = useMemo(() => {
    return tickets.map(t => ({
        ...t,
        clientNameFormatted: capitalizeWords(t.client_name),
        serviceName: servicesMap[t.service_id] ?? "—"
    }));
}, [tickets, servicesMap]);

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
        () => tickets.find(t => t.status === TICKET_STATUS.IN_PROGRESS),
        [tickets]
    );

    const hasActiveService = Boolean(current);


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
        tickets: enrichedTickets,
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