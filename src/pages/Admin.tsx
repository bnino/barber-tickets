import { useState } from "react";

import { useSettingsForm } from "../features/settings/hooks/useSettingsForm";

import { useAlert } from "../shared/hooks/useAlert";

import UsersTable from "../features/users/components/UsersTable";

import ServiceList from "../features/services/components/ServiceList";

import CreateAnnouncementModal from "../features/announcements/components/CreateAnnouncementModal";

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

    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">
                        ⚙️ Configuración del negocio
                    </h1>
                    <button
                        onClick={() => setShowAnnouncementModal(true)}
                        title="Crear anuncio"
                        className="w-9 h-9 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition cursor-pointer"
                    >
                        <span className="text-indigo-600 text-lg">📢</span>
                    </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border">
                    <label className="text-sm font-semibold">Nombre del negocio</label>
                    <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between py-3 bg-gray-50 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Estado del negocio</p>
                            <p className={`text-xs mt-0.5 ${isOpen ? "text-emerald-600" : "text-red-600"}`}>{isOpen
                                ? "Abierto — los clientes pueden reservar"
                                : "Cerrado — no se aceptan nuevos turnos"}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer border-none shrink-0
                            ${isOpen ? "bg-emerald-500" : "bg-gray-300"}`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200
                                ${isOpen ? "left-6" : "left-1"}`}
                            />
                        </button>
                    </div>
                </div>


                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">
                        Días laborales
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {DAYS.map(day => (
                            <label
                                key={day}
                                className="flex items-center gap-2 cursor-pointer text-sm capitalize"
                            >
                                <input
                                    type="checkbox"
                                    checked={workingDays.includes(day)}
                                    onChange={() => toggleDay(day)}
                                    className="accent-indigo-600 w-4 h-4"
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
                >
                    Guardar cambios
                </button>

            </div>
            <div className="max-w-3xl mt-6 mx-auto bg-white rounded-2xl shadow-xl space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <ServiceList />
                </div>
            </div>

            <div className="max-w-3xl mt-6 mx-auto bg-white rounded-2xl shadow-xl space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <UsersTable />
                </div>
            </div>

            {showAnnouncementModal && (
                <CreateAnnouncementModal
                    onClose={() => setShowAnnouncementModal(false)}
                />
            )}

        </div >
    );
}