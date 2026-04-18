import StatsCard from "../features/dashboard/components/StatsCard";
import FilterTabs from "../features/dashboard/components/FilterTabs";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";

import { formatCOP } from "../shared/utils/currency";

import FloatingMenu from "../shared/components/FloatingMenu";

export default function Dashboard() {
    const { stats, loading, filter, setFilter } = useDashboard();

    if (loading) return <p className="p-6">Cargando...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    📊 Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Resumen de ingresos y servicios
                </p>
            </div>

            <div className="mb-6 flex justify-center">
                <FilterTabs filter={filter} setFilter={setFilter} />
            </div>

            <div className="border-t border-gray-300 my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    title="Total"
                    value={`$ ${formatCOP(stats.total)}`}
                />
                <StatsCard
                    title="Servicios"
                    value={String(stats.count)}
                />
                <StatsCard
                    title="Promedio"
                    value={`$ ${formatCOP(stats.average)}`}
                />
            </div>

            <FloatingMenu />
        </div>
    );
}