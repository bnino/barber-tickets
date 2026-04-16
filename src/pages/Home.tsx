import { useEffect, useMemo, useState } from "react";
import { subscribeToTickets, addTicket, startService, finishService, markNoShow } from "../services/ticketService";
import { subscribeToServices } from "../services/servicesService";
import type { Ticket, Service } from "../types";
import Swal from "sweetalert2";
import CurrentTicket from "../components/CurrentTicket";

export default function Home() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState("");

    const [loadingId, setLoadingId] = useState<string | null>(null);

    const current = tickets.find(t => t.status === "in_progress");
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

        if (!clientName || !serviceId) return;

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
                            <div className="relative -mx-4 sm:mx-0 overflow-x-auto">
                                <table className="min-w-162.5 w-full divide-y divide-gray-200 bg-white table-fixed">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="pl-1 w-12">#</th>
                                            <th className="w-1/3 px-4 py-3 text-left text-sm font-semibold text-gray-600">Cliente</th>
                                            <th className="w-1/6 px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Servicio</th>
                                            <th className="w-1/3 px-4 py-3 text-left text-sm font-semibold text-gray-600 md:table-cell">Estado</th>
                                            <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-gray-600">Acción</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {tickets.map((t, i) => (
                                            <tr
                                                key={t.id}
                                                className="duration-300 hover:bg-gray-50 transition-colors">
                                                <td className="w-10 text-center text-sm text-gray-700">{i + 1}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800 truncate">{capitalizeWords(t.client_name)}</td>
                                                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{servicesMap[t.service_id] || "Servicio no encontrado"}</td>
                                                <td className="px-4 py-3 text-gray-600 sm:table-cell">
                                                    {t.status === "in_progress" ? (
                                                        <span
                                                            className="
                                                                inline-flex items-center gap-1
                                                                rounded-full bg-green-100 px-3 py-1
                                                                text-sm font-semibold text-green-700
                                                                animate-pulse
                                                            "
                                                        >
                                                            ✂️ Atendiendo
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">🕒 Esperando</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            disabled={
                                                                loadingId === t.id ||
                                                                (hasActiveService && t.status !== "in_progress")
                                                    }
                                                            onClick={() => startServiceHandler(t.id)}
                                                            className={`
                                                        rounded-lg px-4 py-2 text-sm font-semibold transition
                                                        ${loadingId === t.id
                                                                    ? "bg-gray-400 cursor-wait"
                                                                    : t.status === "in_progress"
                                                                        ? "bg-green-600 cursor-default"
                                                                        : hasActiveService
                                                                            ? "bg-gray-300 cursor-not-allowed"
                                                                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                                                }
                                                `}
                                                        >
                                                            {loadingId === t.id
                                                            ? "Cargando..."
                                                            : t.status === "in_progress"
                                                                ? "En Atención"
                                                                : "Iniciar Atención"}
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        )
                    }

                </div>
                <div className="mt-7.5 p-5 rounded-xl bg-gray-100 shadow-lg text-center">

                    <button className="px-6 py-3.5 text-base font-semibold rounded-lg border-none cursor-pointer bg-gray-900 text-white transition-transform duration-150 ease-in-out hover:bg-black hover:scale-105" onClick={() => setShowForm(true)}>
                        Reservar turno
                    </button>

                    {showForm && (
                        <form className="mt-5 flex flex-col gap-3" onSubmit={handleReserve}>
                            <input
                                className="p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:border-black"
                                placeholder="Tu nombre"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />

                            <select
                                className="p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:border-black"
                                value={serviceId}
                                onChange={(e) => {
                                    setServiceId(e.target.value);
                                }}
                            >
                                <option value="">Selecciona un servicio</option>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} - ${s.price}
                                    </option>
                                ))}
                            </select>

                            <button className="mt-2.5 p-3 text-base font-bold bg-blue-500 text-white border-none rounded-md cursor-pointer transition-colors duration-150 ease-in-out hover:bg-blue-700" type="submit">
                                Confirmar turno
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>

    );
}
