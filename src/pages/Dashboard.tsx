import StatsCard from "../features/dashboard/components/StatsCard";
import FilterTabs from "../features/dashboard/components/FilterTabs";

import IncomeChart from "../features/dashboard/components/IncomeChart";
import ServicesChart from "../features/dashboard/components/ServicesChart";
import IncomeByService from "../features/dashboard/components/IncomeByServiceChart";
import PaymentsChart from "../features/dashboard/components/PaymentsMethodChart";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";

import { formatCOP } from "../shared/utils/currency";

export default function Dashboard() {
    const { stats, loading, filter, setFilter, incomeChart, servicesChart, incomeByService, paymentStats } = useDashboard();

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Cargando dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h3 className="text-2xl font-bold text-gray-900">
                📊 Dashboard
            </h3>
            <p className="text-sm text-gray-500">
                Resumen de ingresos y servicios
            </p>

            <div className="mb-6 flex justify-center">
                <FilterTabs filter={filter} setFilter={setFilter} />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    title="Total"
                    value={`$ ${formatCOP(stats.total || 0)}`}
                />
                <StatsCard
                    title="Servicios"
                    value={String(stats.count)}
                />
                <StatsCard
                    title="Promedio"
                    value={`$ ${formatCOP(stats.average || 0)}`}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-5">
                <IncomeChart data={incomeChart} />
                <ServicesChart data={servicesChart} />
                <IncomeByService data={incomeByService} />
                <PaymentsChart data={paymentStats} />
            </div>

        </div>
    );
}