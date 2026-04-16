import { useEffect, useMemo, useState } from "react";
import { subscribeToTickets, addTicket, startService, finishService, markNoShow } from "../services/ticketService";
import { subscribeToServices } from "../services/servicesService";
import type { Ticket, Service } from "../types";

export default function Home() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState("");

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

    const servicesMap = useMemo(() => {
        return services.reduce<Record<string, string>>((acc, s) => {
            acc[s.id] = s.name;
            return acc;
        }, {});
    }, [services]);

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
        await startService(ticketId);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg">
                {current && (
                    <div
                        key={current.id}
                        className="relative mb-6 flex h-40 flex-col items-center justify-center border border-blue-200 -bg-linear-210 from-emerald-700 to-green-300 text-white shadow-lg animate-fade-in animate-pulse-once rounded-2xl bg-blue-50 p-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold uppercase tracking-wide opacity-100">✂️ Atendiendo ahora</h2>
                            <strong className="mt-2 block text-2xl font-bold">{current.client_name}</strong>
                            <span className="text-sm font-semibold opacity-90">
                                {servicesMap[current.service_id]}
                            </span>
                        </div>
                        <div className="absolute bottom-1 right-1 flex flex-col items-end gap-1">
                            <button
                                onClick={() => finishService(current.id)}
                                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition cursor-pointer"
                            >
                                Finalizar
                            </button>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    markNoShow(current.id);
                                }}
                                className="text-xs font-stretch-50% text-black underline-offset-4 hover:underline transition-all cursor-pointer"
                            >
                                No llegó / Cancelar
                            </a>
                        </div>
                    </div>
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
                                                <td className="px-4 py-3 font-medium text-gray-800 truncate">{t.client_name}</td>
                                                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{services.find(s => s.id === t.service_id)?.name || "Servicio no encontrado"}</td>
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
                                                            disabled={hasActiveService && t.status !== "in_progress"}
                                                            onClick={() => {
                                                                if (hasActiveService) return;
                                                                startServiceHandler(t.id);
                                                            }}
                                                            className={`
                                                        rounded-lg px-4 py-2 text-sm font-semibold transition
                                                        ${t.status === "in_progress"
                                                                    ? "bg-green-600 cursor-default"
                                                                    : hasActiveService
                                                                        ? "bg-gray-300 cursor-not-allowed"
                                                                        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                                                }
                                                        disabled:opacity-60 disabled:cursor-not-allowed
                                                `}
                                                        >
                                                            {t.status === "in_progress" ? "En Atención" : "Iniciar Atención"}
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
