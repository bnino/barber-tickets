import { useState } from "react";

import CurrentTicket from "../features/tickets/components/CurrentTicket";
import TicketTable from "../features/tickets/components/TicketTable";
import ReserveForm from "../features/tickets/components/ReserveForm";

import { useTickets } from "../features/tickets/hooks/useTickets";
import { useAlert } from "../features/tickets/hooks/useAlert";

import { capitalizeWords } from "../shared/utils/format";
import Swal from "sweetalert2";

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState("");
    const [serviceId, setServiceId] = useState("");
    const alert = useAlert();

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
                        clientName={capitalizeWords(current.client_name)}
                        serviceName={servicesMap[current.service_id]}
                        onFinish={async (id) => {
                            const res = await handleFinish(id);

                            if (!res?.ok) {
                                alert.error(res?.message || "Error al finalizar");
                            }
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
        </div>

    );
}
