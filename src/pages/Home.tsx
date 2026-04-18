import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CurrentTicket from "../features/tickets/components/CurrentTicket";
import TicketTable from "../features/tickets/components/TicketTable";
import ReserveForm from "../features/tickets/components/ReserveForm";
import FinishModal from "../features/tickets/components/FinishModal";

import { useTickets } from "../features/tickets/hooks/useTickets";
import { useAlert } from "../features/tickets/hooks/useAlert";

import FloatingMenu from "../shared/components/FloatingMenu";

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState("");
    const [serviceId, setServiceId] = useState("");
    const alert = useAlert();

    const [showFinishModal, setShowFinishModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "nequi">("cash");

    const navigate = useNavigate();

    const {
        tickets,
        services,
        current,
        hasActiveService,
        servicesMap,
        loadingId,
        handleReserve,
        startServiceHandler,
        handleFinish,
        handleNoShow
    } = useTickets();

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg">
                {current && (
                    <CurrentTicket
                        id={current.id}
                        clientName={current.clientNameFormatted}
                        serviceName={current.serviceName}

                        onFinish={(id) => {

                            const ticket = tickets.find(t => t.id === id);
                            const service = services.find(s => s.id === ticket?.service_id);

                            setPaymentMethod("cash");
                            setSelectedTicketId(id);
                            setPrice(service ? service.price : null);
                            setShowFinishModal(true);
                        }}

                        onNoShow={async (id) => {
                            const confirm = await alert.confirm(
                                "Se marcará como cancelado y se llamará el siguiente turno"
                            );

                            if (!confirm.isConfirmed) return;

                            const res = await handleNoShow(id);
                            if (!res.ok) {
                                alert.error(res?.message || "Error al cancelar");
                            } else {
                                alert.success("Turno cancelado");
                            }
                        }}
                        loading={loadingId === current.id}
                    />
                )}

                <h1 className="text-3xl font-bold mb-4">💈 Turnos Reservados</h1>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-5">
                    {tickets.length === 0 ?
                        (
                            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                                No hay turnos reservados.
                            </div>
                        ) :
                        (
                            <TicketTable
                                tickets={tickets}
                                servicesMap={servicesMap}
                                onStart={async (id) => {
                                    const res = await startServiceHandler(id);

                                    if (!res?.ok) {
                                        alert.error(res?.message || "Error al iniciar el servicio");
                                    }
                                }}
                                hasActiveService={hasActiveService}
                                loadingId={loadingId}
                            />

                        )
                    }

                </div>
                <div className="mt-7.5 p-5 rounded-xl bg-gray-100 shadow-lg text-center">

                    <button className="px-6 py-3.5 text-base font-semibold rounded-lg border-none cursor-pointer bg-gray-900 text-white transition-transform duration-150 ease-in-out hover:bg-black hover:scale-105" onClick={() => setShowForm(prev => !prev)}>
                        Reservar turno
                    </button>

                    {showForm && (
                        <ReserveForm
                            clientName={clientName}
                            setClientName={setClientName}
                            serviceId={serviceId}
                            setServiceId={setServiceId}
                            services={services}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const res = await handleReserve(clientName, serviceId);
                                if (res.ok) {
                                    setClientName("");
                                    setServiceId("");
                                    setShowForm(false);

                                    alert.success("Turno reservado");
                                } else {
                                    alert.warning(res?.message);
                                }
                            }}
                        />
                    )}
                </div>

            </div>
            <FinishModal
                isOpen={showFinishModal}
                price={price}
                setPrice={setPrice}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onClose={() => setShowFinishModal(false)}
                onConfirm={async () => {
                    if (!selectedTicketId) return;

                    if (!price || price <= 0) {
                        alert.warning("Ingresa un precio válido");
                        return;
                    }

                    const res = await handleFinish(selectedTicketId, {
                        price: price,
                        payment_method: paymentMethod
                    });

                    if (!res.ok) {
                        alert.error(res.message);
                        return;
                    }

                    alert.success("Servicio finalizado");

                    setShowFinishModal(false);
                    setPrice(null);
                    setPaymentMethod("cash");
                    setSelectedTicketId(null);
                }}
            />
            <FloatingMenu />
        </div>
    );
}
