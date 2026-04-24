
import { TICKET_STATUS } from "../constants/tickets";


import { memo } from "react";
import type { Ticket } from "../../../shared/types";

type Props = {
    tickets: Ticket[];
    servicesMap: Record<string, { name: string; price: number }>;
    onStart: (id: string) => void;
    hasActiveService: boolean;
    loadingId: string | null;
    user: any;
};

function TicketTable({
    tickets,
    onStart,
    hasActiveService,
    loadingId,
    user
}: Props) {
    return (
        <div className="relative -mx-4 sm:mx-0 overflow-x-auto">
            
            <table className="min-w-162.5 w-full divide-y divide-gray-200 bg-white table-fixed">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="pl-1 w-12">#</th>
                        <th className="w-1/3 px-4 py-3 text-left text-sm font-semibold text-gray-600">Cliente</th>
                        <th className="w-1/6 px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Servicio</th>
                        <th className="w-1/3 px-4 py-3 text-left text-sm font-semibold text-gray-600 md:table-cell">Estado</th>
                        {user?.role === "admin" && (
                            <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-gray-600">Acción</th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {tickets.map((t, i) => (
                        <tr
                            key={t.id}
                            className="duration-300 hover:bg-gray-50 transition-colors">
                            <td className="w-10 text-center text-sm text-gray-700">
                                {i + 1}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800 truncate">
                                {t.clientNameFormatted}
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                                {t.serviceName ?? "--"}</td>
                            <td className="px-4 py-3 text-gray-600 sm:table-cell">
                                {t.status === TICKET_STATUS.IN_PROGRESS ? (
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

                            {user?.role === "admin" && (
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center">
                                        <button
                                            disabled={
                                                loadingId === t.id ||
                                                (hasActiveService && t.status !== TICKET_STATUS.IN_PROGRESS)
                                            }
                                            onClick={() => onStart(t.id)}
                                            className={`
                                                        rounded-lg px-4 py-2 text-sm font-semibold transition
                                                        ${loadingId === t.id
                                                    ? "bg-gray-400 cursor-wait"
                                                    : t.status === TICKET_STATUS.IN_PROGRESS
                                                        ? "bg-green-600 cursor-default"
                                                        : hasActiveService
                                                            ? "bg-gray-300 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                                }
                                                `}
                                        >
                                            {loadingId === t.id
                                                ? "Cargando..."
                                                : t.status === TICKET_STATUS.IN_PROGRESS
                                                    ? "En Atención"
                                                    : "Iniciar Atención"}
                                        </button>

                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(TicketTable);