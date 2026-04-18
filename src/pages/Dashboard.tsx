import StatsCard from "../features/dashboard/components/StatsCard";
import FilterTabs from "../features/dashboard/components/FilterTabs";
import IncomeChart from "../features/dashboard/components/IncomeChart";
import ServicesChart from "../features/dashboard/components/ServicesChart";
import IncomeByService from "../features/dashboard/components/IncomeByServiceChart";

import { useSettings } from "../features/settings/hooks/useSettings";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";

import { formatCOP } from "../shared/utils/currency";

import FloatingMenu from "../shared/components/FloatingMenu";


export default function Dashboard() {
    const { stats, loading, filter, setFilter, incomeChart, servicesChart, incomeByService } = useDashboard();
    const { companyName } = useSettings();

    if (loading) return <p className="p-6">Cargando...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mb-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">
                        {companyName}
                    </h1>
                </div>
            <div className="border-t border-gray-300 my-6" />
                <h3 className="text-2xl font-bold text-gray-900">
                    📊 Dashboard
                </h3>
                <p className="text-sm text-gray-500">
                    Resumen de ingresos y servicios
                </p>
            </div>

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
            </div>

            <FloatingMenu />
        </div>
    );
}