import { useState } from "react";
import { useServices } from "../hooks/useServices";
import ServiceModal from "./ServiceModal";
import { useAlert } from "../../../shared/hooks/useAlert";
import { formatCOP } from "../../../shared/utils/currency";

import type { Service } from "../../../shared/types";

export default function ServiceList() {
    const { services, createService, updateService, deleteService } = useServices();
    const alert = useAlert();

    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📋 Servicios</h2>

                <button
                    onClick={() => {
                        setEditingService(null);
                        setShowModal(true);
                    }}
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition"
                >
                    + Nuevo
                </button>
            </div>

            <div className="space-y-2">
                {services.map((s) => (
                    <div
                        key={s.id}
                        className="flex justify-between items-center p-3 border-b shadow-lg rounded"
                    >
                        <div>
                            <p className="font-semibold truncate">{s.name}</p>
                            <p className="text-sm text-gray-500">$ {formatCOP(s.price)}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (!s.id) return;
                                    setEditingService(s);
                                    setShowModal(true);
                                }}
                                className="cursor-pointer text-indigo-600 hover:text-indigo-800 text-sm transition"
                            >
                                Editar
                            </button>

                            <button
                                onClick={async () => {
                                    if (!s.id) return;
                                    const confirm = await alert.confirm("¿Eliminar este servicio?");
                                    if (!confirm.isConfirmed) return;
                                    await deleteService(s.id);
                                    alert.success("Servicio eliminado");
                                }}
                                className="cursor-pointer text-red-600 text-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ServiceModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                initialData={editingService}
                isEditing={!!editingService}
                onSubmit={async (data) => {
                    if (editingService) {
                        await updateService(editingService.id!, data);
                    } else {
                        await createService(data);
                    }
                }}
            />
        </div>
    );
}