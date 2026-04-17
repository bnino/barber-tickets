import { useEffect, useMemo, useState } from "react";
import { subscribeToTickets } from "../features/tickets/services/ticketService";
import { subscribeToServices } from "../features/tickets/services/servicesService";
import { Timestamp } from "firebase/firestore";
import type { Ticket, Service } from "../features/tickets/types";

export default function PublicQueue() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [now, setNow] = useState(() => Date.now());

    // Reloj para cronómetro
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // TURNOS EN TIEMPO REAL
    useEffect(() => {
        return subscribeToTickets(setTickets);
    }, []);

    // SERVICIOS
    useEffect(() => {
        return subscribeToServices(setServices);
    }, []);

    const servicesMap = useMemo(() => {
        return services.reduce<Record<string, string>>((acc, s) => {
            acc[s.id] = s.name;
            return acc;
        }, {});
    }, [services]);

    const current = tickets.find(t => t.status === "in_progress");
    const next = tickets.filter(t => t.status === "waiting").slice(0, 5);

    // Tiempo transcurrido
    const getElapsed = (start?: Timestamp) => {
        if (!start) return "";
        const diff = Math.floor((now - start.toDate().getTime()) / 1000);
        const min = Math.floor(diff / 60);
        const sec = diff % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gray-700 text-white flex flex-col p-10">

            {/* ATENDIENDO */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-widest text-gray-300 mb-4">
                    ✂️ ATENDIENDO AHORA
                </h1>

                {current ? (
                    <div className="bg-green-400 rounded-3xl p-10 shadow-xl">
                        <h2 className="text-6xl font-extrabold">
                            {current.client_name}
                        </h2>
                        <p className="text-2xl mt-2 opacity-90">
                            {servicesMap[current.service_id]}
                        </p>
                        <p className="mt-4 text-xl">
                            ⏱ {getElapsed((current as Ticket & { time_start?: Timestamp }).time_start)}
                        </p>
                        
                    </div>
                ) : (
                    <p className="text-3xl text-gray-400">
                        No hay nadie siendo atendido
                    </p>
                )}
            </div>

            {/* SIGUIENTES */}
            <div>
                <h2 className="text-3xl font-semibold mb-4 text-gray-300">
                    🕒 SIGUIENTES EN COLA
                </h2>

                {next.length === 0 ? (
                    <p className="text-2xl text-gray-400">
                        No hay clientes en espera
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {next.map((t, i) => (
                            <li
                                key={t.id}
                                className="bg-gray-800 rounded-xl p-6 flex justify-between items-center text-2xl"
                            >
                                <span>
                                    {i + 1}. {t.client_name}
                                </span>
                                <span className="opacity-80">
                                    {servicesMap[t.service_id]}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
