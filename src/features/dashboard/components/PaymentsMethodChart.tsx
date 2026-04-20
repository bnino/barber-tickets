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

    // 👉 estado vacío bonito
    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No hay pagos en este período
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-4 w-full min-h-75">
            <h3 className="text-sm font-semibold mb-3">
                Métodos de pago
            </h3>

            <div className="h-64" >
                <ResponsiveContainer>
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
                            formatter={(value, name, props: any) => {
                                const amount = typeof value === "number" ? value : 0;
                                return [
                                    `${formatCOP(amount)} (${props.payload.count} pagos)`,
                                    name
                                ];
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}