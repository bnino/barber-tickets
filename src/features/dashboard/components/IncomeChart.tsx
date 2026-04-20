import ChartTooltip from "../../../shared/components/ChartTooltip";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import EmptyState from "./EmptyState";

type Props = {
    data: { label: string; value: number }[];
};



export default function IncomeChart({ data }: Props) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full min-h-75">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Ingresos totales
            </h3>
            {data.length === 0 ? (
                <EmptyState
                    title="Sin ingresos registrados"
                    description="Los ingresos aparecerán cuando finalices servicios"
                />
            ) : (
                <div className="h-64" >
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data}>
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="value" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}