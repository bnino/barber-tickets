import { useEffect, useMemo, useState } from "react";
import { subscribeToTickets, addTicket, startService, finishService, markNoShow } from "../services/ticketService";
import { subscribeToServices } from "../services/servicesService";
import type { Ticket, Service } from "../types";
import Swal from "sweetalert2";
import CurrentTicket from "../components/CurrentTicket";
import TicketTable from "../components/TicketTable";
import ReserveForm from "../components/ReserveForm";

export default function Home() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState("");

    const [loadingId, setLoadingId] = useState<string | null>(null);

    const current = useMemo(
        () => tickets.find(t => t.status === "in_progress"),
        [tickets]
    );
    const hasActiveService = Boolean(current);

    // 🟩 LEER TURNOS EN TIEMPO REAL
    useEffect(() => {
        const unsub = subscribeToTickets(setTickets);
        return () => unsub();
    }, []);

    // 🟩 LEER SERVICIOS EN TIEMPO REAL
    useEffect(() => {
        const unsub = subscribeToServices(setServices);
        return () => unsub();
    }, []);

    const servicesMap = useMemo(
        () =>
            Object.fromEntries(
                services.map(s => [s.id, s.name])
            ),
        [services]
    );

    const capitalizeWords = (text: string) => {
        if (!text) return "";

        return text
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // AGREGAR NUEVO TURNO
    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientName || !serviceId) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Debes ingresar nombre y servicio"
            });
            return;
        }
        await addTicket(clientName, serviceId);

        setClientName("");
        setServiceId("");
        setShowForm(false);
    };

    // INICIAR ATENCIÓN DE UN TURNO
    const startServiceHandler = async (ticketId: string) => {
        try {
            setLoadingId(ticketId);
            await startService(ticketId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    // CLIENTE NO LLEGÓ
    const handleNoShow = async (ticketId: string) => {
        const result = await Swal.fire({
            title: "¿El cliente no llegó?",
            text: "Se marcará como cancelado y se llamará el siguiente turno",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No"
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

            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar el turno",
                    icon: "error"
                });
            } finally {
                setLoadingId(null);
            }

        }
    };

    //FINALIZAR ATENCIÓN DE UN TURNO
    const handleFinish = async (ticketId: string) => {
        try {
            setLoadingId(ticketId);
            await finishService(ticketId);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg">
                {current && (
                    <CurrentTicket
                        id={current.id}
                        clientName={capitalizeWords(current.client_name)}
                        serviceName={servicesMap[current.service_id]}
                        onFinish={handleFinish}
                        onNoShow={handleNoShow}
                        loading={loadingId === current.id}
                    />
                )}

                <h1 className="text-3xl font-bold mb-4">💈 Turnos de Hoy</h1>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-5">
                    {tickets.length === 0 ?
                        (
                            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                                No hay turnos reservados.
                            </div>
                        ) :
                        (
                            <TicketTable
                                tickets={tickets}
                                servicesMap={servicesMap}
                                capitalizeWords={capitalizeWords}
                                onStart={startServiceHandler}
                                hasActiveService={hasActiveService}
                                loadingId={loadingId}
                            />

                        )
                    }

                </div>
                <div className="mt-7.5 p-5 rounded-xl bg-gray-100 shadow-lg text-center">

                    <button className="px-6 py-3.5 text-base font-semibold rounded-lg border-none cursor-pointer bg-gray-900 text-white transition-transform duration-150 ease-in-out hover:bg-black hover:scale-105" onClick={() => setShowForm(prev => !prev)}>
                        Reservar turno
                    </button>

                    {showForm && (
                        <ReserveForm
                            clientName={clientName}
                            setClientName={setClientName}
                            serviceId={serviceId}
                            setServiceId={setServiceId}
                            services={services}
                            onSubmit={handleReserve}
                        />
                    )}
                </div>

            </div>
        </div>

    );
}
