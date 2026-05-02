import { useEffect } from "react";
import { useTickets } from "../features/tickets/hooks/useTickets";
import { useSettings } from "../features/settings/hooks/useSettings";
import { useElapsedTime } from "../shared/hooks/useElapsedTime";
import MusicPlayer from "../features/music/components/MusicPlayer";

export default function PublicQueue() {
    const { tickets, current } = useTickets();
    const { companyName, isOpen } = useSettings();
    const waiting = tickets.filter(t => t.status === "waiting");
    const elapsed = useElapsedTime(current?.time_start);

    useEffect(() => {
        if (!current) return;
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {});
    }, [current?.id]);

    return (
        <div className="h-screen w-screen bg-black text-white flex overflow-hidden">

            {/* IZQUIERDA — Turnos */}
            <div className="flex flex-col w-1/2 h-full p-8 border-r border-white/10 overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">💈 {companyName}</h1>
                    <span className={`text-xl font-semibold ${isOpen ? "text-green-400" : "text-red-400"}`}>
                        {isOpen ? "🟢 Abierto" : "🔴 Cerrado"}
                    </span>
                </div>

                {/* Turno activo */}
                <div className="text-center mb-10">
                    <p className="text-2xl opacity-70">Atendiendo</p>
                    <h2 className="text-6xl font-bold mt-2 text-indigo-300">
                        {current?.clientNameFormatted || "---"}
                    </h2>
                    <p className="text-2xl opacity-80 mt-2">
                        {current?.serviceName || ""}
                    </p>
                    {current && (
                        <p className="text-3xl font-mono opacity-60 mt-3">
                            ⏱ {elapsed}
                        </p>
                    )}
                </div>

                {/* Cola de espera */}
                <div className="mt-10">
                    <p className="text-2xl mb-4 opacity-70">En espera</p>
                    <div className="grid grid-cols-2 gap-6">
                        {waiting.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-2">
                                No hay turnos en espera
                            </p>
                        ) : (
                            waiting.map((t, index) => {
                                const isNext = index === 0;
                                return (
                                    <div
                                        key={t.id}
                                        className={`
                                            rounded-xl p-4 text-center transition-all duration-300
                                            ${isNext
                                                ? "bg-yellow-400/20 border-2 border-yellow-400 scale-105 animate-pulse"
                                                : "bg-white/10"
                                            }
                                        `}
                                    >
                                        <p className="text-sm opacity-70">
                                            Turno #{index + 1}
                                        </p>
                                        <p className="text-2xl font-semibold">
                                            {t.clientNameFormatted}
                                        </p>
                                        <p className="text-sm opacity-70">
                                            {t.serviceName}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* DERECHA — Música */}
            <div className="w-1/2 h-full p-8">
                <MusicPlayer />
            </div>

        </div>
    );
}