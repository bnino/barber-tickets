import { memo, useEffect, useState } from "react";
import { useAlert } from "../../tickets/hooks/useAlert";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; price: number }) => Promise<void>;
    initialData?: { name: string; price: number } | null;
    isEditing?: boolean;
};

function ServiceModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEditing
}: Props) {
    const alert = useAlert();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(String(initialData.price));
        } else {
            setName("");
            setPrice("");
        }
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

                <h2 className="text-lg font-bold mb-4">
                    {isEditing ? "Editar servicio" : "Nuevo servicio"}
                </h2>

                <input
                    placeholder="Nombre del servicio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={async () => {
                            if (!name || !price) {
                                alert.warning("Campos incompletos");
                                return;
                            }

                            if (Number(price) <= 0) {
                                alert.warning("Precio inválido");
                                return;
                            }

                            // Confirmación si está editando
                            if (isEditing) {
                                const confirm = await alert.confirm(
                                    "¿Guardar cambios en el servicio?"
                                );

                                if (!confirm.isConfirmed) return;
                            }

                            await onSubmit({
                                name,
                                price: Number(price)
                            });

                            alert.success(
                                isEditing
                                    ? "Servicio actualizado"
                                    : "Servicio creado"
                            );

                            onClose();
                        }}
                        className="px-3 py-2 bg-black text-white rounded"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ServiceModal);