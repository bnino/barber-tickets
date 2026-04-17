import { useEffect, useMemo, useState } from "react";

import { capitalizeWords } from "../../../shared/utils/format";
import type { ApiResponse } from "../../../shared/types/apiResponse";

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
import { handleError } from "../../../shared/utils/errorHandler";

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
    const handleReserve = async (clientName: string, serviceId: string): Promise<ApiResponse> => {
        if (!clientName || !serviceId) {
            return { ok: false, message: "Campos incompletos" };
        }

        await addTicket(clientName, serviceId);
        return { ok: true };
    };

    const startServiceHandler = async (ticketId: string): Promise<ApiResponse> => {
        try {
            setLoadingId(ticketId);
            await startService(ticketId);
            return { ok: true };
        } catch (error) {
            return handleError(error, "No se pudo iniciar el servicio");
        } finally {
            setLoadingId(null);
        }
    };

    const handleFinish = async (ticketId: string): Promise<ApiResponse> => {
        try {
            setLoadingId(ticketId);
            await finishService(ticketId);
            return { ok: true };
        } catch (error) {
            return handleError(error, "No se pudo finalizar");
        } finally {
            setLoadingId(null);
        }
    };

    const handleNoShow = async (ticketId: string): Promise<ApiResponse> => {
        const result = await Swal.fire({
            title: "¿El cliente no llegó?",
            text: "Se marcará como cancelado y se llamará el siguiente turno",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí"
        });

        if (!result.isConfirmed) return { ok: false, message: "Cancelado por el usuario" };;

        try {
            setLoadingId(ticketId);
            await markNoShow(ticketId);
            return { ok: true };
        } catch (error) {
            return handleError(error, "No se pudo cancelar el turno");
        } finally {
            setLoadingId(null);
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