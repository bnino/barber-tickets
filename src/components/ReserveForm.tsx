import type { Service } from "../types";

type Props = {
    clientName: string;
    setClientName: (value: string) => void;
    serviceId: string;
    setServiceId: (value: string) => void;
    services: Service[];
    onSubmit: (e: React.FormEvent) => void;
};

export default function ReserveForm({
    clientName,
    setClientName,
    serviceId,
    setServiceId,
    services,
    onSubmit
}: Props) {
    return (
        <form className="mt-5 flex flex-col gap-3" onSubmit={onSubmit}>
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
    )
}