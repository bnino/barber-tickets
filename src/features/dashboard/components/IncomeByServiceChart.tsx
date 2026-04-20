import { getColorByIndex } from "../../../shared/utils/chartColors";

import ChartTooltip from "../../../shared/components/ChartTooltip";

import CustomBar from "./CustomBar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import EmptyState from "./EmptyState";

type Props = {
    data: { name: string; value: number }[];
};

export default function IncomeByServiceChart({ data }: Props) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full min-h-75">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Ingresos por servicio</h3>

            {data.length === 0 ? (
                <EmptyState
                    title="Sin ingresos por servicios registrados"
                    description="Aquí verás cuánto has ganado por cada servicio cerrado"
                />
            ) : (
                <div className="h-64" >
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="value"
                                shape={<CustomBar />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {data.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getColorByIndex(index) }}
                        />
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}