import { useState } from "react";

import { useSettingsForm } from "../features/settings/hooks/useSettingsForm";

import { useAlert } from "../features/tickets/hooks/useAlert";

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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">

                <h1 className="text-xl font-bold mb-6">
                    ⚙️ Configuración del negocio
                </h1>

                <button
                    onClick={async () => {

                        setShowAnnouncementModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold transition hover:bg-blue-600 cursor-pointer"
                >
                    Crear anuncio
                </button>

                <div className="bg-gray-50 p-4 rounded-xl border">
                    <label className="text-sm font-semibold">Nombre del negocio</label>
                    <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-black"
                    />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">Estado del negocio</span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition ${isOpen ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {isOpen ? "Abierto" : "Cerrado"}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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