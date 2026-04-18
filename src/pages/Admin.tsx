import { useSettingsForm } from "../features/settings/hooks/useSettingsForm";
import { useAlert } from "../features/tickets/hooks/useAlert";

import FloatingMenu from "../shared/components/FloatingMenu";

const DAYS = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo"
];

export default function Admin() {
    const alert = useAlert();

    const {
        companyName,
        setCompanyName,
        isOpen,
        setIsOpen,
        workingDays,
        toggleDay,
        save
    } = useSettingsForm();

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

                <h1 className="text-xl font-bold mb-6">
                    ⚙️ Configuración del negocio
                </h1>

                <div className="mb-4">
                    <label className="text-sm font-semibold">Nombre del negocio</label>
                    <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">Estado del negocio</span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-3 py-1 rounded text-white ${
                            isOpen ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {isOpen ? "Abierto" : "Cerrado"}
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">
                        Días laborales
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {DAYS.map(day => (
                            <label
                                key={day}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={workingDays.includes(day)}
                                    onChange={() => toggleDay(day)}
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await save();
                        alert.success("Configuración guardada");
                    }}
                    className="w-full bg-black text-white py-2 rounded"
                >
                    Guardar cambios
                </button>

            </div>
            <FloatingMenu />
        </div>
    );
}