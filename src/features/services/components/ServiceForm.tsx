import { useState, useEffect } from "react";

type Props = {
    initialData?: { name: string; price: number };
    onSubmit: (data: { name: string; price: number }) => void;
    onCancel: () => void;
};

export default function ServiceForm({ initialData, onSubmit, onCancel }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
        }
    }, [initialData]);

    return (
        <div className="bg-white p-4 rounded-xl shadow mb-4">

            <h2 className="font-bold mb-3">
                {initialData ? "Editar servicio" : "Nuevo servicio"}
            </h2>

            <div className="flex flex-col gap-3">

                <input
                    placeholder="Nombre del servicio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Precio"
                    value={price ?? ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer px-3 py-2 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            if (!name || !price) return;
                            onSubmit({ name, price });
                        }}
                        className="cursor-pointer px-3 py-2 bg-black text-white rounded"
                    >
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}