import { getColorByIndex } from "../../../shared/utils/chartColors";
import { Cell } from "recharts";

import { formatCOP } from "../../../shared/utils/currency";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import EmptyState from "./EmptyState";

type TooltipEntry = {
    payload: { count: number };
};


type Props = {
    data: {
        cashTotal: number;
        nequiTotal: number;
        cashCount: number;
        nequiCount: number;
    };
};

export default function PaymentsMethodChart({ data }: Props) {

    const chartData = [
        {
            name: "Efectivo",
            value: data.cashTotal,
            count: data.cashCount
        },
        {
            name: "Nequi",
            value: data.nequiTotal,
            count: data.nequiCount
        }
    ].filter(d => d.value > 0);

    return (
        <div className="bg-white rounded-xl shadow p-4 w-full min-h-75">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Métodos de pago
            </h3>

            {chartData.length === 0 ? (
                <EmptyState
                    title="Sin pagos registrados"
                    description="Los pagos aparecerán cuando finalices servicios"
                />
            ) : (
                <ResponsiveContainer width="100%" height={256}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={getColorByIndex(index)}
                                />
                            ))}
                        </Pie>

                        <Tooltip

                            contentStyle={{
                                backgroundColor: "#ffffff",
                                padding: 12,
                                borderRadius: 5,
                                boxShadow: "0 10px 15px rgba(0, 0, 0, 0.08)",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                border: "1px solid #000"
                            }}
                            itemStyle={{
                                color: "#000",
                            }}
                            formatter={(value, name, entry: unknown) => {
                                const typed = entry as TooltipEntry;
                                const amount = typeof value === "number" ? value : 0;
                                return [
                                    `${formatCOP(amount)} (${typed.payload.count} pagos)`,
                                    name
                                ];
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {chartData.map((item, index) => (
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