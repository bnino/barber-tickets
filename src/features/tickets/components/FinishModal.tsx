import { memo } from "react";

import { formatCOP } from "../../../shared/utils/currency";

type Props = {
    isOpen: boolean;
    price: number | null;
    setPrice: (value: number | null) => void;
    paymentMethod: "cash" | "nequi";
    setPaymentMethod: (value: "cash" | "nequi") => void;
    onClose: () => void;
    onConfirm: () => void;
};

function FinishModal({
    isOpen,
    price,
    setPrice,
    paymentMethod,
    setPaymentMethod,
    onClose,
    onConfirm
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

                <h2 className="text-lg font-bold mb-4">
                    Finalizar servicio
                </h2>

                <p className="text-sm font-semibold mb-2">Cancela</p>

                <div className="flex items-center border rounded mb-3 px-2">
                    <span className="text-gray-500 font-semibold">$</span>
                    <input
                        type="text"
                        placeholder="0"
                        value={price !== null ? formatCOP(price) : ""}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, ""); 
                            setPrice(raw ? Number(raw) : null);
                        }}
                        className="w-full p-2 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">
                        Método de pago
                    </p>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === "cash"}
                                onChange={() => setPaymentMethod("cash")}
                            />
                            💵 Efectivo
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === "nequi"}
                                onChange={() => setPaymentMethod("nequi")}
                            />
                            📱 Nequi
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-3 py-2 bg-green-600 text-white rounded"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(FinishModal);