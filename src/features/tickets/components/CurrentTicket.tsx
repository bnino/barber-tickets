import { memo } from "react";
import type { AppUser } from "../../auth/context/AuthContext";
import type { Timestamp } from "firebase/firestore";
import { useElapsedTime } from "../../../shared/hooks/useElapsedTime";

type Props = {
    id: string;
    clientName: string;
    serviceName: string;
    timeStart?: Timestamp;
    onFinish: (id: string) => void;
    onNoShow: (id: string) => void;
    loading: boolean;
    user: AppUser | null;
};

function CurrentTicket({ id, clientName, serviceName, timeStart, onFinish, onNoShow, loading, user }: Props) {
    const elapsed = useElapsedTime(timeStart);

    return (
        <div
            className="relative mb-6 flex h-40 flex-col items-center justify-center rounded-2xl text-white shadow-md p-6"
            style={{ background: "linear-gradient(135deg, #0f766e 0%, #059669 100%)" }}
        >
            <div className="text-center">
                <h2 className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-1">
                    ✂️ Atendiendo ahora
                </h2>
                <strong className="block text-3xl font-bold leading-tight">
                    {clientName}
                </strong>
                <span className="text-sm font-medium opacity-75 mt-1 block">
                    {serviceName || "Servicio"}
                </span>
            </div>

            <div className="absolute bottom-3 left-4">
                <span className="text-xs font-mono opacity-70">⏱ {elapsed}</span>
            </div>

            {user?.role === "admin" && (
                <div className="absolute bottom-3 right-4 flex flex-col items-end gap-1.5">
                    <button
                        onClick={() => onFinish(id)}
                        disabled={loading}
                        className="rounded-lg px-4 py-1.5 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
                        style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", color: "white" }}
                    >
                        {loading ? "Cargando..." : "Finalizar"}
                    </button>
                    <button
                        type="button"
                        onClick={() => onNoShow(id)}
                        disabled={loading}
                        className="text-xs font-medium underline underline-offset-2 disabled:opacity-50 cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none" }}
                    >
                        {loading ? "Procesando..." : "No llegó / Cancelar"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default memo(CurrentTicket);