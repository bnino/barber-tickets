type Props = {
    id: string;
    clientName: string;
    serviceName: string;
    onFinish: (id: string) => void;
    onNoShow: (id: string) => void;
    loading: boolean;
};

export default function CurrentTicket({
    id,
    clientName,
    serviceName,
    onFinish,
    onNoShow,
    loading
}: Props) {
    return (
        <div
            className="relative mb-6 flex h-40 flex-col items-center justify-center rounded-2xl bg-linear-to-r from-emerald-800 to-green-500 text-white shadow-lg p-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold uppercase tracking-wide opacity-100">
                    ✂️ Atendiendo ahora
                </h2>
                <strong className="mt-2 block text-2xl font-bold">
                    {clientName}
                </strong>
                <span className="text-sm font-semibold opacity-90">
                    {serviceName || "Servicio"}
                </span>
            </div>

            <div className="absolute bottom-1 right-1 flex flex-col items-end gap-1">
                <button
                    onClick={() => onFinish(id)}
                    disabled={loading}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition cursor-pointer disabled:bg-gray-400"
                >
                    {loading ? "Cargando..." : "Finalizar"}
                </button>
                <button
                    type="button"
                    onClick={() => onNoShow(id)}
                    disabled={loading}
                    className="text-xs font-bold text-shadow-sm/30 underline disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Procesando..." : "No llegó / Cancelar"}
                </button>
            </div>
        </div>
    )
}